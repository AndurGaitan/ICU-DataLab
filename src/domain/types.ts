/**
 * Domain Types - Core business entities
 *
 * Estos tipos representan el modelo de dominio del frontend.
 * Son independientes de la fuente de datos (mock, MIMIC-IV, API, etc.)
 */

// ============================================================================
// MIMIC-IV Identifiers
// ============================================================================

/**
 * Identificadores de MIMIC-IV para trazabilidad
 * Opcionales porque mock data no los tiene
 */
export interface MimicIdentifiers {
  subjectId: number; // Unique patient identifier
  hadmId?: number; // Hospital admission ID
  icuStayId?: number; // ICU stay ID
  chartTime?: string; // ISO timestamp of the data snapshot
}

// ============================================================================
// Time Series Data
// ============================================================================

/**
 * Punto individual en una serie temporal
 */
export interface TimeSeriesPoint {
  timestamp: string; // ISO 8601 string (e.g., "2024-01-15T14:30:00Z")
  value: number; // Valor del vital sign
  chartTime?: string; // Original MIMIC charttime (si aplica)
}

/**
 * Series temporales de signos vitales
 * Estructura flexible para diferentes resoluciones y rangos
 */
export interface VitalTimeSeries {
  hr?: TimeSeriesPoint[];
  rr?: TimeSeriesPoint[];
  spo2?: TimeSeriesPoint[];
  map?: TimeSeriesPoint[];
  sbp?: TimeSeriesPoint[];
  dbp?: TimeSeriesPoint[];
  temp?: TimeSeriesPoint[];
  etco2?: TimeSeriesPoint[];
}

/**
 * Metadata de la serie temporal
 */
export interface TimeSeriesMetadata {
  startTime: string; // ISO timestamp
  endTime: string; // ISO timestamp
  resolution: 'minute' | 'hour' | 'day'; // Granularidad
  pointCount: number; // Número de puntos
  source: 'mimic' | 'mock' | 'api';
}

// ============================================================================
// Patient Core Entity
// ============================================================================

/**
 * Signos vitales actuales (snapshot)
 */
export interface VitalSigns {
  hr: number; // Heart rate (bpm)
  rr: number; // Respiratory rate (rpm)
  spo2: number; // Oxygen saturation (%)
  map: number; // Mean arterial pressure (mmHg)
  sbp?: number; // Systolic blood pressure (mmHg)
  dbp?: number; // Diastolic blood pressure (mmHg)
  temp: number; // Temperature (°C)
  etco2?: number; // End-tidal CO2 (mmHg)
}

/**
 * Trends simplificados (para compatibilidad con código actual)
 * Estos son arrays de números que representan los últimos N valores
 */
export interface VitalTrends {
  hrTrend: number[];
  rrTrend: number[];
  spo2Trend: number[];
  mapTrend: number[];
  tempTrend: number[];
  etco2Trend?: number[];
}

/**
 * AI-generated clinical insights
 */
export interface AITrendSummary {
  id: string;
  severity: 'low' | 'medium' | 'high';
  summary: string;
  analysis: string;
  contributingFactors: string[];
  recommendation: string;
  generatedAt?: string; // ISO timestamp
}

/**
 * Medication entry
 */
export interface Medication {
  name: string;
  dosage: string;
  route?: string; // IV, PO, etc.
  frequency?: string; // q6h, daily, etc.
  startTime?: string; // ISO timestamp
}

/**
 * Laboratory result
 */
export interface LabResult {
  name: string;
  value: number;
  unit: string;
  isAbnormal: boolean;
  chartTime?: string; // ISO timestamp
  referenceRange?: string; // e.g., "3.5-5.0"
}

/**
 * Patient - Core domain entity
 *
 * Este es el modelo principal que consume toda la UI.
 * Puede ser poblado desde mock data o MIMIC-IV.
 */
export interface Patient {
  // Identificación
  id: string; // Frontend ID (puede ser subjectId o generado)
  name: string; // Nombre del paciente
  age: number;
  gender: 'Male' | 'Female';

  // Ubicación (crítico para ICU)
  bedNumber: string; // e.g., "A-3"
  unit?: string; // e.g., "MICU", "SICU" (de MIMIC)

  // Clínico
  diagnosis: string; // Primary diagnosis
  ventilationSupport: 'O2' | 'NIV' | 'MV';
  riskLevel: 'low' | 'medium' | 'high'; // Calculado o precalculado
  sedationLevel: string; // e.g., "RASS -2"

  // Signos vitales (snapshot actual)
  vitals: VitalSigns & VitalTrends; // Combinación de snapshot + trends

  // AI Insights
  aiInsights?: string; // Quick insight text
  aiTrendSummaries: AITrendSummary[];

  // Tratamiento
  medication: Medication[];

  // Labs
  labs: LabResult[];

  // MIMIC-IV metadata (opcional)
  mimic?: MimicIdentifiers;

  // Metadata
  lastUpdated?: string; // ISO timestamp
  admissionTime?: string; // ISO timestamp
}

// ============================================================================
// Query & Filter Types
// ============================================================================

/**
 * Filtros para queries de pacientes
 */
export interface PatientFilters {
  riskLevel?: ('low' | 'medium' | 'high')[];
  ventilationSupport?: ('O2' | 'NIV' | 'MV')[];
  unit?: string[];
  diagnosis?: string;
  minAge?: number;
  maxAge?: number;
}

/**
 * Opciones de paginación
 */
export interface PaginationOptions {
  page: number;
  pageSize: number;
}

/**
 * Resultado paginado
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// Data Source Configuration
// ============================================================================

/**
 * Tipo de fuente de datos
 */
export type DataSourceType = 'mock' | 'mimic-api' | 'mimic-json';

/**
 * Configuración de fuente de datos
 */
export interface DataSourceConfig {
  type: DataSourceType;
  apiUrl?: string; // Para mimic-api
  jsonPath?: string; // Para mimic-json
  cacheEnabled?: boolean;
  cacheTTL?: number; // milliseconds
}

// ============================================================================
// API Response Types (para MIMIC-IV API)
// ============================================================================

/**
 * Respuesta cruda de MIMIC-IV API
 * (Estructura de ejemplo - ajustar según tu backend real)
 */
export interface MimicPatientResponse {
  subject_id: number;
  hadm_id?: number;
  icustay_id?: number;

  // Demographics
  gender: 'M' | 'F';
  anchor_age: number;

  // Admission
  admittime: string;
  dischtime?: string;
  admission_type?: string;
  admission_location?: string;

  // ICU stay
  intime?: string;
  outtime?: string;
  first_careunit?: string;
  last_careunit?: string;

  // Current vitals (latest chartevents)
  latest_vitals?: {
    charttime: string;
    heart_rate?: number;
    resp_rate?: number;
    spo2?: number;
    sbp?: number;
    dbp?: number;
    temperature?: number;
  };

  // Diagnosis
  diagnoses?: Array<{
    icd_code: string;
    icd_version: number;
    long_title: string;
  }>;

  // Ventilation
  ventilation_status?: 'O2' | 'NIV' | 'MV';
}

/**
 * Respuesta de time series de MIMIC-IV
 */
export interface MimicTimeSeriesResponse {
  subject_id: number;
  icustay_id?: number;
  vital_sign: 'hr' | 'rr' | 'spo2' | 'map' | 'temp' | 'etco2';
  data_points: Array<{
    charttime: string;
    value: number;
  }>;
}

// ============================================================================
// Error Types
// ============================================================================

export class DataSourceError extends Error {
  constructor(message: string, public code: string, public source: DataSourceType) {
    super(message);
    this.name = 'DataSourceError';
  }
}
export class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}