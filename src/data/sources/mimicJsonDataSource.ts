/**
 * MIMIC-IV JSON Data Source
 *
 * Lee datos de MIMIC-IV desde archivos JSON preprocesados.
 * Útil para desarrollo/testing sin necesidad de API backend.
 */

import { Patient, VitalTimeSeries, PatientFilters, PaginatedResult, DataSourceError } from '../../domain/types';
import { mapMimicPatientToPatient } from '../../domain/mappers/mimicToPatient';

/**
 * Estructura esperada del JSON file
 */
interface MimicJsonData {
  patients: any[]; // MimicPatientResponse[]
  metadata: {
    exportDate: string;
    mimicVersion: string;
    recordCount: number;
  };
}

/**
 * MIMIC JSON Data Source
 */
export class MimicJsonDataSource {
  private data: MimicJsonData | null = null;
  private patients: Patient[] = [];
  private initialized = false;
  constructor(private jsonPath: string) {}

  /**
   * Carga y parsea el archivo JSON
   */
  async initialize(): Promise<void> {
    try {
      const response = await fetch(this.jsonPath);
      if (!response.ok) {
        throw new DataSourceError(`Failed to load JSON file: ${response.statusText}`, 'FILE_LOAD_ERROR', 'mimic-json');
      }
      this.data = await response.json();

      // Mapear datos MIMIC a Patient
      this.patients = this.data!.patients.map(mapMimicPatientToPatient);
      this.initialized = true;
      console.log(`✅ Loaded ${this.patients.length} patients from MIMIC JSON`);
    } catch (error) {
      throw new DataSourceError(`Error initializing JSON data source: ${error instanceof Error ? error.message : 'Unknown'}`, 'INIT_ERROR', 'mimic-json');
    }
  }

  /**
   * Obtiene pacientes (con filtros opcionales)
   */
  async getPatients(filters?: PatientFilters): Promise<Patient[]> {
    if (!this.initialized) {
      await this.initialize();
    }
    let filtered = [...this.patients];

    // Aplicar filtros (misma lógica que mockDataSource)
    if (filters) {
      if (filters.riskLevel && filters.riskLevel.length > 0) {
        filtered = filtered.filter(p => filters.riskLevel!.includes(p.riskLevel));
      }
      if (filters.ventilationSupport && filters.ventilationSupport.length > 0) {
        filtered = filtered.filter(p => filters.ventilationSupport!.includes(p.ventilationSupport));
      }
      if (filters.minAge !== undefined) {
        filtered = filtered.filter(p => p.age >= filters.minAge!);
      }
      if (filters.maxAge !== undefined) {
        filtered = filtered.filter(p => p.age <= filters.maxAge!);
      }
      if (filters.diagnosis) {
        filtered = filtered.filter(p => p.diagnosis.toLowerCase().includes(filters.diagnosis!.toLowerCase()));
      }
      if (filters.unit && filters.unit.length > 0) {
        filtered = filtered.filter(p => p.unit && filters.unit!.includes(p.unit));
      }
    }
    return filtered;
  }

  /**
   * Obtiene pacientes con paginación
   */
  async getPatientsPaginated(page: number = 1, pageSize: number = 12, filters?: PatientFilters): Promise<PaginatedResult<Patient>> {
    const allPatients = await this.getPatients(filters);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = allPatients.slice(start, end);
    return {
      data,
      total: allPatients.length,
      page,
      pageSize,
      hasMore: end < allPatients.length
    };
  }

  /**
   * Obtiene un paciente por ID
   */
  async getPatientById(id: string): Promise<Patient | null> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.patients.find(p => p.id === id) || null;
  }

  /**
   * Obtiene time series de vitales
   *
   * NOTA: Si el JSON incluye time series, implementar aquí.
   * Si no, retornar null y usar trends del Patient.
   */
  async getVitalTimeSeries(patientId: string, timeRange: '1h' | '4h' | '12h' | '24h' = '1h'): Promise<VitalTimeSeries | null> {
    // TODO: Implementar si el JSON incluye time series detalladas
    // Por ahora, retornar null para usar los trends del Patient
    return null;
  }

  /**
   * Metadata del dataset
   */
  getMetadata() {
    return this.data?.metadata;
  }
}

/**
 * Factory para crear instancia
 */
export function createMimicJsonDataSource(jsonPath: string): MimicJsonDataSource {
  return new MimicJsonDataSource(jsonPath);
}