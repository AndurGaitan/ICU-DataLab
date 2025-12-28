import React from 'react';
interface VitalSparklineProps {
  data: number[];
  color: string;
}
const VitalSparkline: React.FC<VitalSparklineProps> = ({
  data,
  color
}) => {
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
  return <svg width={width} height={height} className="inline-block">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>;
};
export default VitalSparkline;