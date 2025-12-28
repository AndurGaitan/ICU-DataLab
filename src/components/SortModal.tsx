import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface SortModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSort: {
    field: string;
    order: 'asc' | 'desc';
  };
  onApplySort: (sort: {
    field: string;
    order: 'asc' | 'desc';
  }) => void;
}
/**
 * SortModal - Modal profesional para ordenar pacientes
 *
 * Features:
 * - Sort por nombre, edad, risk level, bed number
 * - Orden ascendente/descendente
 * - Animación smooth con Framer Motion
 */
const SortModal: React.FC<SortModalProps> = ({
  isOpen,
  onClose,
  currentSort,
  onApplySort
}) => {
  const [localSort, setLocalSort] = useState(currentSort);
  useEffect(() => {
    if (isOpen) {
      setLocalSort(currentSort);
    }
  }, [isOpen, currentSort]);
  const sortOptions = [{
    value: 'name',
    label: 'Patient Name',
    icon: '👤'
  }, {
    value: 'age',
    label: 'Age',
    icon: '📅'
  }, {
    value: 'riskLevel',
    label: 'Risk Level',
    icon: '⚠️'
  }, {
    value: 'bedNumber',
    label: 'Bed Number',
    icon: '🏥'
  }];
  const handleApply = () => {
    onApplySort(localSort);
    onClose();
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
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Sort Patients
                </h3>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4">
                {/* Sort Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sort By
                  </label>
                  <div className="space-y-2">
                    {sortOptions.map(option => <label key={option.value} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${localSort.field === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <input type="radio" name="sortField" checked={localSort.field === option.value} onChange={() => setLocalSort(prev => ({
                    ...prev,
                    field: option.value
                  }))} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                        <span className="ml-3 text-lg">{option.icon}</span>
                        <span className="ml-2 text-sm text-gray-700 font-medium">
                          {option.label}
                        </span>
                      </label>)}
                  </div>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Order
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setLocalSort(prev => ({
                  ...prev,
                  order: 'asc'
                }))} className={`p-3 border rounded-lg text-sm font-medium transition-all ${localSort.order === 'asc' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                      <div className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        Ascending
                      </div>
                    </button>
                    <button onClick={() => setLocalSort(prev => ({
                  ...prev,
                  order: 'desc'
                }))} className={`p-3 border rounded-lg text-sm font-medium transition-all ${localSort.order === 'desc' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                      <div className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Descending
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                  Cancel
                </button>
                <button onClick={handleApply} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Apply Sort
                </button>
              </div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
};
export default SortModal;