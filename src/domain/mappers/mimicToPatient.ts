/**
 * MIMIC-IV to Patient Mapper
 *
 * Transforma datos crudos de MIMIC-IV al modelo Patient del frontend.
 */

import { Patient, MimicPatientResponse, MimicIdentifiers, VitalSigns, VitalTrends, AITrendSummary, Medication, LabResult } from '../types';
import { calculateRiskLevel } from '../validators/patientValidator';

/**
 * Mapea un paciente de MIMIC-IV al modelo Patient
 */
export function mapMimicPatientToPatient(mimicData: MimicPatientResponse): Patient {
  // Extraer identificadores MIMIC
  const mimicIds: MimicIdentifiers = {
    subjectId: mimicData.subject_id,
    hadmId: mimicData.hadm_id,
    icuStayId: mimicData.icustay_id,
    chartTime: mimicData.latest_vitals?.charttime
  };

  // Mapear demographics
  const gender = mimicData.gender === 'M' ? 'Male' : 'Female';
  const age = mimicData.anchor_age;

  // Mapear vitals (snapshot actual)
  const vitals: VitalSigns = {
    hr: mimicData.latest_vitals?.heart_rate || 0,
    rr: mimicData.latest_vitals?.resp_rate || 0,
    spo2: mimicData.latest_vitals?.spo2 || 0,
    map: calculateMAP(mimicData.latest_vitals?.sbp, mimicData.latest_vitals?.dbp),
    sbp: mimicData.latest_vitals?.sbp,
    dbp: mimicData.latest_vitals?.dbp,
    temp: mimicData.latest_vitals?.temperature || 0
  };

  // Generar trends vacíos (se llenarán con getVitalTimeSeries)
  const trends: VitalTrends = {
    hrTrend: [vitals.hr],
    rrTrend: [vitals.rr],
    spo2Trend: [vitals.spo2],
    mapTrend: [vitals.map],
    tempTrend: [vitals.temp]
  };

  // Calcular risk level basado en vitals
  const riskLevel = calculateRiskLevel(vitals);

  // Mapear diagnosis (tomar el primero si hay múltiples)
  const diagnosis = mimicData.diagnoses?.[0]?.long_title || 'Unknown';

  // Mapear ventilation status
  const ventilationSupport = mimicData.ventilation_status || 'O2';

  // Determinar bed number desde careunit
  const bedNumber = generateBedNumber(mimicData.icustay_id, mimicData.last_careunit);

  // Construir Patient
  const patient: Patient = {
    id: `mimic-${mimicData.subject_id}`,
    name: generatePatientName(mimicData.subject_id),
    // Anonimizado
    age,
    gender,
    bedNumber,
    unit: mimicData.last_careunit,
    diagnosis,
    ventilationSupport,
    riskLevel,
    sedationLevel: 'RASS 0 (Alert and calm)',
    // TODO: extraer de MIMIC si disponible
    vitals: {
      ...vitals,
      ...trends
    },
    aiInsights: undefined,
    // Se genera en frontend o backend
    aiTrendSummaries: [],
    // Se genera en frontend o backend
    medication: [],
    // TODO: mapear desde prescriptions
    labs: [],
    // TODO: mapear desde labevents
    mimic: mimicIds,
    lastUpdated: mimicData.latest_vitals?.charttime,
    admissionTime: mimicData.admittime
  };
  return patient;
}

/**
 * Calcula MAP desde SBP y DBP
 */
function calculateMAP(sbp?: number, dbp?: number): number {
  if (!sbp || !dbp) return 0;
  return Math.round((sbp + 2 * dbp) / 3);
}

/**
 * Genera un nombre anonimizado para el paciente
 */
function generatePatientName(subjectId: number): string {
  // En producción, usar nombres anonimizados reales de MIMIC
  // o mantener como "Patient {ID}"
  return `Patient ${subjectId}`;
}

/**
 * Genera bed number desde ICU stay ID y careunit
 */
function generateBedNumber(icuStayId?: number, careunit?: string): string {
  if (!icuStayId) return 'Unknown';

  // Extraer letra del sector desde careunit
  const sectorMap: Record<string, string> = {
    MICU: 'A',
    SICU: 'B',
    CCU: 'C',
    CSRU: 'D',
    TSICU: 'E'
  };
  const sector = careunit ? sectorMap[careunit] || 'X' : 'X';
  const bedNum = icuStayId % 10 + 1; // Número de cama 1-10

  return `${sector}-${bedNum}`;
}

/**
 * Mapea múltiples pacientes
 */
export function mapMimicPatientsToPatients(mimicDataArray: MimicPatientResponse[]): Patient[] {
  return mimicDataArray.map(mapMimicPatientToPatient);
}