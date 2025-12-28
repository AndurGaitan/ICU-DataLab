import React from 'react';
import { motion } from 'framer-motion';
import { Patient } from '../utils/mockData';
import AlertBadge from './AlertBadge';
import VitalSparkline from './VitalSparkline';
import { getVitalColor } from '../utils/vitalSignsConfig';
interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
}
/**
 * PatientCard - Optimizado para mobile y desktop
 *
 * Decisiones de diseño mobile-first:
 * - Stack vertical en mobile para evitar superposiciones
 * - Ubicación (Sector + Cama) como elemento visual dominante
 * - Jerarquía clara: Ubicación > Nombre > Vitals > Insights
 * - Responsive: 1 col mobile, 2+ cols desktop
 */
const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onClick
}) => {
  // Extraer sector (letra) y número de cama
  const sector = patient.bedNumber.split('-')[0]; // "A", "B", "C"
  const bedNum = patient.bedNumber.split('-')[1]; // "1", "2", "3"
  // Color del sector basado en la letra (consistente, no aleatorio)
  const getSectorColor = (sector: string) => {
    const colors: Record<string, {
      bg: string;
      text: string;
      border: string;
    }> = {
      A: {
        bg: 'bg-blue-500',
        text: 'text-white',
        border: 'border-blue-600'
      },
      B: {
        bg: 'bg-purple-500',
        text: 'text-white',
        border: 'border-purple-600'
      },
      C: {
        bg: 'bg-emerald-500',
        text: 'text-white',
        border: 'border-emerald-600'
      },
      D: {
        bg: 'bg-amber-500',
        text: 'text-white',
        border: 'border-amber-600'
      },
      E: {
        bg: 'bg-rose-500',
        text: 'text-white',
        border: 'border-rose-600'
      }
    };
    return colors[sector] || {
      bg: 'bg-gray-500',
      text: 'text-white',
      border: 'border-gray-600'
    };
  };
  const sectorColor = getSectorColor(sector);
  return <motion.div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer" onClick={onClick} whileHover={{
    scale: 1.02,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  }} transition={{
    type: 'spring',
    stiffness: 300,
    damping: 20
  }}>
      {/* Header - Optimizado para mobile */}
      <div className="relative bg-gradient-to-r from-gray-50 to-white p-3 sm:p-4">
        {/* Row 1: Ubicación + Alert Badge */}
        <div className="flex items-start justify-between mb-3 gap-2">
          {/* Ubicación - Elemento visual dominante */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Sector Badge - Compacto en mobile */}
            <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${sectorColor.bg} ${sectorColor.text} border-2 ${sectorColor.border} shadow-md flex-shrink-0`}>
              <div className="text-center leading-none">
                <div className="text-[9px] sm:text-xs font-semibold opacity-90">
                  Sector
                </div>
                <div className="text-lg sm:text-xl font-bold">{sector}</div>
              </div>
            </div>

            {/* Bed Number - Responsive */}
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide">
                Cama
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none">
                {bedNum}
              </div>
            </div>
          </div>

          {/* Alert Badge - Posición secundaria, flex-shrink-0 */}
          <div className="flex-shrink-0">
            <AlertBadge riskLevel={patient.riskLevel} />
          </div>
        </div>

        {/* Row 2: Nombre del paciente */}
        <div className="mb-2">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight truncate">
            {patient.name}
          </h3>
        </div>

        {/* Row 3: Edad, Género, Diagnosis - Stack en mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          {/* Edad + Género */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <span className="font-medium">{patient.age} años</span>
            <span className="text-gray-400">•</span>
            <span>{patient.gender === 'Male' ? 'M' : 'F'}</span>
          </div>

          {/* Ventilation Badge - Inline en mobile */}
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${patient.ventilationSupport === 'MV' ? 'bg-red-100 text-red-800 border border-red-200' : patient.ventilationSupport === 'NIV' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-green-100 text-green-800 border border-green-200'}`}>
            {patient.ventilationSupport}
          </span>
        </div>
      </div>

      {/* Diagnosis - Separado para mejor legibilidad en mobile */}
      <div className="px-3 sm:px-4 py-2 bg-white border-t border-gray-100">
        <p className="text-xs sm:text-sm text-gray-700 font-medium truncate">
          {patient.diagnosis}
        </p>
      </div>

      {/* Vitals Grid - Compacto y escaneable */}
      <div className="px-3 sm:px-4 py-3 bg-gray-50">
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:gap-x-4">
          {/* HR */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">HR</span>
            <div className="flex items-center gap-1">
              <VitalSparkline data={patient.vitals.hrTrend} color={getVitalColor('hr', patient.vitals.hr)} />
              <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                {patient.vitals.hr}
              </span>
            </div>
          </div>

          {/* RR */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">RR</span>
            <div className="flex items-center gap-1">
              <VitalSparkline data={patient.vitals.rrTrend} color={getVitalColor('rr', patient.vitals.rr)} />
              <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                {patient.vitals.rr}
              </span>
            </div>
          </div>

          {/* SpO₂ */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">SpO₂</span>
            <div className="flex items-center gap-1">
              <VitalSparkline data={patient.vitals.spo2Trend} color={getVitalColor('spo2', patient.vitals.spo2)} />
              <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                {patient.vitals.spo2}%
              </span>
            </div>
          </div>

          {/* MAP */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">MAP</span>
            <div className="flex items-center gap-1">
              <VitalSparkline data={patient.vitals.mapTrend} color={getVitalColor('map', patient.vitals.map)} />
              <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                {patient.vitals.map}
              </span>
            </div>
          </div>

          {/* Temp - Full width en mobile para mejor legibilidad */}
          <div className="flex items-center justify-between col-span-2">
            <span className="text-xs font-medium text-gray-600">Temp</span>
            <div className="flex items-center gap-1">
              <VitalSparkline data={patient.vitals.tempTrend} color={getVitalColor('temp', patient.vitals.temp)} />
              <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                {patient.vitals.temp}°C
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights - Footer */}
      {patient.aiInsights && <div className="px-3 sm:px-4 py-2 sm:py-3 bg-blue-50 border-t border-blue-100">
          <div className="flex items-start gap-2">
            <svg className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-blue-800 leading-relaxed flex-1 min-w-0">
              {patient.aiInsights}
            </p>
          </div>
        </div>}
    </motion.div>;
};
export default PatientCard;