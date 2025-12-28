/**
 * useDataSource Hook
 *
 * Hook para configurar y cambiar la fuente de datos.
 */

import { useState, useEffect } from 'react';
import { DataSourceType, DataSourceConfig } from '../domain/types';
import { patientsRepository } from '../data/repositories/patientsRepository';

/**
 * Hook para gestionar la configuración de data source
 */
export function useDataSource() {
  const [sourceType, setSourceType] = useState<DataSourceType>('mock');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Configura la fuente de datos
   */
  const configure = async (config: DataSourceConfig) => {
    setIsConfiguring(true);
    setError(null);
    try {
      await patientsRepository.configure(config);
      setSourceType(config.type);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsConfiguring(false);
    }
  };

  /**
   * Cambia a mock data
   */
  const useMockData = async () => {
    await configure({
      type: 'mock'
    });
  };

  /**
   * Cambia a MIMIC API
   */
  const useMimicApi = async (apiUrl: string) => {
    await configure({
      type: 'mimic-api',
      apiUrl
    });
  };

  /**
   * Cambia a MIMIC JSON
   */
  const useMimicJson = async (jsonPath: string) => {
    await configure({
      type: 'mimic-json',
      jsonPath
    });
  };
  return {
    sourceType,
    isConfiguring,
    error,
    configure,
    useMockData,
    useMimicApi,
    useMimicJson
  };
}