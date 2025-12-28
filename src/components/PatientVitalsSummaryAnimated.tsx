import React, { Children } from 'react';
import { motion } from 'framer-motion';
import { Patient } from '../utils/mockData';
import { getVitalColor, getVitalStatus } from '../utils/vitalSignsConfig';
interface PatientVitalsSummaryAnimatedProps {
  patient: Patient;
}
/**
 * PatientVitalsSummaryAnimated
 *
 * Versión mejorada con:
 * - Animaciones de entrada staggered (profesional, no decorativo)
 * - Pulso sutil en valores críticos (red alert)
 * - Transiciones suaves en cambios de valor
 * - Accesibilidad completa (ARIA, keyboard nav)
 */
const PatientVitalsSummaryAnimated: React.FC<PatientVitalsSummaryAnimatedProps> = ({
  patient
}) => {
  // Helper para calcular tendencia
  const getTrendDirection = (trendArray: number[]): '↑' | '→' | '↓' => {
    if (trendArray.length < 2) return '→';
    const recent = trendArray.slice(-3);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const first = recent[0];
    const last = recent[recent.length - 1];
    if (last > first + avg * 0.05) return '↑';
    if (last < first - avg * 0.05) return '↓';
    return '→';
  };
  // Helper para renderizar mini-sparkline SVG con accesibilidad
  const renderMiniSparkline = (data: number[], color: string, label: string) => {
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
    return <svg width={width} height={height} className="inline-block ml-2" role="img" aria-label={`${label} trend: ${getTrendDirection(data) === '↑' ? 'increasing' : getTrendDirection(data) === '↓' ? 'decreasing' : 'stable'}`}>
        <title>{`${label} trend over last 10 readings`}</title>
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
  // Variantes de animación para staggered entrance
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };
  // Variante de pulso para valores críticos (red)
  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };
  return <div className="bg-white border-b border-gray-200">
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4" variants={containerVariants} initial="hidden" animate="visible">
        {/* SISTEMA RESPIRATORIO */}
        <motion.div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white" variants={cardVariants} role="region" aria-label="Respiratory system vitals">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Respiratorio
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* SpO₂ - Prioridad 1 */}
            <div>
              <div className="text-xs text-gray-600 mb-1" id="spo2-label">
                SpO₂
              </div>
              <div className="flex items-baseline">
                <motion.span className={`text-3xl font-bold ${spo2Status !== 'normal' ? '' : 'text-gray-900'}`} style={spo2Status !== 'normal' ? {
                color: spo2Color
              } : undefined} animate={spo2Status === 'red' ? 'pulse' : undefined} variants={pulseVariants} aria-labelledby="spo2-label" aria-live="polite" aria-atomic="true">
                  {patient.vitals.spo2}
                </motion.span>
                <span className="text-sm text-gray-500 ml-1" aria-hidden="true">
                  %
                </span>
                <span className="text-lg ml-2" role="img" aria-label={`Trend: ${getTrendDirection(patient.vitals.spo2Trend) === '↑' ? 'increasing' : getTrendDirection(patient.vitals.spo2Trend) === '↓' ? 'decreasing' : 'stable'}`}>
                  {getTrendDirection(patient.vitals.spo2Trend)}
                </span>
              </div>
              {renderMiniSparkline(patient.vitals.spo2Trend, spo2Color, 'SpO₂')}
              {spo2Status === 'red' && <div className="mt-1 text-xs text-red-600 font-medium" role="alert">
                  Critical
                </div>}
            </div>

            {/* RR - Prioridad 2 */}
            <div>
              <div className="text-xs text-gray-600 mb-1" id="rr-label">
                RR
              </div>
              <div className="flex items-baseline">
                <motion.span className={`text-3xl font-bold ${rrStatus !== 'normal' ? '' : 'text-gray-900'}`} style={rrStatus !== 'normal' ? {
                color: rrColor
              } : undefined} animate={rrStatus === 'red' ? 'pulse' : undefined} variants={pulseVariants} aria-labelledby="rr-label" aria-live="polite" aria-atomic="true">
                  {patient.vitals.rr}
                </motion.span>
                <span className="text-sm text-gray-500 ml-1" aria-hidden="true">
                  rpm
                </span>
                <span className="text-lg ml-2" role="img" aria-label={`Trend: ${getTrendDirection(patient.vitals.rrTrend) === '↑' ? 'increasing' : getTrendDirection(patient.vitals.rrTrend) === '↓' ? 'decreasing' : 'stable'}`}>
                  {getTrendDirection(patient.vitals.rrTrend)}
                </span>
              </div>
              {renderMiniSparkline(patient.vitals.rrTrend, rrColor, 'RR')}
              {rrStatus === 'red' && <div className="mt-1 text-xs text-red-600 font-medium" role="alert">
                  Critical
                </div>}
            </div>

            {/* EtCO₂ - Condicional */}
            {patient.vitals.etco2 && patient.vitals.etco2Trend && <div className="col-span-2">
                <div className="text-xs text-gray-600 mb-1" id="etco2-label">
                  EtCO₂
                </div>
                <div className="flex items-baseline">
                  <motion.span className={`text-2xl font-bold ${etco2Status !== 'normal' ? '' : 'text-gray-900'}`} style={etco2Status !== 'normal' ? {
                color: etco2Color
              } : undefined} animate={etco2Status === 'red' ? 'pulse' : undefined} variants={pulseVariants} aria-labelledby="etco2-label" aria-live="polite" aria-atomic="true">
                    {patient.vitals.etco2}
                  </motion.span>
                  <span className="text-sm text-gray-500 ml-1" aria-hidden="true">
                    mmHg
                  </span>
                  <span className="text-lg ml-2" role="img" aria-label={`Trend: ${getTrendDirection(patient.vitals.etco2Trend) === '↑' ? 'increasing' : getTrendDirection(patient.vitals.etco2Trend) === '↓' ? 'decreasing' : 'stable'}`}>
                    {getTrendDirection(patient.vitals.etco2Trend)}
                  </span>
                  {renderMiniSparkline(patient.vitals.etco2Trend, etco2Color, 'EtCO₂')}
                </div>
                {etco2Status === 'red' && <div className="mt-1 text-xs text-red-600 font-medium" role="alert">
                    Critical
                  </div>}
              </div>}
          </div>
        </motion.div>

        {/* SISTEMA HEMODINÁMICO */}
        <motion.div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-red-50 to-white" variants={cardVariants} role="region" aria-label="Hemodynamic system vitals">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Hemodinámico
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* HR - Prioridad 1 */}
            <div>
              <div className="text-xs text-gray-600 mb-1" id="hr-label">
                HR
              </div>
              <div className="flex items-baseline">
                <motion.span className={`text-3xl font-bold ${hrStatus !== 'normal' ? '' : 'text-gray-900'}`} style={hrStatus !== 'normal' ? {
                color: hrColor
              } : undefined} animate={hrStatus === 'red' ? 'pulse' : undefined} variants={pulseVariants} aria-labelledby="hr-label" aria-live="polite" aria-atomic="true">
                  {patient.vitals.hr}
                </motion.span>
                <span className="text-sm text-gray-500 ml-1" aria-hidden="true">
                  bpm
                </span>
                <span className="text-lg ml-2" role="img" aria-label={`Trend: ${getTrendDirection(patient.vitals.hrTrend) === '↑' ? 'increasing' : getTrendDirection(patient.vitals.hrTrend) === '↓' ? 'decreasing' : 'stable'}`}>
                  {getTrendDirection(patient.vitals.hrTrend)}
                </span>
              </div>
              {renderMiniSparkline(patient.vitals.hrTrend, hrColor, 'HR')}
              {hrStatus === 'red' && <div className="mt-1 text-xs text-red-600 font-medium" role="alert">
                  Critical
                </div>}
            </div>

            {/* MAP - Prioridad 2 */}
            <div>
              <div className="text-xs text-gray-600 mb-1" id="map-label">
                MAP
              </div>
              <div className="flex items-baseline">
                <motion.span className={`text-3xl font-bold ${mapStatus !== 'normal' ? '' : 'text-gray-900'}`} style={mapStatus !== 'normal' ? {
                color: mapColor
              } : undefined} animate={mapStatus === 'red' ? 'pulse' : undefined} variants={pulseVariants} aria-labelledby="map-label" aria-live="polite" aria-atomic="true">
                  {patient.vitals.map}
                </motion.span>
                <span className="text-sm text-gray-500 ml-1" aria-hidden="true">
                  mmHg
                </span>
                <span className="text-lg ml-2" role="img" aria-label={`Trend: ${getTrendDirection(patient.vitals.mapTrend) === '↑' ? 'increasing' : getTrendDirection(patient.vitals.mapTrend) === '↓' ? 'decreasing' : 'stable'}`}>
                  {getTrendDirection(patient.vitals.mapTrend)}
                </span>
              </div>
              {renderMiniSparkline(patient.vitals.mapTrend, mapColor, 'MAP')}
              {mapStatus === 'red' && <div className="mt-1 text-xs text-red-600 font-medium" role="alert">
                  Critical
                </div>}
            </div>

            {/* BP - Información complementaria */}
            <div className="col-span-2">
              <div className="text-xs text-gray-600 mb-1" id="bp-label">
                BP
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900" aria-labelledby="bp-label">
                  {patient.vitals.sbp}
                </span>
                <span className="text-xl font-bold text-gray-400 mx-1" aria-hidden="true">
                  /
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  {patient.vitals.dbp}
                </span>
                <span className="text-sm text-gray-500 ml-1" aria-hidden="true">
                  mmHg
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SISTEMA METABÓLICO / TEMPERATURA */}
        <motion.div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-amber-50 to-white" variants={cardVariants} role="region" aria-label="Metabolic system vitals">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Metabólico
          </h3>
          <div>
            {/* Temperatura */}
            <div>
              <div className="text-xs text-gray-600 mb-1" id="temp-label">
                Temperatura
              </div>
              <div className="flex items-baseline">
                <motion.span className={`text-4xl font-bold ${tempStatus !== 'normal' ? '' : 'text-gray-900'}`} style={tempStatus !== 'normal' ? {
                color: tempColor
              } : undefined} animate={tempStatus === 'red' ? 'pulse' : undefined} variants={pulseVariants} aria-labelledby="temp-label" aria-live="polite" aria-atomic="true">
                  {patient.vitals.temp}
                </motion.span>
                <span className="text-lg text-gray-500 ml-1" aria-hidden="true">
                  °C
                </span>
                <span className="text-xl ml-2" role="img" aria-label={`Trend: ${getTrendDirection(patient.vitals.tempTrend) === '↑' ? 'increasing' : getTrendDirection(patient.vitals.tempTrend) === '↓' ? 'decreasing' : 'stable'}`}>
                  {getTrendDirection(patient.vitals.tempTrend)}
                </span>
              </div>
              {renderMiniSparkline(patient.vitals.tempTrend, tempColor, 'Temperature')}
              {tempStatus === 'red' && <div className="mt-1 text-xs text-red-600 font-medium" role="alert">
                  Critical
                </div>}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>;
};
export default PatientVitalsSummaryAnimated;