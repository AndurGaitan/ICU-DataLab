import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Patient } from '../utils/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { vitalSignsConfig } from '../utils/vitalSignsConfig';
interface VitalsGraphOptimizedAccessibleProps {
  patient: Patient;
  timeRange: string;
}
type SystemTab = 'respiratory' | 'hemodynamic' | 'global';
/**
 * VitalsGraphOptimizedAccessible
 *
 * Versión mejorada con:
 * - Tab transitions con smooth indicator animado
 * - Keyboard navigation completa (Arrow keys, Tab, Enter)
 * - ARIA labels y live regions
 * - Focus management profesional
 */
const VitalsGraphOptimizedAccessible: React.FC<VitalsGraphOptimizedAccessibleProps> = ({
  patient,
  timeRange
}) => {
  const [activeTab, setActiveTab] = useState<SystemTab>('respiratory');
  const [isMobile, setIsMobile] = useState(false);
  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  // Generar data desde trends
  const generateDataFromTrends = () => {
    const dataPoints = patient.vitals.hrTrend.length;
    const now = new Date();
    const intervalMinutes = timeRange === '1h' ? 6 : timeRange === '4h' ? 24 : timeRange === '12h' ? 72 : 144;
    return patient.vitals.hrTrend.map((_, index) => {
      const minutesAgo = (dataPoints - 1 - index) * intervalMinutes;
      const timestamp = new Date(now.getTime() - minutesAgo * 60000);
      return {
        time: timestamp.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        hr: patient.vitals.hrTrend[index],
        rr: patient.vitals.rrTrend[index],
        spo2: patient.vitals.spo2Trend[index],
        map: patient.vitals.mapTrend[index],
        temp: patient.vitals.tempTrend[index],
        etco2: patient.vitals.etco2Trend?.[index]
      };
    });
  };
  const data = generateDataFromTrends();
  // Configuración de tabs
  const tabs: {
    id: SystemTab;
    label: string;
    icon: string;
    description: string;
  }[] = [{
    id: 'respiratory',
    label: 'Respiratorio',
    icon: '🫁',
    description: 'Respiratory system: SpO₂, RR, EtCO₂'
  }, {
    id: 'hemodynamic',
    label: 'Hemodinámico',
    icon: '❤️',
    description: 'Hemodynamic system: HR, MAP'
  }, {
    id: 'global',
    label: 'Global',
    icon: '📊',
    description: 'All vitals normalized view'
  }];
  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, tabId: SystemTab) => {
    const currentIndex = tabs.findIndex(t => t.id === tabId);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % tabs.length;
      setActiveTab(tabs[nextIndex].id);
      // Focus next tab
      setTimeout(() => {
        const nextButton = document.querySelector(`[data-tab="${tabs[nextIndex].id}"]`) as HTMLButtonElement;
        nextButton?.focus();
      }, 0);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      setActiveTab(tabs[prevIndex].id);
      // Focus previous tab
      setTimeout(() => {
        const prevButton = document.querySelector(`[data-tab="${tabs[prevIndex].id}"]`) as HTMLButtonElement;
        prevButton?.focus();
      }, 0);
    }
  };
  // Formatter para eje X
  const formatXAxis = (value: string) => {
    if (isMobile && timeRange !== '1h') {
      return value.split(':')[0];
    }
    return value;
  };
  // Obtener índice del tab activo para animación
  const activeTabIndex = tabs.findIndex(t => t.id === activeTab);
  return <div className="w-full">
      {/* Tabs con keyboard navigation y smooth indicator */}
      <div className="relative flex space-x-1 mb-4 border-b border-gray-200" role="tablist" aria-label="Vital signs system tabs">
        {tabs.map((tab, index) => <button key={tab.id} data-tab={tab.id} onClick={() => setActiveTab(tab.id)} onKeyDown={e => handleKeyDown(e, tab.id)} role="tab" aria-selected={activeTab === tab.id} aria-controls={`${tab.id}-panel`} id={`${tab.id}-tab`} tabIndex={activeTab === tab.id ? 0 : -1} className={`relative px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`} aria-label={tab.description}>
            <span className="mr-1" aria-hidden="true">
              {tab.icon}
            </span>
            {!isMobile && tab.label}
          </button>)}

        {/* Animated indicator */}
        <motion.div className="absolute bottom-0 h-0.5 bg-blue-600" initial={false} animate={{
        left: `${activeTabIndex * (100 / tabs.length)}%`,
        width: `${100 / tabs.length}%`
      }} transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }} />
      </div>

      {/* Graph with AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -10
      }} transition={{
        duration: 0.2
      }} role="tabpanel" id={`${activeTab}-panel`} aria-labelledby={`${activeTab}-tab`} className="w-full h-80 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{
            top: 5,
            right: isMobile ? 10 : 30,
            left: isMobile ? 0 : 20,
            bottom: 5
          }} aria-label={`${tabs.find(t => t.id === activeTab)?.label} vital signs chart`}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

              {/* Eje X optimizado */}
              <XAxis dataKey="time" tick={{
              fontSize: isMobile ? 10 : 12
            }} tickFormatter={formatXAxis} interval="preserveStartEnd" minTickGap={isMobile ? 30 : 50} aria-label="Time axis" />

              {/* TAB: RESPIRATORY */}
              {activeTab === 'respiratory' && <>
                  <YAxis yAxisId="spo2" domain={vitalSignsConfig.spo2.chartRange} orientation="left" stroke="#10b981" label={!isMobile ? {
                value: 'SpO₂ (%)',
                angle: -90,
                position: 'insideLeft'
              } : undefined} tick={{
                fontSize: isMobile ? 9 : 11
              }} width={isMobile ? 35 : 60} aria-label="SpO₂ percentage axis" />
                  <Line type="monotone" dataKey="spo2" stroke="#10b981" strokeWidth={2} dot={false} yAxisId="spo2" name="SpO₂" aria-label="SpO₂ trend line" />
                  <ReferenceLine yAxisId="spo2" y={vitalSignsConfig.spo2.yellowAlert[0]} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.6} label={{
                value: 'Warning',
                position: 'insideTopRight',
                fontSize: 10
              }} />
                  <ReferenceLine yAxisId="spo2" y={vitalSignsConfig.spo2.redAlert[0]} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.6} label={{
                value: 'Critical',
                position: 'insideTopRight',
                fontSize: 10
              }} />

                  {!isMobile && <>
                      <YAxis yAxisId="rr" domain={vitalSignsConfig.rr.chartRange} orientation="right" stroke="#3b82f6" label={{
                  value: 'RR (rpm)',
                  angle: -90,
                  position: 'insideRight'
                }} tick={{
                  fontSize: 11
                }} aria-label="Respiratory rate axis" />
                      <Line type="monotone" dataKey="rr" stroke="#3b82f6" strokeWidth={2} dot={false} yAxisId="rr" name="RR" aria-label="Respiratory rate trend line" />
                    </>}

                  {!isMobile && patient.vitals.etco2 && <>
                      <YAxis yAxisId="etco2" domain={vitalSignsConfig.etco2.chartRange} orientation="right" stroke="#8b5cf6" tick={{
                  fontSize: 11
                }} hide />
                      <Line type="monotone" dataKey="etco2" stroke="#8b5cf6" strokeWidth={1.5} dot={false} yAxisId="etco2" name="EtCO₂" strokeDasharray="5 5" aria-label="EtCO₂ trend line" />
                    </>}
                </>}

              {/* TAB: HEMODYNAMIC */}
              {activeTab === 'hemodynamic' && <>
                  <YAxis yAxisId="hr" domain={vitalSignsConfig.hr.chartRange} orientation="left" stroke="#ef4444" label={!isMobile ? {
                value: 'HR (bpm)',
                angle: -90,
                position: 'insideLeft'
              } : undefined} tick={{
                fontSize: isMobile ? 9 : 11
              }} width={isMobile ? 35 : 60} aria-label="Heart rate axis" />
                  <Line type="monotone" dataKey="hr" stroke="#ef4444" strokeWidth={2} dot={false} yAxisId="hr" name="HR" aria-label="Heart rate trend line" />
                  <ReferenceLine yAxisId="hr" y={vitalSignsConfig.hr.yellowAlert[0]} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.6} />
                  <ReferenceLine yAxisId="hr" y={vitalSignsConfig.hr.yellowAlert[1]} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.6} />

                  {!isMobile && <>
                      <YAxis yAxisId="map" domain={vitalSignsConfig.map.chartRange} orientation="right" stroke="#f59e0b" label={{
                  value: 'MAP (mmHg)',
                  angle: -90,
                  position: 'insideRight'
                }} tick={{
                  fontSize: 11
                }} aria-label="Mean arterial pressure axis" />
                      <Line type="monotone" dataKey="map" stroke="#f59e0b" strokeWidth={2} dot={false} yAxisId="map" name="MAP" aria-label="MAP trend line" />
                      <ReferenceLine yAxisId="map" y={vitalSignsConfig.map.yellowAlert[0]} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.4} />
                    </>}
                </>}

              {/* TAB: GLOBAL */}
              {activeTab === 'global' && <>
                  <YAxis yAxisId="normalized" domain={[0, 100]} orientation="left" label={!isMobile ? {
                value: 'Normalized values',
                angle: -90,
                position: 'insideLeft'
              } : undefined} tick={{
                fontSize: isMobile ? 9 : 11
              }} width={isMobile ? 35 : 60} aria-label="Normalized values axis" />

                  <Line type="monotone" dataKey="spo2" stroke="#10b981" strokeWidth={1.5} dot={false} yAxisId="normalized" name="SpO₂" />
                  <Line type="monotone" dataKey={d => d.hr / 160 * 100} stroke="#ef4444" strokeWidth={1.5} dot={false} yAxisId="normalized" name="HR (norm)" />
                  {!isMobile && <>
                      <Line type="monotone" dataKey={d => d.rr / 40 * 100} stroke="#3b82f6" strokeWidth={1.5} dot={false} yAxisId="normalized" name="RR (norm)" />
                      <Line type="monotone" dataKey={d => d.map / 130 * 100} stroke="#f59e0b" strokeWidth={1.5} dot={false} yAxisId="normalized" name="MAP (norm)" />
                    </>}
                </>}

              <Tooltip contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              fontSize: isMobile ? 11 : 13
            }} labelStyle={{
              fontWeight: 'bold',
              marginBottom: 4
            }} formatter={(value: any, name: string) => {
              if (name === 'SpO₂') return [`${value}%`, name];
              if (name === 'HR') return [`${value} bpm`, name];
              if (name === 'RR') return [`${value} rpm`, name];
              if (name === 'MAP') return [`${value} mmHg`, name];
              if (name === 'EtCO₂') return [`${value} mmHg`, name];
              return [value, name];
            }} />

              <Legend verticalAlign="top" height={36} iconSize={isMobile ? 8 : 10} wrapperStyle={{
              fontSize: isMobile ? 10 : 12,
              paddingBottom: 8
            }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>

      {/* Live region for screen readers */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Currently viewing {tabs.find(t => t.id === activeTab)?.label} vital
        signs
      </div>

      {isMobile && <div className="mt-2 text-xs text-gray-500 text-center">
          Toca el gráfico para ver valores detallados
        </div>}
    </div>;
};
export default VitalsGraphOptimizedAccessible;