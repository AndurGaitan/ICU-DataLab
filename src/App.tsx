import React, { useEffect, useState } from 'react';
import DashboardOverview from './components/DashboardOverview';
import PatientDetailView from './components/PatientDetailView';
import Header from './components/Header';
import { usePatients } from './hooks/usePatients';
import { useDataSource } from './hooks/useDataSource';
export function App() {
  // Configurar data source (mock por defecto)
  const {
    sourceType,
    useMockData
  } = useDataSource();
  // Cargar pacientes usando el hook
  const {
    patients,
    isLoading,
    error
  } = usePatients();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  // Inicializar con mock data
  useEffect(() => {
    useMockData();
  }, []);
  const selectedPatient = selectedPatientId ? patients.find(p => p.id === selectedPatientId) : null;
  return <div className="min-h-screen bg-gray-50">
      {/* Header optimizado para mobile */}
      <Header sourceType={sourceType} showBackButton={!!selectedPatient} onBack={() => setSelectedPatientId(null)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        {/* Loading State */}
        {isLoading && <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading patients...</p>
            </div>
          </div>}

        {/* Error State */}
        {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800 font-medium text-sm">
                {error.message}
              </p>
            </div>
          </div>}

        {/* Content */}
        {!isLoading && !error && <>
            {selectedPatient ? <div>
                {/* Back button - Solo desktop (mobile usa header) */}
                <button onClick={() => setSelectedPatientId(null)} className="hidden md:flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors">
                  <svg className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Dashboard
                </button>
                <PatientDetailView patient={selectedPatient} />
              </div> : <DashboardOverview patients={patients} onSelectPatient={setSelectedPatientId} />}
          </>}
      </main>
    </div>;
}