/**
 * Mock Data Source
 *
 * Wrapper sobre el generador de mock data existente.
 * Implementa la interfaz IDataSource para consistencia.
 */

import { Patient, VitalTimeSeries, TimeSeriesPoint, PatientFilters, PaginatedResult } from '../../domain/types';
import { generateMockPatients } from '../../utils/mockData';

/**
 * Convierte los trends (number[]) a TimeSeriesPoint[]
 */
function trendsToTimeSeries(trend: number[], intervalMinutes: number = 6): TimeSeriesPoint[] {
  const now = new Date();
  return trend.map((value, index) => {
    const minutesAgo = (trend.length - 1 - index) * intervalMinutes;
    const timestamp = new Date(now.getTime() - minutesAgo * 60000);
    return {
      timestamp: timestamp.toISOString(),
      value
    };
  });
}

/**
 * Mock Data Source
 */
export class MockDataSource {
  private patients: Patient[] = [];
  private initialized = false;

  /**
   * Inicializa el data source con N pacientes
   */
  async initialize(count: number = 12): Promise<void> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    this.patients = generateMockPatients(count);
    this.initialized = true;
  }

  /**
   * Obtiene todos los pacientes (con filtros opcionales)
   */
  async getPatients(filters?: PatientFilters): Promise<Patient[]> {
    if (!this.initialized) {
      await this.initialize();
    }
    let filtered = [...this.patients];

    // Aplicar filtros
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
   * Obtiene time series de vitales para un paciente
   */
  async getVitalTimeSeries(patientId: string, timeRange: '1h' | '4h' | '12h' | '24h' = '1h'): Promise<VitalTimeSeries | null> {
    const patient = await this.getPatientById(patientId);
    if (!patient) return null;

    // Determinar intervalo según timeRange
    const intervalMinutes = {
      '1h': 6,
      '4h': 24,
      '12h': 72,
      '24h': 144
    }[timeRange];

    // Convertir trends a time series
    return {
      hr: trendsToTimeSeries(patient.vitals.hrTrend, intervalMinutes),
      rr: trendsToTimeSeries(patient.vitals.rrTrend, intervalMinutes),
      spo2: trendsToTimeSeries(patient.vitals.spo2Trend, intervalMinutes),
      map: trendsToTimeSeries(patient.vitals.mapTrend, intervalMinutes),
      temp: trendsToTimeSeries(patient.vitals.tempTrend, intervalMinutes),
      etco2: patient.vitals.etco2Trend ? trendsToTimeSeries(patient.vitals.etco2Trend, intervalMinutes) : undefined
    };
  }

  /**
   * Refresca los datos (regenera mock data)
   */
  async refresh(): Promise<void> {
    this.initialized = false;
    await this.initialize(this.patients.length);
  }
}

// Singleton instance
export const mockDataSource = new MockDataSource();