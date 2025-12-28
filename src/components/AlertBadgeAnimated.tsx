import React from 'react';
import { motion } from 'framer-motion';
interface AlertBadgeAnimatedProps {
  riskLevel: 'low' | 'medium' | 'high';
}
/**
 * AlertBadgeAnimated
 *
 * Badge de riesgo con animación de pulso profesional para high-risk patients
 * - Low: Verde estático
 * - Medium: Amarillo estático
 * - High: Rojo con pulso suave (no agresivo)
 */
const AlertBadgeAnimated: React.FC<AlertBadgeAnimatedProps> = ({
  riskLevel
}) => {
  const config = {
    low: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Low Risk',
      icon: '✓'
    },
    medium: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Medium Risk',
      icon: '⚠'
    },
    high: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'High Risk',
      icon: '⚠'
    }
  };
  const {
    bg,
    text,
    label,
    icon
  } = config[riskLevel];
  // Variantes de animación para high risk
  const pulseVariants = {
    pulse: {
      scale: [1, 1.08, 1],
      boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0)', '0 0 0 8px rgba(239, 68, 68, 0.2)', '0 0 0 0 rgba(239, 68, 68, 0)'],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };
  return <motion.div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${bg} ${text}`} animate={riskLevel === 'high' ? 'pulse' : undefined} variants={pulseVariants} role="status" aria-label={`Patient risk level: ${label}`}>
      <span className="mr-1" aria-hidden="true">
        {icon}
      </span>
      {label}
    </motion.div>;
};
export default AlertBadgeAnimated;