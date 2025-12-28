/**
 * MIMIC-IV API Data Source
 *
 * Conecta con un backend que expone datos de MIMIC-IV.
 * Este es un STUB para implementación futura.
 */

import { Patient, VitalTimeSeries, PatientFilters, PaginatedResult, MimicPatientResponse, MimicTimeSeriesResponse, DataSourceError } from '../../domain/types';
import { mapMimicPatientToPatient } from '../../domain/mappers/mimicToPatient';
import { mapMimicTimeSeriesResponse } from '../../domain/mappers/timeSeriesMapper';

/**
 * Configuración del API
 */
interface MimicApiConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
}

/**
 * MIMIC-IV API Data Source
 */
export class MimicApiDataSource {
  private config: MimicApiConfig;
  constructor(config: MimicApiConfig) {
    this.config = {
      timeout: 30000,
      ...config
    };
  }

  /**
   * Helper para hacer requests
   */
  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.config.apiKey && {
        Authorization: `Bearer ${this.config.apiKey}`
      }),
      ...options?.headers
    };
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new DataSourceError(`API request failed: ${response.statusText}`, `HTTP_${response.status}`, 'mimic-api');
      }
      return await response.json();
    } catch (error) {
      if (error instanceof DataSourceError) {
        throw error;
      }
      throw new DataSourceError(`Network error: ${error instanceof Error ? error.message : 'Unknown'}`, 'NETWORK_ERROR', 'mimic-api');
    }
  }

  /**
   * Obtiene pacientes desde MIMIC-IV API
   */
  async getPatients(filters?: PatientFilters): Promise<Patient[]> {
    // Construir query params
    const params = new URLSearchParams();
    if (filters?.riskLevel) {
      params.append('risk_level', filters.riskLevel.join(','));
    }
    if (filters?.ventilationSupport) {
      params.append('ventilation', filters.ventilationSupport.join(','));
    }
    if (filters?.minAge) {
      params.append('min_age', filters.minAge.toString());
    }
    if (filters?.maxAge) {
      params.append('max_age', filters.maxAge.toString());
    }
    if (filters?.diagnosis) {
      params.append('diagnosis', filters.diagnosis);
    }
    const queryString = params.toString();
    const endpoint = `/patients${queryString ? `?${queryString}` : ''}`;
    const response = await this.fetch<{
      patients: MimicPatientResponse[];
    }>(endpoint);

    // Mapear respuesta MIMIC a Patient
    return response.patients.map(mapMimicPatientToPatient);
  }

  /**
   * Obtiene pacientes con paginación
   */
  async getPatientsPaginated(page: number = 1, pageSize: number = 12, filters?: PatientFilters): Promise<PaginatedResult<Patient>> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString()
    });

    // Agregar filtros
    if (filters?.riskLevel) {
      params.append('risk_level', filters.riskLevel.join(','));
    }
    // ... otros filtros

    const response = await this.fetch<{
      patients: MimicPatientResponse[];
      total: number;
      page: number;
      page_size: number;
    }>(`/patients?${params.toString()}`);
    return {
      data: response.patients.map(mapMimicPatientToPatient),
      total: response.total,
      page: response.page,
      pageSize: response.page_size,
      hasMore: response.page * response.page_size < response.total
    };
  }

  /**
   * Obtiene un paciente por ID
   */
  async getPatientById(id: string): Promise<Patient | null> {
    try {
      const response = await this.fetch<MimicPatientResponse>(`/patients/${id}`);
      return mapMimicPatientToPatient(response);
    } catch (error) {
      if (error instanceof DataSourceError && error.code === 'HTTP_404') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Obtiene time series de vitales
   */
  async getVitalTimeSeries(patientId: string, timeRange: '1h' | '4h' | '12h' | '24h' = '1h'): Promise<VitalTimeSeries | null> {
    try {
      const response = await this.fetch<{
        time_series: MimicTimeSeriesResponse[];
      }>(`/patients/${patientId}/vitals?range=${timeRange}`);
      return mapMimicTimeSeriesResponse(response.time_series);
    } catch (error) {
      if (error instanceof DataSourceError && error.code === 'HTTP_404') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Health check del API
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.fetch<{
        status: string;
      }>('/health');
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Factory para crear instancia configurada
 */
export function createMimicApiDataSource(config: MimicApiConfig): MimicApiDataSource {
  return new MimicApiDataSource(config);
}