/**
 * usePatient Hook
 *
 * Hook para obtener un paciente individual por ID.
 */

import { useState, useEffect, useCallback } from 'react';
import { Patient } from '../domain/types';
import { patientsRepository } from '../data/repositories/patientsRepository';
interface UsePatientResult {
  patient: Patient | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Hook para obtener un paciente por ID
 */
export function usePatient(patientId: string | null): UsePatientResult {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Carga paciente
   */
  const loadPatient = useCallback(async () => {
    if (!patientId) {
      setPatient(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await patientsRepository.getPatientById(patientId);
      setPatient(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load patient');
      setError(error);
      console.error('Error loading patient:', error);
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  /**
   * Refresca datos
   */
  const refresh = useCallback(async () => {
    await loadPatient();
  }, [loadPatient]);

  // Auto-load when patientId changes
  useEffect(() => {
    loadPatient();
  }, [loadPatient]);
  return {
    patient,
    isLoading,
    error,
    refresh
  };
}