/**
 * Time Series Mapper
 * 
 * Transforma datos de time series de MIMIC-IV al formato VitalTimeSeries.
 */

import { VitalTimeSeries, TimeSeriesPoint, MimicTimeSeriesResponse } from '../types';

/**
 * Mapea respuesta de MIMIC time series a VitalTimeSeries
 */
export function mapMimicTimeSeriesResponse(mimicTimeSeries: MimicTimeSeriesResponse[]): VitalTimeSeries {
  const result: VitalTimeSeries = {};

  // Agrupar por tipo de vital sign
  mimicTimeSeries.forEach(series => {
    const points: TimeSeriesPoint[] = series.data_points.map(point => ({
      timestamp: point.charttime,
      value: point.value,
      chartTime: point.charttime
    }));

    // Asignar al vital correspondiente
    switch (series.vital_sign) {
      case 'hr':
        result.hr = points;
        break;
      case 'rr':
        result.rr = points;
        break;
      case 'spo2':
        result.spo2 = points;
        break;
      case 'map':
        result.map = points;
        break;
      case 'temp':
        result.temp = points;
        break;
      case 'etco2':
        result.etco2 = points;
        break;
    }
  });
  return result;
}

/**
 * Convierte VitalTimeSeries a formato de trends (number[])
 * para compatibilidad con código existente
 */
export function timeSeriesToTrends(timeSeries: VitalTimeSeries): {
  hrTrend: number[];
  rrTrend: number[];
  spo2Trend: number[];
  mapTrend: number[];
  tempTrend: number[];
  etco2Trend?: number[];
} {
  return {
    hrTrend: timeSeries.hr?.map(p => p.value) || [],
    rrTrend: timeSeries.rr?.map(p => p.value) || [],
    spo2Trend: timeSeries.spo2?.map(p => p.value) || [],
    mapTrend: timeSeries.map?.map(p => p.value) || [],
    tempTrend: timeSeries.temp?.map(p => p.value) || [],
    etco2Trend: timeSeries.etco2?.map(p => p.value)
  };
}

/**
 * Resamplea time series a N puntos uniformemente espaciados
 * Útil para generar trends de longitud fija (ej. 10 puntos)
 */
export function resampleTimeSeries(points: TimeSeriesPoint[], targetCount: number): number[] {
  if (points.length === 0) return [];
  if (points.length <= targetCount) {
    return points.map(p => p.value);
  }
  const result: number[] = [];
  const step = points.length / targetCount;
  for (let i = 0; i < targetCount; i++) {
    const index = Math.floor(i * step);
    result.push(points[index].value);
  }
  return result;
}

/**
 * Filtra time series por rango de tiempo
 */
export function filterTimeSeriesByRange(points: TimeSeriesPoint[], startTime: string, endTime: string): TimeSeriesPoint[] {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return points.filter(point => {
    const time = new Date(point.timestamp).getTime();
    return time >= start && time <= end;
  });
}