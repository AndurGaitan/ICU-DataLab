// Clinical standard thresholds for vital signs in ICU monitoring
export interface VitalSignThresholds {
  normalRange: [number, number]; // Min and max of normal range
  yellowAlert: [number, number]; // Min and max for yellow alert
  redAlert: [number, number]; // Min and max for red alert
  chartRange: [number, number]; // Min and max for chart display
}
export interface VitalSignsConfig {
  hr: VitalSignThresholds;
  rr: VitalSignThresholds;
  spo2: VitalSignThresholds;
  map: VitalSignThresholds;
  sbp: VitalSignThresholds;
  dbp: VitalSignThresholds;
  temp: VitalSignThresholds;
  etco2: VitalSignThresholds;
}
// ICU-Standard vital signs configuration
export const vitalSignsConfig: VitalSignsConfig = {
  hr: {
    normalRange: [60, 100],
    yellowAlert: [55, 110],
    redAlert: [45, 130],
    chartRange: [30, 160]
  },
  rr: {
    normalRange: [12, 20],
    yellowAlert: [10, 24],
    redAlert: [6, 30],
    chartRange: [5, 40]
  },
  spo2: {
    normalRange: [95, 100],
    yellowAlert: [93, 100],
    redAlert: [88, 100],
    chartRange: [80, 100]
  },
  map: {
    normalRange: [70, 105],
    yellowAlert: [65, 110],
    redAlert: [55, 120],
    chartRange: [40, 130]
  },
  sbp: {
    normalRange: [100, 140],
    yellowAlert: [90, 160],
    redAlert: [80, 180],
    chartRange: [60, 200]
  },
  dbp: {
    normalRange: [60, 90],
    yellowAlert: [55, 100],
    redAlert: [45, 110],
    chartRange: [40, 120]
  },
  temp: {
    normalRange: [36.0, 37.5],
    yellowAlert: [35.5, 38.0],
    redAlert: [34.5, 39.0],
    chartRange: [33, 40]
  },
  etco2: {
    normalRange: [35, 45],
    yellowAlert: [30, 50],
    redAlert: [25, 60],
    chartRange: [20, 70]
  }
};
// Helper function to determine vital sign status
export function getVitalStatus(type: keyof VitalSignsConfig, value: number): 'normal' | 'yellow' | 'red' {
  const config = vitalSignsConfig[type];
  // Check if in red alert range (outside yellow thresholds)
  if (value < config.redAlert[0] || value > config.redAlert[1]) {
    return 'red';
  }
  // Check if in yellow alert range (outside normal thresholds)
  if (value < config.yellowAlert[0] || value > config.yellowAlert[1]) {
    return 'yellow';
  }
  // Otherwise, it's in normal range
  return 'normal';
}
// Get color based on vital sign status
export function getVitalColor(type: keyof VitalSignsConfig, value: number): string {
  const status = getVitalStatus(type, value);
  switch (status) {
    case 'red':
      return '#ef4444';
    // red
    case 'yellow':
      return '#f59e0b';
    // amber
    case 'normal':
    default:
      return '#10b981';
    // green
  }
}