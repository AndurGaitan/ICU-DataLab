/**
 * Patient Validator
 *
 * Validación y cálculos derivados para Patient.
 */

import { VitalSigns } from '../types';
import { getVitalStatus } from '../../utils/vitalSignsConfig';

/**
 * Calcula risk level basado en signos vitales
 */
export function calculateRiskLevel(vitals: VitalSigns): 'low' | 'medium' | 'high' {
  const hrStatus = getVitalStatus('hr', vitals.hr);
  const rrStatus = getVitalStatus('rr', vitals.rr);
  const spo2Status = getVitalStatus('spo2', vitals.spo2);
  const mapStatus = getVitalStatus('map', vitals.map);
  const tempStatus = getVitalStatus('temp', vitals.temp);

  // Contar vitals en estado crítico
  const redCount = [hrStatus, rrStatus, spo2Status, mapStatus, tempStatus].filter(s => s === 'red').length;
  const yellowCount = [hrStatus, rrStatus, spo2Status, mapStatus, tempStatus].filter(s => s === 'yellow').length;

  // Lógica de risk level
  if (redCount >= 2) return 'high';
  if (redCount >= 1) return 'high';
  if (yellowCount >= 2) return 'medium';
  if (yellowCount >= 1) return 'medium';
  return 'low';
}

/**
 * Valida que un Patient tenga datos mínimos requeridos
 */
export function validatePatient(patient: any): boolean {
  return !!(patient.id && patient.name && patient.age && patient.gender && patient.bedNumber && patient.vitals && patient.vitals.hr !== undefined && patient.vitals.rr !== undefined && patient.vitals.spo2 !== undefined);
}