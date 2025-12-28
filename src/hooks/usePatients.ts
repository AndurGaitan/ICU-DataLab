/**
 * usePatients Hook
 *
 * Hook para obtener lista de pacientes con loading/error states.
 */

import { useState, useEffect, useCallback } from 'react';
import { Patient, PatientFilters } from '../domain/types';
import { patientsRepository } from '../data/repositories/patientsRepository';
interface UsePatientsOptions {
  filters?: PatientFilters;
  autoLoad?: boolean;
}
interface UsePatientsResult {
  patients: Patient[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Hook para obtener pacientes
 */
export function usePatients(options: UsePatientsOptions = {}): UsePatientsResult {
  const {
    filters,
    autoLoad = true
  } = options;
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Carga pacientes
   */
  const loadPatients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await patientsRepository.getPatients(filters);
      setPatients(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load patients');
      setError(error);
      console.error('Error loading patients:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  /**
   * Refresca datos
   */
  const refresh = useCallback(async () => {
    await patientsRepository.refresh();
    await loadPatients();
  }, [loadPatients]);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadPatients();
    }
  }, [autoLoad, loadPatients]);
  return {
    patients,
    isLoading,
    error,
    refresh
  };
}