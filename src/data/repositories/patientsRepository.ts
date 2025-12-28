/**
 * Patients Repository
 *
 * Capa de abstracción que unifica el acceso a datos de pacientes.
 * Permite cambiar entre diferentes data sources sin afectar la UI.
 */

import { Patient, VitalTimeSeries, PatientFilters, PaginatedResult, DataSourceType, DataSourceConfig } from '../../domain/types';
import { mockDataSource } from '../sources/mockDataSource';
import { MimicApiDataSource, createMimicApiDataSource } from '../sources/mimicApiDataSource';
import { MimicJsonDataSource, createMimicJsonDataSource } from '../sources/mimicJsonDataSource';

/**
 * Interfaz común para todos los data sources
 */
interface IDataSource {
  getPatients(filters?: PatientFilters): Promise<Patient[]>;
  getPatientsPaginated(page: number, pageSize: number, filters?: PatientFilters): Promise<PaginatedResult<Patient>>;
  getPatientById(id: string): Promise<Patient | null>;
  getVitalTimeSeries(patientId: string, timeRange: '1h' | '4h' | '12h' | '24h'): Promise<VitalTimeSeries | null>;
}

/**
 * Patients Repository
 *
 * Singleton que gestiona el acceso a datos de pacientes.
 */
class PatientsRepository {
  private currentSource: IDataSource;
  private sourceType: DataSourceType = 'mock';
  constructor() {
    // Inicializar con mock data por defecto
    this.currentSource = mockDataSource;
  }

  /**
   * Configura la fuente de datos
   */
  async configure(config: DataSourceConfig): Promise<void> {
    this.sourceType = config.type;
    switch (config.type) {
      case 'mock':
        this.currentSource = mockDataSource;
        await mockDataSource.initialize();
        break;
      case 'mimic-api':
        if (!config.apiUrl) {
          throw new Error('API URL is required for mimic-api source');
        }
        this.currentSource = createMimicApiDataSource({
          baseUrl: config.apiUrl,
          apiKey: process.env.REACT_APP_MIMIC_API_KEY
        });
        break;
      case 'mimic-json':
        if (!config.jsonPath) {
          throw new Error('JSON path is required for mimic-json source');
        }
        const jsonSource = createMimicJsonDataSource(config.jsonPath);
        await jsonSource.initialize();
        this.currentSource = jsonSource;
        break;
      default:
        throw new Error(`Unknown data source type: ${config.type}`);
    }
    console.log(`✅ Configured data source: ${config.type}`);
  }

  /**
   * Obtiene el tipo de fuente actual
   */
  getSourceType(): DataSourceType {
    return this.sourceType;
  }

  /**
   * Obtiene todos los pacientes (con filtros opcionales)
   */
  async getPatients(filters?: PatientFilters): Promise<Patient[]> {
    return this.currentSource.getPatients(filters);
  }

  /**
   * Obtiene pacientes con paginación
   */
  async getPatientsPaginated(page: number = 1, pageSize: number = 12, filters?: PatientFilters): Promise<PaginatedResult<Patient>> {
    return this.currentSource.getPatientsPaginated(page, pageSize, filters);
  }

  /**
   * Obtiene un paciente por ID
   */
  async getPatientById(id: string): Promise<Patient | null> {
    return this.currentSource.getPatientById(id);
  }

  /**
   * Obtiene time series de vitales para un paciente
   */
  async getVitalTimeSeries(patientId: string, timeRange: '1h' | '4h' | '12h' | '24h' = '1h'): Promise<VitalTimeSeries | null> {
    return this.currentSource.getVitalTimeSeries(patientId, timeRange);
  }

  /**
   * Refresca los datos (si el source lo soporta)
   */
  async refresh(): Promise<void> {
    if ('refresh' in this.currentSource && typeof this.currentSource.refresh === 'function') {
      await this.currentSource.refresh();
    }
  }
}

// Singleton instance
export const patientsRepository = new PatientsRepository();