import React, { useState, createElement } from 'react';
import { Patient } from '../utils/mockData';
import VitalsGraphOptimizedAccessible from './VitalsGraphOptimizedAccessible';
import TrendSummary from './TrendSummary';
import AlertBadgeAnimated from './AlertBadgeAnimated';
import PatientVitalsSummaryAnimated from './PatientVitalsSummaryAnimated';
import { exportVitalsToCSV } from './VitalsGraph';
interface PatientDetailViewProps {
  patient: Patient;
}
const PatientDetailView: React.FC<PatientDetailViewProps> = ({
  patient
}) => {
  const [timeRange, setTimeRange] = useState('1h');
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [annotationText, setAnnotationText] = useState('');
  const [annotations, setAnnotations] = useState<{
    text: string;
    timestamp: string;
  }[]>([]);
  // Function to handle exporting vitals data
  const handleExportVitals = () => {
    const csvContent = exportVitalsToCSV(patient, timeRange);
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${patient.name.replace(/\s+/g, '_')}_vitals_${timeRange}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // Function to handle adding annotations
  const handleAddAnnotation = () => {
    if (annotationText.trim()) {
      const now = new Date();
      const timestamp = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setAnnotations([...annotations, {
        text: annotationText,
        timestamp: timestamp
      }]);
      setAnnotationText('');
      setShowAnnotationModal(false);
    }
  };
  // Extraer sector y número de cama
  const sector = patient.bedNumber.split('-')[0];
  const bedNum = patient.bedNumber.split('-')[1];
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header - Optimizado para mobile */}
      <div className="p-3 sm:p-4 border-b border-gray-200">
        {/* Row 1: Ubicación + Risk Badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          {/* Ubicación (Bed Number) */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg border border-blue-200">
              <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                Bed {patient.bedNumber}
              </span>
            </div>
          </div>

          {/* Risk Badge */}
          <div className="flex-shrink-0">
            <AlertBadgeAnimated riskLevel={patient.riskLevel} />
          </div>
        </div>

        {/* Row 2: Nombre del paciente */}
        <div className="mb-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
            {patient.name}
          </h2>
        </div>

        {/* Row 3: Edad, Género, Diagnosis - Stack en mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
          {/* Edad + Género */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">{patient.age} yrs</span>
            <span className="text-gray-400">•</span>
            <span>{patient.gender}</span>
          </div>

          {/* Diagnosis */}
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden sm:inline text-gray-400">•</span>
            <span className="text-gray-700 font-medium">
              {patient.diagnosis}
            </span>
          </div>
        </div>

        {/* Row 4: Action Button - Full width en mobile */}
        <div className="flex justify-end">
          <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors" onClick={() => setShowAnnotationModal(true)}>
            Add Note
          </button>
        </div>
      </div>

      {/* Vitals Summary con animaciones */}
      <PatientVitalsSummaryAnimated patient={patient} />

      {/* Graph Section */}
      <div className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">
          {/* Time Range Buttons */}
          <div className="flex gap-2 overflow-x-auto">
            <button className={`px-3 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap ${timeRange === '1h' ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => setTimeRange('1h')}>
              1h
            </button>
            <button className={`px-3 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap ${timeRange === '4h' ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => setTimeRange('4h')}>
              4h
            </button>
            <button className={`px-3 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap ${timeRange === '12h' ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => setTimeRange('12h')}>
              12h
            </button>
            <button className={`px-3 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap ${timeRange === '24h' ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => setTimeRange('24h')}>
              24h
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex-1 sm:flex-none px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm flex items-center justify-center hover:bg-gray-200 transition-colors" onClick={handleExportVitals}>
              <svg className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export</span>
            </button>
            <button className="flex-1 sm:flex-none px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm flex items-center justify-center hover:bg-gray-200 transition-colors" onClick={() => setShowAnnotationModal(true)}>
              <svg className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <span className="hidden sm:inline">Annotate</span>
              <span className="sm:hidden">Note</span>
            </button>
          </div>
        </div>

        {/* Gráfico optimizado con accesibilidad */}
        <div className="mb-6">
          <VitalsGraphOptimizedAccessible patient={patient} timeRange={timeRange} />

          {/* Display annotations if any */}
          {annotations.length > 0 && <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Annotations
              </h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {annotations.map((annotation, index) => <div key={index} className="text-xs text-gray-600 flex">
                    <span className="font-medium text-gray-700 mr-2">
                      [{annotation.timestamp}]
                    </span>
                    <span>{annotation.text}</span>
                  </div>)}
              </div>
            </div>}
        </div>

        {/* AI Insights and Treatment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              AI Clinical Insights
            </h3>
            <TrendSummary patient={patient} />
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Current Treatment
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  Medication
                </h4>
                <ul className="mt-1 text-sm text-gray-600">
                  {patient.medication.map((med, index) => <li key={index} className="flex justify-between">
                      <span>{med.name}</span>
                      <span className="text-gray-500">{med.dosage}</span>
                    </li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  Sedation Level
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  {patient.sedationLevel}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  Latest Labs
                </h4>
                <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                  {patient.labs.map((lab, index) => <div key={index} className="flex justify-between">
                      <span className="text-gray-600">{lab.name}:</span>
                      <span className={`font-medium ${lab.isAbnormal ? 'text-red-600' : 'text-gray-900'}`}>
                        {lab.value} {lab.unit}
                      </span>
                    </div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Annotation Modal */}
      {showAnnotationModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Add Annotation
            </h3>
            <textarea className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" rows={4} placeholder="Enter your observation or note here..." value={annotationText} onChange={e => setAnnotationText(e.target.value)} />
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium" onClick={() => setShowAnnotationModal(false)}>
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium" onClick={handleAddAnnotation}>
                Save
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
export default PatientDetailView;