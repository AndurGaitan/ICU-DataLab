import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    riskLevel: string[];
    ventilationSupport: string[];
    ageRange: {
      min: number;
      max: number;
    };
  };
  onApplyFilters: (filters: {
    riskLevel: string[];
    ventilationSupport: string[];
    ageRange: {
      min: number;
      max: number;
    };
  }) => void;
}
/**
 * FilterModal - Modal profesional para filtros de pacientes
 *
 * Features:
 * - Filtro por risk level (low, medium, high)
 * - Filtro por ventilation support (O2, NIV, MV)
 * - Filtro por rango de edad
 * - Animación smooth con Framer Motion
 */
const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  // Reset local filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);
  const handleRiskLevelToggle = (level: string) => {
    setLocalFilters(prev => ({
      ...prev,
      riskLevel: prev.riskLevel.includes(level) ? prev.riskLevel.filter(l => l !== level) : [...prev.riskLevel, level]
    }));
  };
  const handleVentilationToggle = (type: string) => {
    setLocalFilters(prev => ({
      ...prev,
      ventilationSupport: prev.ventilationSupport.includes(type) ? prev.ventilationSupport.filter(t => t !== type) : [...prev.ventilationSupport, type]
    }));
  };
  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };
  const handleReset = () => {
    const resetFilters = {
      riskLevel: [],
      ventilationSupport: [],
      ageRange: {
        min: 0,
        max: 100
      }
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
  };
  return <AnimatePresence>
      {isOpen && <>
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.2
      }} className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

          {/* Modal */}
          <motion.div initial={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} transition={{
        type: 'spring',
        duration: 0.3,
        bounce: 0
      }} className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Filter Patients
                </h3>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Risk Level */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Risk Level
                  </label>
                  <div className="space-y-2">
                    {['low', 'medium', 'high'].map(level => <label key={level} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <input type="checkbox" checked={localFilters.riskLevel.includes(level)} onChange={() => handleRiskLevelToggle(level)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <span className="ml-3 text-sm text-gray-700 capitalize">
                          {level} Risk
                        </span>
                        <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${level === 'high' ? 'bg-red-100 text-red-800' : level === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {level}
                        </span>
                      </label>)}
                  </div>
                </div>

                {/* Ventilation Support */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Ventilation Support
                  </label>
                  <div className="space-y-2">
                    {[{
                  value: 'O2',
                  label: 'Oxygen (O2)'
                }, {
                  value: 'NIV',
                  label: 'Non-Invasive Ventilation (NIV)'
                }, {
                  value: 'MV',
                  label: 'Mechanical Ventilation (MV)'
                }].map(type => <label key={type.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <input type="checkbox" checked={localFilters.ventilationSupport.includes(type.value)} onChange={() => handleVentilationToggle(type.value)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <span className="ml-3 text-sm text-gray-700">
                          {type.label}
                        </span>
                      </label>)}
                  </div>
                </div>

                {/* Age Range */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Age Range: {localFilters.ageRange.min} -{' '}
                    {localFilters.ageRange.max} years
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Minimum Age
                      </label>
                      <input type="range" min="0" max="100" value={localFilters.ageRange.min} onChange={e => setLocalFilters(prev => ({
                    ...prev,
                    ageRange: {
                      ...prev.ageRange,
                      min: parseInt(e.target.value)
                    }
                  }))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Maximum Age
                      </label>
                      <input type="range" min="0" max="100" value={localFilters.ageRange.max} onChange={e => setLocalFilters(prev => ({
                    ...prev,
                    ageRange: {
                      ...prev.ageRange,
                      max: parseInt(e.target.value)
                    }
                  }))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                <button onClick={handleReset} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                  Reset
                </button>
                <button onClick={handleApply} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
};
export default FilterModal;