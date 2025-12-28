import React, { Component } from 'react';
import { Patient } from '../utils/mockData';
import { getVitalColor, getVitalStatus } from '../utils/vitalSignsConfig';
interface PatientVitalsSummaryProps {
  patient: Patient;
}
/**
 * PatientVitalsSummary
 *
 * Componente que muestra los signos vitales agrupados por sistemas fisiológicos
 * con jerarquía clínica clara y tendencias visuales.
 *
 * Decisiones clínicas:
 * - Agrupación por sistemas: Respiratorio, Hemodinámico, Metabólico
 * - Color solo en valores anormales (yellow/red) para destacar lo crítico
 * - Tendencia visual con mini-sparkline de los últimos 10 puntos
 */
const PatientVitalsSummary: React.FC<PatientVitalsSummaryProps> = ({
  patient
}) => {
  // Helper para calcular tendencia (↑ estable ↓)
  const getTrendDirection = (trendArray: number[]): '↑' | '→' | '↓' => {
    if (trendArray.length < 2) return '→';
    const recent = trendArray.slice(-3); // últimos 3 puntos
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const first = recent[0];
    const last = recent[recent.length - 1];
    if (last > first + avg * 0.05) return '↑';
    if (last < first - avg * 0.05) return '↓';
    return '→';
  };
  // Helper para renderizar mini-sparkline SVG
  const renderMiniSparkline = (data: number[], color: string) => {
    if (data.length === 0) return null;
    const width = 40;
    const height = 16;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((value, index) => {
      const x = index / (data.length - 1) * width;
      const y = height - (value - min) / range * height;
      return `${x},${y}`;
    }).join(' ');
    return <svg width={width} height={height} className="inline-block ml-2">
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
      </svg>;
  };
  // Obtener estados y colores
  const spo2Status = getVitalStatus('spo2', patient.vitals.spo2);
  const rrStatus = getVitalStatus('rr', patient.vitals.rr);
  const hrStatus = getVitalStatus('hr', patient.vitals.hr);
  const mapStatus = getVitalStatus('map', patient.vitals.map);
  const tempStatus = getVitalStatus('temp', patient.vitals.temp);
  const etco2Status = patient.vitals.etco2 ? getVitalStatus('etco2', patient.vitals.etco2) : 'normal';
  const spo2Color = getVitalColor('spo2', patient.vitals.spo2);
  const rrColor = getVitalColor('rr', patient.vitals.rr);
  const hrColor = getVitalColor('hr', patient.vitals.hr);
  const mapColor = getVitalColor('map', patient.vitals.map);
  const tempColor = getVitalColor('temp', patient.vitals.temp);
  const etco2Color = patient.vitals.etco2 ? getVitalColor('etco2', patient.vitals.etco2) : '#10b981';
  return <div className="bg-white border-b border-gray-200">
      {/* Desktop: 3 columnas | Mobile: stack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {/* SISTEMA RESPIRATORIO */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Respiratorio
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* SpO₂ - Prioridad 1 */}
            <div>
              <div className="text-xs text-gray-600 mb-1">SpO₂</div>
              <div className="flex items-baseline">
                <span className={`text-3xl font-bold ${spo2Status !== 'normal' ? '' : 'text-gray-900'}`} style={spo2Status !== 'normal' ? {
                color: spo2Color
              } : undefined}>
                  {patient.vitals.spo2}
                </span>
                <span className="text-sm text-gray-500 ml-1">%</span>
                <span className="text-lg ml-2">
                  {getTrendDirection(patient.vitals.spo2Trend)}
                </span>
              </div>
              {renderMiniSparkline(patient.vitals.spo2Trend, spo2Color)}
            </div>

            {/* RR - Prioridad 2 */}
            <div>
              <div className="text-xs text-gray-600 mb-1">RR</div>
              <div className="flex items-baseline">
                <span className={`text-3xl font-bold ${rrStatus !== 'normal' ? '' : 'text-gray-900'}`} style={rrStatus !== 'normal' ? {
                color: rrColor
              } : undefined}>
                  {patient.vitals.rr}
                </span>
                <span className="text-sm text-gray-500 ml-1">rpm</span>
                <span className="text-lg ml-2">
                  {getTrendDirection(patient.vitals.rrTrend)}
                </span>
              </div>
              {renderMiniSparkline(patient.vitals.rrTrend, rrColor)}
            </div>

            {/* EtCO₂ - Condicional */}
            {patient.vitals.etco2 && patient.vitals.etco2Trend && <div className="col-span-2">
                <div className="text-xs text-gray-600 mb-1">EtCO₂</div>
                <div className="flex items-baseline">
                  <span className={`text-2xl font-bold ${etco2Status !== 'normal' ? '' : 'text-gray-900'}`} style={etco2Status !== 'normal' ? {
                color: etco2Color
              } : undefined}>
                    {patient.vitals.etco2}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">mmHg</span>
                  <span className="text-lg ml-2">
                    {getTrendDirection(patient.vitals.etco2Trend)}
                  </span>
                  {renderMiniSparkline(patient.vitals.etco2Trend, etco2Color)}
                </div>
              </div>}
          </div>
        </div>

        {/* SISTEMA HEMODINÁMICO */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-red-50 to-white">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Hemodinámico
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* HR - Prioridad 1 */}
            <div>
              <div className="text-xs text-gray-600 mb-1">HR</div>
              <div className="flex items-baseline">
                <span className={`text-3xl font-bold ${hrStatus !== 'normal' ? '' : 'text-gray-900'}`} style={hrStatus !== 'normal' ? {
                color: hrColor
              } : undefined}>
                  {patient.vitals.hr}
                </span>
                <span className="text-sm text-gray-500 ml-1">bpm</span>
                <span className="text-lg ml-2">
                  {getTrendDirection(patient.vitals.hrTrend)}
                </span>
              </div>
              {renderMiniSparkline(patient.vitals.hrTrend, hrColor)}
            </div>

            {/* MAP - Prioridad 2 */}
            <div>
              <div className="text-xs text-gray-600 mb-1">MAP</div>
              <div className="flex items-baseline">
                <span className={`text-3xl font-bold ${mapStatus !== 'normal' ? '' : 'text-gray-900'}`} style={mapStatus !== 'normal' ? {
                color: mapColor
              } : undefined}>
                  {patient.vitals.map}
                </span>
                <span className="text-sm text-gray-500 ml-1">mmHg</span>
                <span className="text-lg ml-2">
                  {getTrendDirection(patient.vitals.mapTrend)}
                </span>
              </div>
              {renderMiniSparkline(patient.vitals.mapTrend, mapColor)}
            </div>

            {/* BP - Información complementaria */}
            <div className="col-span-2">
              <div className="text-xs text-gray-600 mb-1">BP</div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">
                  {patient.vitals.sbp}
                </span>
                <span className="text-xl font-bold text-gray-400 mx-1">/</span>
                <span className="text-2xl font-bold text-gray-900">
                  {patient.vitals.dbp}
                </span>
                <span className="text-sm text-gray-500 ml-1">mmHg</span>
              </div>
            </div>
          </div>
        </div>

        {/* SISTEMA METABÓLICO / TEMPERATURA */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-amber-50 to-white">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Metabólico
          </h3>
          <div>
            {/* Temperatura */}
            <div>
              <div className="text-xs text-gray-600 mb-1">Temperatura</div>
              <div className="flex items-baseline">
                <span className={`text-4xl font-bold ${tempStatus !== 'normal' ? '' : 'text-gray-900'}`} style={tempStatus !== 'normal' ? {
                color: tempColor
              } : undefined}>
                  {patient.vitals.temp}
                </span>
                <span className="text-lg text-gray-500 ml-1">°C</span>
                <span className="text-xl ml-2">
                  {getTrendDirection(patient.vitals.tempTrend)}
                </span>
              </div>
              {renderMiniSparkline(patient.vitals.tempTrend, tempColor)}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default PatientVitalsSummary;