import React, { useEffect, useState } from 'react';
import { Patient } from '../utils/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { vitalSignsConfig } from '../utils/vitalSignsConfig';
interface VitalsGraphProps {
  patient: Patient;
  timeRange: string;
  onAddAnnotation?: (annotation: string, timestamp: string) => void;
}
const VitalsGraph: React.FC<VitalsGraphProps> = ({
  patient,
  timeRange,
  onAddAnnotation
}) => {
  // Generate time-series data based on patient vitals
  const data = generateTimeSeriesData(patient, timeRange);
  // Show EtCO2 if available
  const showEtCO2 = patient.vitals.etco2 !== undefined;
  // State to track screen width for responsive behavior
  const [isMobile, setIsMobile] = useState(false);
  // Effect to check screen size and update state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    // Initial check
    checkScreenSize();
    // Add listener for window resize
    window.addEventListener('resize', checkScreenSize);
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  // Custom tick formatter for X-axis to ensure proper display
  const formatXAxisTick = (tickItem: string) => {
    // On mobile, use shorter format if needed
    if (isMobile) {
      // For 1h view show full time, for other views show hour only
      if (timeRange !== '1h') {
        const parts = tickItem.split(':');
        return parts[0] + (tickItem.includes('PM') ? 'p' : 'a');
      }
    }
    return tickItem;
  };
  return <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{
        top: 5,
        right: isMobile ? 15 : 30,
        left: isMobile ? 10 : 20,
        bottom: 5
      }} syncId="patientVitals">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="time" tick={{
          fontSize: isMobile ? 10 : 12
        }} padding={{
          left: 10,
          right: 10
        }}
        // Fix for time display
        tickFormatter={formatXAxisTick}
        // Adjust interval based on timeRange and device
        interval={isMobile ? timeRange === '1h' ? 'preserveEnd' : 'preserveStartEnd' : timeRange === '1h' ? 0 : 'preserveStartEnd'} minTickGap={isMobile ? 15 : 5} />
          {/* Heart Rate Y-Axis */}
          <YAxis yAxisId="hr" domain={vitalSignsConfig.hr.chartRange} orientation="left" stroke="#ef4444" label={isMobile ? undefined : {
          value: 'HR',
          position: 'insideLeft',
          angle: -90,
          style: {
            textAnchor: 'middle'
          },
          offset: 10
        }} tick={{
          fontSize: isMobile ? 8 : 10
        }}
        // On mobile, reduce the width of the axis
        width={isMobile ? 30 : 60} />
          {/* Reference lines for HR alerts - simplified on mobile */}
          {(!isMobile || timeRange === '1h') && <>
              <ReferenceLine yAxisId="hr" y={vitalSignsConfig.hr.yellowAlert[0]} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={isMobile ? 0.5 : 1} />
              <ReferenceLine yAxisId="hr" y={vitalSignsConfig.hr.yellowAlert[1]} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={isMobile ? 0.5 : 1} />
              <ReferenceLine yAxisId="hr" y={vitalSignsConfig.hr.redAlert[0]} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={isMobile ? 0.5 : 1} />
              <ReferenceLine yAxisId="hr" y={vitalSignsConfig.hr.redAlert[1]} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={isMobile ? 0.5 : 1} />
            </>}
          {/* Respiratory Rate Y-Axis */}
          <YAxis yAxisId="rr" domain={vitalSignsConfig.rr.chartRange} orientation="right" stroke="#3b82f6" label={isMobile ? undefined : {
          value: 'RR',
          position: 'insideRight',
          angle: -90,
          style: {
            textAnchor: 'middle'
          },
          offset: 10
        }} tick={{
          fontSize: isMobile ? 8 : 10
        }} width={isMobile ? 30 : 60} />
          {/* Reference lines for RR alerts - simplified on mobile */}
          {(!isMobile || timeRange === '1h') && <>
              <ReferenceLine yAxisId="rr" y={vitalSignsConfig.rr.yellowAlert[0]} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={isMobile ? 0.5 : 1} />
              <ReferenceLine yAxisId="rr" y={vitalSignsConfig.rr.yellowAlert[1]} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={isMobile ? 0.5 : 1} />
            </>}
          {/* SpO2 Y-Axis */}
          <YAxis yAxisId="spo2" domain={vitalSignsConfig.spo2.chartRange} orientation="right" stroke="#10b981" label={isMobile ? undefined : {
          value: 'SpO2',
          position: 'insideRight',
          angle: -90,
          style: {
            textAnchor: 'middle'
          },
          offset: 40
        }} tick={{
          fontSize: isMobile ? 8 : 10
        }}
        // On mobile, adjust position to prevent overlap
        axisLine={isMobile ? false : true} tickLine={isMobile ? false : true} hide={isMobile && showEtCO2} // Hide on mobile if EtCO2 is shown to reduce clutter
        />
          {/* Reference lines for SpO2 alerts */}
          {(!isMobile || timeRange === '1h') && <>
              <ReferenceLine yAxisId="spo2" y={vitalSignsConfig.spo2.yellowAlert[0]} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={isMobile ? 0.5 : 1} />
              <ReferenceLine yAxisId="spo2" y={vitalSignsConfig.spo2.redAlert[0]} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={isMobile ? 0.5 : 1} />
            </>}
          {/* MAP Y-Axis */}
          <YAxis yAxisId="map" domain={vitalSignsConfig.map.chartRange} orientation="left" stroke="#f59e0b" label={isMobile ? undefined : {
          value: 'MAP',
          position: 'insideLeft',
          angle: -90,
          style: {
            textAnchor: 'middle'
          },
          offset: 40
        }} tick={{
          fontSize: isMobile ? 8 : 10
        }}
        // On mobile, adjust position to prevent overlap
        axisLine={isMobile ? false : true} tickLine={isMobile ? false : true} hide={isMobile && timeRange !== '1h'} // Only show on mobile for 1h view
        />
          {/* Reference lines for MAP alerts */}
          {(!isMobile || timeRange === '1h') && <>
              <ReferenceLine yAxisId="map" y={vitalSignsConfig.map.yellowAlert[0]} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={isMobile ? 0.5 : 1} />
              <ReferenceLine yAxisId="map" y={vitalSignsConfig.map.yellowAlert[1]} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={isMobile ? 0.5 : 1} />
            </>}
          {/* EtCO2 axis if available */}
          {showEtCO2 && <YAxis yAxisId="etco2" domain={vitalSignsConfig.etco2.chartRange} orientation="right" stroke="#8b5cf6" // purple
        label={isMobile ? undefined : {
          value: 'EtCO2',
          position: 'insideRight',
          angle: -90,
          style: {
            textAnchor: 'middle'
          },
          offset: 70
        }} tick={{
          fontSize: isMobile ? 8 : 10
        }}
        // On mobile, adjust position to prevent overlap
        hide={isMobile && timeRange !== '1h'} // Only show on mobile for 1h view
        />}
          <Tooltip contentStyle={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '6px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          fontSize: isMobile ? '12px' : '14px',
          padding: isMobile ? '4px 8px' : '8px 10px'
        }} labelStyle={{
          fontWeight: 'bold',
          marginBottom: '5px',
          fontSize: isMobile ? '12px' : '14px'
        }} formatter={(value: number, name: string) => {
          // Add units to the tooltip values
          if (name === 'SpO2') return [`${value}%`, name];
          if (name === 'Temp') return [`${value}°C`, name];
          if (name === 'EtCO2' || name === 'Heart Rate' || name === 'Resp Rate' || name === 'MAP') {
            return [`${value}`, name];
          }
          return [value, name];
        }}
        // Make tooltip more responsive on mobile
        position={isMobile ? {
          x: 10,
          y: 50
        } : undefined} />
          {/* Responsive legend that adapts to mobile */}
          <Legend verticalAlign={isMobile ? 'bottom' : 'top'} height={isMobile ? 48 : 36} iconSize={isMobile ? 8 : 10} wrapperStyle={{
          fontSize: isMobile ? '10px' : '12px',
          paddingTop: isMobile ? '8px' : '0'
        }}
        // On mobile, show fewer items in legend for 4h, 12h, 24h views
        payload={isMobile && timeRange !== '1h' ? [{
          value: 'Heart Rate',
          type: 'line',
          color: '#ef4444'
        }, {
          value: 'Resp Rate',
          type: 'line',
          color: '#3b82f6'
        }, {
          value: 'SpO2',
          type: 'line',
          color: '#10b981'
        }] : undefined} />
          {/* Vital sign lines - these remain unchanged */}
          <Line type="monotone" dataKey="hr" stroke="#ef4444" yAxisId="hr" dot={false} strokeWidth={isMobile ? 1.5 : 2} name="Heart Rate" />
          <Line type="monotone" dataKey="rr" stroke="#3b82f6" yAxisId="rr" dot={false} strokeWidth={isMobile ? 1.5 : 2} name="Resp Rate" />
          <Line type="monotone" dataKey="spo2" stroke="#10b981" yAxisId="spo2" dot={false} strokeWidth={isMobile ? 1.5 : 2} name="SpO2" />
          <Line type="monotone" dataKey="map" stroke="#f59e0b" yAxisId="map" dot={false} strokeWidth={isMobile ? 1.5 : 2} name="MAP"
        // On mobile, hide for views other than 1h to reduce clutter
        hide={isMobile && timeRange !== '1h'} />
          {/* Conditionally render EtCO2 if available */}
          {showEtCO2 && <Line type="monotone" dataKey="etco2" stroke="#8b5cf6" // purple
        yAxisId="etco2" dot={false} strokeWidth={isMobile ? 1.5 : 2} name="EtCO2"
        // On mobile, hide for views other than 1h to reduce clutter
        hide={isMobile && timeRange !== '1h'} />}
        </LineChart>
      </ResponsiveContainer>
    </div>;
};
// Helper function to generate time-series data
function generateTimeSeriesData(patient: Patient, timeRange: string) {
  const points = timeRange === '1h' ? 60 : timeRange === '4h' ? 240 : timeRange === '12h' ? 144 : timeRange === '24h' ? 288 : 60;
  const interval = timeRange === '1h' ? 1 : timeRange === '4h' ? 1 : timeRange === '12h' ? 5 : timeRange === '24h' ? 5 : 1;
  const data = [];
  const now = new Date();
  // Set variance based on clinical realism
  const hrVarianceMax = 5; // +/- 5 bpm is realistic for HR
  const rrVarianceMax = 2; // +/- 2 breaths per minute
  const spo2VarianceMax = 1; // +/- 1% for SpO2
  const mapVarianceMax = 3; // +/- 3 mmHg for MAP
  const tempVarianceMax = 0.2; // +/- 0.2°C for temperature
  const etco2VarianceMax = 2; // +/- 2 mmHg for EtCO2
  // Starting values from patient's current vitals
  let hrCurrent = patient.vitals.hr;
  let rrCurrent = patient.vitals.rr;
  let spo2Current = patient.vitals.spo2;
  let mapCurrent = patient.vitals.map;
  let tempCurrent = patient.vitals.temp;
  let etco2Current = patient.vitals.etco2;
  // Generate data points from past to present
  for (let i = points; i >= 0; i -= interval) {
    const time = new Date(now.getTime() - i * 60000);
    // Format time with hours and minutes, ensuring proper AM/PM display
    const timeStr = time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    // Calculate variance (more variance as we go back in time)
    const timeFactor = i / points; // 1 at start (past), 0 at end (now)
    // Add some variance and trend to make the graph look realistic
    const hrVariance = (Math.random() * hrVarianceMax * 2 - hrVarianceMax) * (0.5 + timeFactor);
    const rrVariance = (Math.random() * rrVarianceMax * 2 - rrVarianceMax) * (0.5 + timeFactor);
    const spo2Variance = (Math.random() * spo2VarianceMax * 2 - spo2VarianceMax) * (0.5 + timeFactor);
    const mapVariance = (Math.random() * mapVarianceMax * 2 - mapVarianceMax) * (0.5 + timeFactor);
    const tempVariance = (Math.random() * tempVarianceMax * 2 - tempVarianceMax) * (0.5 + timeFactor);
    // Calculate values at this time point
    const hrValue = Math.round(patient.vitals.hrTrend[Math.min(Math.floor(i / 6), patient.vitals.hrTrend.length - 1)] + hrVariance);
    const rrValue = Math.round(patient.vitals.rrTrend[Math.min(Math.floor(i / 6), patient.vitals.rrTrend.length - 1)] + rrVariance);
    const spo2Value = Math.round(Math.min(100, Math.max(80, patient.vitals.spo2Trend[Math.min(Math.floor(i / 6), patient.vitals.spo2Trend.length - 1)] + spo2Variance)));
    const mapValue = Math.round(patient.vitals.mapTrend[Math.min(Math.floor(i / 6), patient.vitals.mapTrend.length - 1)] + mapVariance);
    const tempValue = Math.round((patient.vitals.tempTrend[Math.min(Math.floor(i / 6), patient.vitals.tempTrend.length - 1)] + tempVariance) * 10) / 10;
    // Add data point
    const dataPoint: any = {
      time: timeStr,
      hr: hrValue,
      rr: rrValue,
      spo2: spo2Value,
      map: mapValue,
      temp: tempValue
    };
    // Add EtCO2 if available
    if (patient.vitals.etco2 !== undefined && patient.vitals.etco2Trend) {
      const etco2Variance = (Math.random() * etco2VarianceMax * 2 - etco2VarianceMax) * (0.5 + timeFactor);
      const etco2Value = Math.round(patient.vitals.etco2Trend[Math.min(Math.floor(i / 6), patient.vitals.etco2Trend.length - 1)] + etco2Variance);
      dataPoint.etco2 = etco2Value;
    }
    data.push(dataPoint);
  }
  return data;
}
// Export function to convert vital signs data to CSV
export function exportVitalsToCSV(patient: Patient, timeRange: string): string {
  const data = generateTimeSeriesData(patient, timeRange);
  const headers = ['Time', 'Heart Rate', 'Resp Rate', 'SpO2', 'MAP', 'Temp'];
  // Add EtCO2 header if available
  if (patient.vitals.etco2 !== undefined) {
    headers.push('EtCO2');
  }
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  // Add data rows
  data.forEach(item => {
    const row = [item.time, item.hr, item.rr, item.spo2, item.map, item.temp];
    // Add EtCO2 if available
    if (patient.vitals.etco2 !== undefined) {
      row.push(item.etco2);
    }
    csvContent += row.join(',') + '\n';
  });
  return csvContent;
}
export default VitalsGraph;