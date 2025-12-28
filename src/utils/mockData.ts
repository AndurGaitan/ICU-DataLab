import { vitalSignsConfig, getVitalStatus } from './vitalSignsConfig';
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  bedNumber: string;
  diagnosis: string;
  ventilationSupport: 'O2' | 'NIV' | 'MV';
  riskLevel: 'low' | 'medium' | 'high';
  vitals: {
    hr: number;
    hrTrend: number[];
    rr: number;
    rrTrend: number[];
    spo2: number;
    spo2Trend: number[];
    map: number;
    mapTrend: number[];
    temp: number;
    tempTrend: number[];
    etco2?: number;
    etco2Trend?: number[];
    sbp?: number;
    dbp?: number;
  };
  aiInsights?: string;
  aiTrendSummaries: {
    id: string;
    severity: 'low' | 'medium' | 'high';
    summary: string;
    analysis: string;
    contributingFactors: string[];
    recommendation: string;
  }[];
  medication: {
    name: string;
    dosage: string;
  }[];
  sedationLevel: string;
  labs: {
    name: string;
    value: number;
    unit: string;
    isAbnormal: boolean;
  }[];
}
export function generateMockPatients(count: number): Patient[] {
  const patients: Patient[] = [];
  for (let i = 0; i < count; i++) {
    const id = `p${i + 1}`;
    const riskLevel = randomRiskLevel();
    // Generate vitals based on risk level and clinical thresholds
    const vitals = generateVitalsForRiskLevel(riskLevel);
    // Generate appropriate AI insights based on risk level and vitals
    let aiInsights = generateAIInsights(riskLevel, vitals);
    // Create patient object
    patients.push({
      id,
      name: randomName(),
      age: 40 + Math.floor(Math.random() * 40),
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      bedNumber: `${String.fromCharCode(65 + Math.floor(i / 10))}-${i % 10 + 1}`,
      diagnosis: randomDiagnosis(),
      ventilationSupport: randomVentilationSupport(riskLevel),
      riskLevel,
      vitals,
      aiInsights,
      aiTrendSummaries: generateAITrendSummaries(riskLevel, vitals),
      medication: generateMedication(riskLevel),
      sedationLevel: randomSedationLevel(riskLevel),
      labs: generateLabs(riskLevel)
    });
  }
  return patients;
}
function generateVitalsForRiskLevel(riskLevel: 'low' | 'medium' | 'high') {
  // Heart Rate
  let hr: number;
  if (riskLevel === 'high') {
    // For high risk, either too high or too low (outside red alert thresholds)
    hr = Math.random() < 0.7 ? vitalSignsConfig.hr.redAlert[1] + Math.floor(Math.random() * 20) // high HR
    : Math.max(30, vitalSignsConfig.hr.redAlert[0] - Math.floor(Math.random() * 15)); // low HR
  } else if (riskLevel === 'medium') {
    // For medium risk, in yellow alert range but not red
    hr = Math.random() < 0.7 ? vitalSignsConfig.hr.yellowAlert[1] + Math.floor(Math.random() * (vitalSignsConfig.hr.redAlert[1] - vitalSignsConfig.hr.yellowAlert[1])) // high-yellow
    : Math.max(30, vitalSignsConfig.hr.redAlert[0] + Math.floor(Math.random() * (vitalSignsConfig.hr.yellowAlert[0] - vitalSignsConfig.hr.redAlert[0]))); // low-yellow
  } else {
    // For low risk, within normal range
    hr = vitalSignsConfig.hr.normalRange[0] + Math.floor(Math.random() * (vitalSignsConfig.hr.normalRange[1] - vitalSignsConfig.hr.normalRange[0]));
  }
  // Respiratory Rate
  let rr: number;
  if (riskLevel === 'high') {
    rr = Math.random() < 0.8 ? vitalSignsConfig.rr.redAlert[1] + Math.floor(Math.random() * 8) // high RR
    : Math.max(4, vitalSignsConfig.rr.redAlert[0] - Math.floor(Math.random() * 4)); // low RR
  } else if (riskLevel === 'medium') {
    rr = Math.random() < 0.7 ? vitalSignsConfig.rr.yellowAlert[1] + Math.floor(Math.random() * (vitalSignsConfig.rr.redAlert[1] - vitalSignsConfig.rr.yellowAlert[1])) // high-yellow
    : Math.max(5, vitalSignsConfig.rr.redAlert[0] + Math.floor(Math.random() * (vitalSignsConfig.rr.yellowAlert[0] - vitalSignsConfig.rr.redAlert[0]))); // low-yellow
  } else {
    rr = vitalSignsConfig.rr.normalRange[0] + Math.floor(Math.random() * (vitalSignsConfig.rr.normalRange[1] - vitalSignsConfig.rr.normalRange[0]));
  }
  // SpO2
  let spo2: number;
  if (riskLevel === 'high') {
    // For high risk, low SpO2 (below red threshold)
    spo2 = Math.max(80, vitalSignsConfig.spo2.redAlert[0] - Math.floor(Math.random() * 8));
  } else if (riskLevel === 'medium') {
    // For medium risk, in yellow alert range
    spo2 = Math.max(85, vitalSignsConfig.spo2.redAlert[0] + Math.floor(Math.random() * (vitalSignsConfig.spo2.yellowAlert[0] - vitalSignsConfig.spo2.redAlert[0])));
  } else {
    // For low risk, normal range
    spo2 = vitalSignsConfig.spo2.normalRange[0] + Math.floor(Math.random() * (vitalSignsConfig.spo2.normalRange[1] - vitalSignsConfig.spo2.normalRange[0]));
  }
  // MAP
  let map: number;
  if (riskLevel === 'high') {
    map = Math.random() < 0.6 ? Math.max(40, vitalSignsConfig.map.redAlert[0] - Math.floor(Math.random() * 15)) // low MAP (more common in high risk)
    : vitalSignsConfig.map.redAlert[1] + Math.floor(Math.random() * 15); // high MAP
  } else if (riskLevel === 'medium') {
    map = Math.random() < 0.5 ? vitalSignsConfig.map.redAlert[0] + Math.floor(Math.random() * (vitalSignsConfig.map.yellowAlert[0] - vitalSignsConfig.map.redAlert[0])) // low-yellow
    : vitalSignsConfig.map.yellowAlert[1] + Math.floor(Math.random() * (vitalSignsConfig.map.redAlert[1] - vitalSignsConfig.map.yellowAlert[1])); // high-yellow
  } else {
    map = vitalSignsConfig.map.normalRange[0] + Math.floor(Math.random() * (vitalSignsConfig.map.normalRange[1] - vitalSignsConfig.map.normalRange[0]));
  }
  // Temperature
  let temp: number;
  if (riskLevel === 'high') {
    temp = Math.random() < 0.7 ? vitalSignsConfig.temp.redAlert[1] + Math.random() * 1 // high temp
    : Math.max(33, vitalSignsConfig.temp.redAlert[0] - Math.random() * 1); // low temp
  } else if (riskLevel === 'medium') {
    temp = Math.random() < 0.6 ? vitalSignsConfig.temp.yellowAlert[1] + Math.random() * (vitalSignsConfig.temp.redAlert[1] - vitalSignsConfig.temp.yellowAlert[1]) // high-yellow
    : Math.max(34, vitalSignsConfig.temp.redAlert[0] + Math.random() * (vitalSignsConfig.temp.yellowAlert[0] - vitalSignsConfig.temp.redAlert[0])); // low-yellow
  } else {
    temp = vitalSignsConfig.temp.normalRange[0] + Math.random() * (vitalSignsConfig.temp.normalRange[1] - vitalSignsConfig.temp.normalRange[0]);
  }
  temp = Math.round(temp * 10) / 10; // Round to 1 decimal place
  // Generate EtCO2 if on ventilator
  let etco2: number | undefined;
  let etco2Trend: number[] | undefined;
  if (riskLevel === 'high' || riskLevel === 'medium' && Math.random() > 0.5) {
    if (riskLevel === 'high') {
      etco2 = Math.random() < 0.6 ? Math.max(20, vitalSignsConfig.etco2.redAlert[0] - Math.floor(Math.random() * 10)) // low EtCO2
      : vitalSignsConfig.etco2.redAlert[1] + Math.floor(Math.random() * 15); // high EtCO2
    } else {
      etco2 = Math.random() < 0.5 ? vitalSignsConfig.etco2.redAlert[0] + Math.floor(Math.random() * (vitalSignsConfig.etco2.yellowAlert[0] - vitalSignsConfig.etco2.redAlert[0])) // low-yellow
      : vitalSignsConfig.etco2.yellowAlert[1] + Math.floor(Math.random() * (vitalSignsConfig.etco2.redAlert[1] - vitalSignsConfig.etco2.yellowAlert[1])); // high-yellow
    }
    etco2Trend = generateTrend(etco2, 3, riskLevel);
  }
  // Generate BP values
  const sbp = calculateSBPfromMAP(map, riskLevel);
  const dbp = calculateDBPfromMAP(map, sbp);
  // Generate trends with appropriate patterns
  const hrTrend = generateTrend(hr, 5, riskLevel);
  const rrTrend = generateTrend(rr, 2, riskLevel);
  const spo2Trend = generateTrend(spo2, 1, riskLevel, true);
  const mapTrend = generateTrend(map, 4, riskLevel);
  const tempTrend = generateTrend(temp, 0.2, riskLevel);
  return {
    hr,
    hrTrend,
    rr,
    rrTrend,
    spo2,
    spo2Trend,
    map,
    mapTrend,
    sbp,
    dbp,
    temp,
    tempTrend,
    etco2,
    etco2Trend
  };
}
function calculateSBPfromMAP(map: number, riskLevel: 'low' | 'medium' | 'high'): number {
  // Using the formula: MAP ≈ DBP + 1/3(SBP - DBP)
  // We can estimate SBP if we make assumptions about pulse pressure
  let pulsePressure: number;
  if (riskLevel === 'high') {
    // High risk patients often have wider or narrower pulse pressures
    pulsePressure = Math.random() < 0.5 ? 20 + Math.floor(Math.random() * 15) // Narrow pulse pressure
    : 50 + Math.floor(Math.random() * 30); // Wide pulse pressure
  } else if (riskLevel === 'medium') {
    pulsePressure = 30 + Math.floor(Math.random() * 25);
  } else {
    pulsePressure = 40 + Math.floor(Math.random() * 10); // Normal pulse pressure
  }
  // Estimate DBP first
  const estimatedDBP = map - pulsePressure / 3;
  // Then calculate SBP
  return Math.round(estimatedDBP + pulsePressure);
}
function calculateDBPfromMAP(map: number, sbp: number): number {
  // Using the formula: MAP ≈ DBP + 1/3(SBP - DBP)
  // Solving for DBP: DBP ≈ (3*MAP - SBP) / 2
  const calculatedDBP = Math.round((3 * map - sbp) / 2);
  // Ensure DBP is within reasonable range compared to SBP
  return Math.min(sbp - 10, Math.max(40, calculatedDBP));
}
function generateAIInsights(riskLevel: 'low' | 'medium' | 'high', vitals: any): string | undefined {
  // Count abnormal vitals
  const hrStatus = getVitalStatus('hr', vitals.hr);
  const rrStatus = getVitalStatus('rr', vitals.rr);
  const spo2Status = getVitalStatus('spo2', vitals.spo2);
  const mapStatus = getVitalStatus('map', vitals.map);
  const tempStatus = getVitalStatus('temp', vitals.temp);
  // Generate insights based on patterns of abnormal vitals
  if (riskLevel === 'high') {
    if (hrStatus === 'red' && rrStatus === 'red' && spo2Status === 'red') {
      return 'HR ↑, RR ↑, SpO2 ↓ — potential respiratory decompensation';
    } else if (mapStatus === 'red' && hrStatus === 'red') {
      return 'MAP ↓ with HR ↑ — possible early shock pattern';
    } else if (tempStatus === 'red' && hrStatus === 'red' && rrStatus === 'red') {
      return 'Temp ↑, HR ↑, RR ↑ — sepsis alert';
    } else if (spo2Status === 'red' && vitals.etco2 && getVitalStatus('etco2', vitals.etco2) === 'red') {
      return 'SpO2 ↓, EtCO2 ↑ — ventilation-perfusion mismatch';
    } else {
      return 'Multiple vital sign abnormalities — deterioration risk';
    }
  } else if (riskLevel === 'medium') {
    if (spo2Status === 'yellow') {
      return 'SpO2 trending downward over past 30 minutes';
    } else if (hrStatus === 'yellow') {
      return 'HR variability reduced — monitor closely';
    } else if (mapStatus === 'yellow') {
      return 'MAP fluctuations detected — fluid status check recommended';
    } else {
      return 'Vital signs at borderline thresholds — continue monitoring';
    }
  }
  return undefined; // No insights for stable patients
}

// Helper functions for generating mock data
function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomRiskLevel(): 'low' | 'medium' | 'high' {
  const rand = Math.random();
  if (rand < 0.6) return 'low';
  if (rand < 0.85) return 'medium';
  return 'high';
}
function randomName(): string {
  const firstNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris'];
  return `${randomFromArray(firstNames)} ${randomFromArray(lastNames)}`;
}
function randomDiagnosis(): string {
  return randomFromArray(['Pneumonia', 'COPD Exacerbation', 'Sepsis', 'Acute Respiratory Distress', 'Myocardial Infarction', 'Congestive Heart Failure', 'Stroke', 'Diabetic Ketoacidosis', 'Trauma', 'Post-operative Monitoring', 'Renal Failure', 'Liver Failure', 'Pulmonary Embolism', 'Severe Hypertension', 'Status Epilepticus']);
}
function randomVentilationSupport(riskLevel: 'low' | 'medium' | 'high'): 'O2' | 'NIV' | 'MV' {
  if (riskLevel === 'high') {
    return Math.random() < 0.7 ? 'MV' : 'NIV';
  }
  if (riskLevel === 'medium') {
    return Math.random() < 0.6 ? 'NIV' : 'O2';
  }
  return 'O2';
}
function generateTrend(baseValue: number, variance: number, riskLevel: 'low' | 'medium' | 'high', isInverse = false): number[] {
  const length = 10;
  const trend: number[] = [];
  let value = baseValue;
  // For high risk, create more concerning trends
  const trendFactor = riskLevel === 'high' ? isInverse ? -0.7 // Decreasing trend for SpO2
  : 0.7 // Increasing trend for other vitals
  : riskLevel === 'medium' ? isInverse ? -0.3 : 0.3 : 0; // Stable for low risk
  // Add some randomness to initial points to avoid flat lines
  for (let i = 0; i < length; i++) {
    // Add randomness that decreases as we approach current time
    // This makes the most recent values closest to the current value
    const randomVariance = (Math.random() * variance * 2 - variance) * (1 - i / length);
    // Add trend factor (stronger effect for earlier points)
    const trendEffect = trendFactor * (1 - i / length) * 2;
    value = value + trendEffect + randomVariance;
    // Ensure values stay within reasonable ranges
    if (isInverse) {
      value = Math.min(100, Math.max(80, value)); // For SpO2
    }
    trend.push(Math.round(value * 10) / 10);
  }
  // Reverse so most recent value is last
  return trend.reverse();
}
function generateAITrendSummaries(riskLevel: 'low' | 'medium' | 'high', vitals: any): any[] {
  const summaries = [];
  // Check vital sign statuses
  const hrStatus = getVitalStatus('hr', vitals.hr);
  const rrStatus = getVitalStatus('rr', vitals.rr);
  const spo2Status = getVitalStatus('spo2', vitals.spo2);
  const mapStatus = getVitalStatus('map', vitals.map);
  const tempStatus = getVitalStatus('temp', vitals.temp);
  if (riskLevel === 'high') {
    // Respiratory decompensation pattern
    if (rrStatus !== 'normal' && spo2Status !== 'normal') {
      summaries.push({
        id: 'trend1',
        severity: 'high',
        summary: 'Potential respiratory decompensation',
        analysis: 'Analysis shows a concerning pattern of increased work of breathing with decreasing oxygen saturation over the past hour. This pattern is consistent with early respiratory decompensation.',
        contributingFactors: [`Heart rate ${vitals.hrTrend[0]} → ${vitals.hr} (${hrStatus !== 'normal' ? 'abnormal' : 'compensatory'})`, `Respiratory rate trending upward (${vitals.rrTrend[0]} → ${vitals.rr})`, `SpO2 decreased from ${vitals.spo2Trend[0]}% to ${vitals.spo2}% despite increased FiO2`],
        recommendation: 'Consider ABG assessment, chest imaging, and preparation for possible escalation of respiratory support.'
      });
    }
    // Hemodynamic instability pattern
    else if (mapStatus !== 'normal') {
      summaries.push({
        id: 'trend1',
        severity: 'high',
        summary: 'Hemodynamic instability',
        analysis: 'Vital signs indicate possible circulatory compromise with MAP below target threshold. Trend analysis suggests progressive deterioration over the past 30 minutes.',
        contributingFactors: [`MAP decreased from ${vitals.mapTrend[0]} to ${vitals.map} mmHg`, `Heart rate increased from ${vitals.hrTrend[0]} to ${vitals.hr} bpm`, `SBP/DBP: ${vitals.sbp}/${vitals.dbp} mmHg (inadequate perfusion pressure)`],
        recommendation: 'Urgent fluid resuscitation assessment, consider vasopressor support if fluid non-responsive. Check lactate and reassess tissue perfusion.'
      });
    }
    // Add second insight for high risk patients if temp is abnormal
    if (tempStatus !== 'normal' && Math.random() < 0.7) {
      summaries.push({
        id: 'trend2',
        severity: tempStatus === 'red' ? 'high' : 'medium',
        summary: tempStatus === 'red' ? 'Fever with systemic response' : 'Temperature abnormality',
        analysis: `Temperature of ${vitals.temp}°C with associated vital sign changes suggests possible systemic inflammatory response. ${tempStatus === 'red' ? 'Pattern is consistent with sepsis criteria.' : ''}`,
        contributingFactors: [`Temperature ${vitals.tempTrend[0]} → ${vitals.temp}°C`, `Heart rate elevated at ${vitals.hr} bpm`, `Respiratory rate increased to ${vitals.rr}`],
        recommendation: tempStatus === 'red' ? 'Consider sepsis protocol activation, blood cultures, and early antimicrobial therapy.' : 'Monitor temperature trend, assess for infection sources, consider antipyretics if symptomatic.'
      });
    }
    // Fluid balance for patients with normal temp
    else if (Math.random() < 0.5) {
      summaries.push({
        id: 'trend2',
        severity: 'medium',
        summary: 'Fluid balance concern',
        analysis: 'MAP fluctuations combined with other clinical indicators suggest possible fluid balance issues that may require intervention.',
        contributingFactors: ['MAP variability increased in last 2 hours', 'Urine output decreased to <0.5 ml/kg/hr', 'Slight increase in heart rate with position changes'],
        recommendation: 'Consider fluid challenge or assessment of volume status with ultrasound.'
      });
    }
  } else if (riskLevel === 'medium') {
    if (spo2Status !== 'normal') {
      summaries.push({
        id: 'trend1',
        severity: 'medium',
        summary: 'Declining respiratory status',
        analysis: 'Gradual decrease in SpO2 with increased respiratory rate suggests increasing oxygen demand or decreased respiratory efficiency.',
        contributingFactors: [`SpO2 trending downward over past 2 hours (${vitals.spo2Trend[0]}% → ${vitals.spo2}%)`, `Mild increase in respiratory rate (${vitals.rrTrend[0]} → ${vitals.rr})`, 'Patient reports increased dyspnea with movement'],
        recommendation: 'Consider increasing oxygen support and more frequent respiratory assessments.'
      });
    } else if (mapStatus !== 'normal') {
      summaries.push({
        id: 'trend1',
        severity: 'medium',
        summary: 'Blood pressure fluctuation',
        analysis: 'MAP has been unstable over the monitoring period, potentially indicating early hemodynamic compromise or medication effect.',
        contributingFactors: [`MAP variability: ${vitals.mapTrend[0]} → ${vitals.map} mmHg`, `Heart rate trend: ${vitals.hrTrend[0]} → ${vitals.hr} bpm`, 'Fluid balance status needs assessment'],
        recommendation: 'Monitor fluid status, review medication timing relative to BP changes, consider more frequent measurements.'
      });
    } else {
      summaries.push({
        id: 'trend1',
        severity: 'medium',
        summary: 'Early vital sign drift',
        analysis: 'Multiple vital signs showing gradual deviation from baseline, though still within concerning but not critical ranges.',
        contributingFactors: [`Heart rate increased from ${vitals.hrTrend[0]} to ${vitals.hr} bpm`, `Respiratory pattern change noted in last hour`, `MAP now at ${vitals.map} mmHg (trending ${vitals.map < vitals.mapTrend[0] ? 'down' : 'up'})`],
        recommendation: 'Increase monitoring frequency, review medication schedule, assess for clinical changes.'
      });
    }
  } else {
    summaries.push({
      id: 'trend1',
      severity: 'low',
      summary: 'Stable vital signs',
      analysis: 'All vital signs remain within normal ranges with appropriate variability. No concerning patterns detected in the last 4 hours.',
      contributingFactors: ['Heart rate appropriately increases with activity', 'Respiratory rate remains in normal range (12-18)', 'SpO2 consistently above 95%'],
      recommendation: 'Continue current care plan and monitoring frequency.'
    });
  }
  return summaries;
}
function generateMedication(riskLevel: 'low' | 'medium' | 'high'): any[] {
  const baseMeds = [{
    name: 'Acetaminophen',
    dosage: '1000mg q6h'
  }, {
    name: 'Pantoprazole',
    dosage: '40mg daily'
  }];
  if (riskLevel === 'high') {
    return [...baseMeds, {
      name: 'Norepinephrine',
      dosage: '0.05 mcg/kg/min'
    }, {
      name: 'Vancomycin',
      dosage: '1g q12h'
    }, {
      name: 'Piperacillin-Tazobactam',
      dosage: '4.5g q6h'
    }];
  } else if (riskLevel === 'medium') {
    return [...baseMeds, {
      name: 'Ceftriaxone',
      dosage: '2g daily'
    }, {
      name: 'Furosemide',
      dosage: '40mg q12h'
    }];
  }
  return baseMeds;
}
function randomSedationLevel(riskLevel: 'low' | 'medium' | 'high'): string {
  if (riskLevel === 'high') {
    return randomFromArray(['RASS -2 (Light sedation)', 'RASS -3 (Moderate sedation)', 'RASS -4 (Deep sedation)']);
  } else if (riskLevel === 'medium') {
    return randomFromArray(['RASS -1 (Drowsy)', 'RASS 0 (Alert and calm)']);
  }
  return 'RASS 0 (Alert and calm)';
}
function generateLabs(riskLevel: 'low' | 'medium' | 'high'): any[] {
  const labs = [];
  // WBC
  const wbc = riskLevel === 'high' ? 15 + Math.random() * 5 : riskLevel === 'medium' ? 11 + Math.random() * 4 : 7 + Math.random() * 3;
  labs.push({
    name: 'WBC',
    value: Math.round(wbc * 10) / 10,
    unit: 'K/µL',
    isAbnormal: wbc > 11
  });
  // Hemoglobin
  const hgb = riskLevel === 'high' ? 8 + Math.random() * 2 : riskLevel === 'medium' ? 10 + Math.random() * 2 : 13 + Math.random() * 2;
  labs.push({
    name: 'Hgb',
    value: Math.round(hgb * 10) / 10,
    unit: 'g/dL',
    isAbnormal: hgb < 12
  });
  // Creatinine
  const cr = riskLevel === 'high' ? 1.8 + Math.random() * 1.2 : riskLevel === 'medium' ? 1.2 + Math.random() * 0.6 : 0.7 + Math.random() * 0.5;
  labs.push({
    name: 'Creatinine',
    value: Math.round(cr * 10) / 10,
    unit: 'mg/dL',
    isAbnormal: cr > 1.2
  });
  // Lactate
  const lactate = riskLevel === 'high' ? 3 + Math.random() * 3 : riskLevel === 'medium' ? 1.5 + Math.random() * 1.5 : 0.5 + Math.random() * 1;
  labs.push({
    name: 'Lactate',
    value: Math.round(lactate * 10) / 10,
    unit: 'mmol/L',
    isAbnormal: lactate > 2
  });
  return labs;
}