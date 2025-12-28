/**
 * useVitalTimeSeries Hook
 *
 * Hook para obtener time series de vitales.
 */

import { useState, useEffect, useCallback } from 'react';
import { VitalTimeSeries } from '../domain/types';
import { patientsRepository } from '../data/repositories/patientsRepository';
interface UseVitalTimeSeriesResult {
  timeSeries: VitalTimeSeries | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Hook para obtener time series de vitales
 */
export function useVitalTimeSeries(patientId: string | null, timeRange: '1h' | '4h' | '12h' | '24h' = '1h'): UseVitalTimeSeriesResult {
  const [timeSeries, setTimeSeries] = useState<VitalTimeSeries | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Carga time series
   */
  const loadTimeSeries = useCallback(async () => {
    if (!patientId) {
      setTimeSeries(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await patientsRepository.getVitalTimeSeries(patientId, timeRange);
      setTimeSeries(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load time series');
      setError(error);
      console.error('Error loading time series:', error);
    } finally {
      setIsLoading(false);
    }
  }, [patientId, timeRange]);

  /**
   * Refresca datos
   */
  const refresh = useCallback(async () => {
    await loadTimeSeries();
  }, [loadTimeSeries]);

  // Auto-load when patientId or timeRange changes
  useEffect(() => {
    loadTimeSeries();
  }, [loadTimeSeries]);
  return {
    timeSeries,
    isLoading,
    error,
    refresh
  };
}