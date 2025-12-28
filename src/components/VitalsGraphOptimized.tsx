import React, { useEffect, useState } from 'react';
import { Patient } from '../utils/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { vitalSignsConfig } from '../utils/vitalSignsConfig';
interface VitalsGraphOptimizedProps {
  patient: Patient;
  timeRange: string;
}
type SystemTab = 'respiratory' | 'hemodynamic' | 'global';
/**
 * VitalsGraphOptimized
 *
 * Gráfico multiparámetro optimizado con:
 * - Tabs por sistema fisiológico (reduce densidad visual)
 * - Generación de data desde arrays de trend
 * - Solución a superposición de labels en eje X
 * - Modo responsive (desktop vs mobile)
 *
 * Decisiones UX:
 * - En mobile: solo mostrar 1-2 curvas clave por tab
 * - minTickGap y interval="preserveStartEnd" para evitar overlap
 * - Tooltips ricos para compensar ejes ocultos en mobile
 */
const VitalsGraphOptimized: React.FC<VitalsGraphOptimizedProps> = ({
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
  // Generar data desde trends (10 puntos = últimos 60 min por defecto)
  const generateDataFromTrends = () => {
    const dataPoints = patient.vitals.hrTrend.length; // 10 puntos
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
  }[] = [{
    id: 'respiratory',
    label: 'Respiratorio',
    icon: '🫁'
  }, {
    id: 'hemodynamic',
    label: 'Hemodinámico',
    icon: '❤️'
  }, {
    id: 'global',
    label: 'Global',
    icon: '📊'
  }];
  // Formatter para eje X (evitar overlap)
  const formatXAxis = (value: string) => {
    if (isMobile && timeRange !== '1h') {
      // En mobile, mostrar solo hora en rangos largos
      return value.split(':')[0];
    }
    return value;
  };
  return <div className="w-full">
      {/* Tabs */}
      <div className="flex space-x-1 mb-4 border-b border-gray-200">
        {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
            <span className="mr-1">{tab.icon}</span>
            {!isMobile && tab.label}
          </button>)}
      </div>

      {/* Gráfico */}
      <div className="w-full h-80 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{
          top: 5,
          right: isMobile ? 10 : 30,
          left: isMobile ? 0 : 20,
          bottom: 5
        }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

            {/* Eje X optimizado */}
            <XAxis dataKey="time" tick={{
            fontSize: isMobile ? 10 : 12
          }} tickFormatter={formatXAxis} interval="preserveStartEnd" // Solo mostrar inicio y fin
          minTickGap={isMobile ? 30 : 50} // Espacio mínimo entre ticks
          />

            {/* TAB: RESPIRATORY */}
            {activeTab === 'respiratory' && <>
                {/* SpO₂ - Eje principal */}
                <YAxis yAxisId="spo2" domain={vitalSignsConfig.spo2.chartRange} orientation="left" stroke="#10b981" label={!isMobile ? {
              value: 'SpO₂ (%)',
              angle: -90,
              position: 'insideLeft'
            } : undefined} tick={{
              fontSize: isMobile ? 9 : 11
            }} width={isMobile ? 35 : 60} />
                <Line type="monotone" dataKey="spo2" stroke="#10b981" strokeWidth={2} dot={false} yAxisId="spo2" name="SpO₂" />
                <ReferenceLine yAxisId="spo2" y={vitalSignsConfig.spo2.yellowAlert[0]} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.6} />
                <ReferenceLine yAxisId="spo2" y={vitalSignsConfig.spo2.redAlert[0]} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.6} />

                {/* RR - Eje secundario (solo desktop) */}
                {!isMobile && <>
                    <YAxis yAxisId="rr" domain={vitalSignsConfig.rr.chartRange} orientation="right" stroke="#3b82f6" label={{
                value: 'RR (rpm)',
                angle: -90,
                position: 'insideRight'
              }} tick={{
                fontSize: 11
              }} />
                    <Line type="monotone" dataKey="rr" stroke="#3b82f6" strokeWidth={2} dot={false} yAxisId="rr" name="RR" />
                  </>}

                {/* EtCO₂ - Solo si existe y en desktop */}
                {!isMobile && patient.vitals.etco2 && <>
                    <YAxis yAxisId="etco2" domain={vitalSignsConfig.etco2.chartRange} orientation="right" stroke="#8b5cf6" tick={{
                fontSize: 11
              }} hide // Ocultar eje pero mantener escala
              />
                    <Line type="monotone" dataKey="etco2" stroke="#8b5cf6" strokeWidth={1.5} dot={false} yAxisId="etco2" name="EtCO₂" strokeDasharray="5 5" />
                  </>}
              </>}

            {/* TAB: HEMODYNAMIC */}
            {activeTab === 'hemodynamic' && <>
                {/* HR - Eje principal */}
                <YAxis yAxisId="hr" domain={vitalSignsConfig.hr.chartRange} orientation="left" stroke="#ef4444" label={!isMobile ? {
              value: 'HR (bpm)',
              angle: -90,
              position: 'insideLeft'
            } : undefined} tick={{
              fontSize: isMobile ? 9 : 11
            }} width={isMobile ? 35 : 60} />
                <Line type="monotone" dataKey="hr" stroke="#ef4444" strokeWidth={2} dot={false} yAxisId="hr" name="HR" />
                <ReferenceLine yAxisId="hr" y={vitalSignsConfig.hr.yellowAlert[0]} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.6} />
                <ReferenceLine yAxisId="hr" y={vitalSignsConfig.hr.yellowAlert[1]} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.6} />

                {/* MAP - Eje secundario */}
                {!isMobile && <>
                    <YAxis yAxisId="map" domain={vitalSignsConfig.map.chartRange} orientation="right" stroke="#f59e0b" label={{
                value: 'MAP (mmHg)',
                angle: -90,
                position: 'insideRight'
              }} tick={{
                fontSize: 11
              }} />
                    <Line type="monotone" dataKey="map" stroke="#f59e0b" strokeWidth={2} dot={false} yAxisId="map" name="MAP" />
                    <ReferenceLine yAxisId="map" y={vitalSignsConfig.map.yellowAlert[0]} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.4} />
                  </>}
              </>}

            {/* TAB: GLOBAL */}
            {activeTab === 'global' && <>
                {/* Vista compacta con las 4 curvas principales */}
                <YAxis yAxisId="normalized" domain={[0, 100]} orientation="left" label={!isMobile ? {
              value: 'Valores normalizados',
              angle: -90,
              position: 'insideLeft'
            } : undefined} tick={{
              fontSize: isMobile ? 9 : 11
            }} width={isMobile ? 35 : 60} />

                {/* Normalizar valores para mostrar en mismo eje */}
                <Line type="monotone" dataKey="spo2" stroke="#10b981" strokeWidth={1.5} dot={false} yAxisId="normalized" name="SpO₂" />
                <Line type="monotone" dataKey={d => d.hr / 160 * 100} // Normalizar HR
            stroke="#ef4444" strokeWidth={1.5} dot={false} yAxisId="normalized" name="HR (norm)" />
                {!isMobile && <>
                    <Line type="monotone" dataKey={d => d.rr / 40 * 100} // Normalizar RR
              stroke="#3b82f6" strokeWidth={1.5} dot={false} yAxisId="normalized" name="RR (norm)" />
                    <Line type="monotone" dataKey={d => d.map / 130 * 100} // Normalizar MAP
              stroke="#f59e0b" strokeWidth={1.5} dot={false} yAxisId="normalized" name="MAP (norm)" />
                  </>}
              </>}

            {/* Tooltip enriquecido */}
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
            // Mostrar valores reales en tooltip
            if (name === 'SpO₂') return [`${value}%`, name];
            if (name === 'HR') return [`${value} bpm`, name];
            if (name === 'RR') return [`${value} rpm`, name];
            if (name === 'MAP') return [`${value} mmHg`, name];
            if (name === 'EtCO₂') return [`${value} mmHg`, name];
            return [value, name];
          }} />

            {/* Legend */}
            <Legend verticalAlign="top" height={36} iconSize={isMobile ? 8 : 10} wrapperStyle={{
            fontSize: isMobile ? 10 : 12,
            paddingBottom: 8
          }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Nota informativa en mobile */}
      {isMobile && <div className="mt-2 text-xs text-gray-500 text-center">
          Toca el gráfico para ver valores detallados
        </div>}
    </div>;
};
export default VitalsGraphOptimized;