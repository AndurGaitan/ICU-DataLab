import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}
/**
 * HelpModal - Modal profesional con documentación y ayuda
 *
 * Features:
 * - Quick start guide
 * - Feature documentation
 * - Keyboard shortcuts
 * - FAQ
 * - Animación smooth con Framer Motion
 */
const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'shortcuts' | 'faq'>('guide');
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
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Help & Documentation
                </h3>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Tabs */}
              <div className="px-6 pt-4 border-b border-gray-200">
                <div className="flex gap-1">
                  {[{
                id: 'guide',
                label: 'Quick Start',
                icon: '🚀'
              }, {
                id: 'shortcuts',
                label: 'Shortcuts',
                icon: '⌨️'
              }, {
                id: 'faq',
                label: 'FAQ',
                icon: '❓'
              }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab.id ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>)}
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]">
                {/* Quick Start Guide */}
                {activeTab === 'guide' && <div className="space-y-6">
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 mb-3">
                        Welcome to ICU Patient Monitoring Dashboard
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        This dashboard provides real-time monitoring of ICU
                        patients with AI-powered insights and clinical decision
                        support.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">
                        Key Features
                      </h5>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                            1
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Patient Overview
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              View all patients at a glance with color-coded
                              risk levels and vital signs
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                            2
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Detailed Patient View
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Click any patient card to see detailed vitals,
                              trends, and AI insights
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                            3
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Search & Filter
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Quickly find patients by name, filter by risk
                              level, or sort by various criteria
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                            4
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              AI Clinical Insights
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Get AI-powered trend analysis and clinical
                              recommendations
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">
                        Understanding Risk Levels
                      </h5>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                            LOW
                          </span>
                          <span className="text-sm text-gray-600">
                            Stable vitals, routine monitoring
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                            MEDIUM
                          </span>
                          <span className="text-sm text-gray-600">
                            Some abnormal vitals, increased monitoring
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg">
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                            HIGH
                          </span>
                          <span className="text-sm text-gray-600">
                            Critical vitals, immediate attention required
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>}

                {/* Keyboard Shortcuts */}
                {activeTab === 'shortcuts' && <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">
                        Navigation
                      </h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">
                            Search patients
                          </span>
                          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                            Ctrl + K
                          </kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">
                            Open filters
                          </span>
                          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                            Ctrl + F
                          </kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">
                            Back to dashboard
                          </span>
                          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                            Esc
                          </kbd>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">
                        Actions
                      </h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">
                            Add note
                          </span>
                          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                            Ctrl + N
                          </kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">
                            Export data
                          </span>
                          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                            Ctrl + E
                          </kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">
                            Refresh data
                          </span>
                          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                            Ctrl + R
                          </kbd>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">
                        Help
                      </h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">
                            Open help
                          </span>
                          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                            ?
                          </kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">
                            Open settings
                          </span>
                          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                            Ctrl + ,
                          </kbd>
                        </div>
                      </div>
                    </div>
                  </div>}

                {/* FAQ */}
                {activeTab === 'faq' && <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">
                        What data sources are supported?
                      </h5>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        The dashboard supports Mock Data (for demo/testing),
                        MIMIC-IV API (real-time data from BigQuery), and
                        MIMIC-IV JSON (pre-exported files). You can switch
                        between sources in Settings.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">
                        How are risk levels calculated?
                      </h5>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Risk levels are calculated based on vital signs (HR, RR,
                        SpO2, MAP, Temp) using clinical thresholds. Multiple
                        abnormal vitals increase the risk level from Low →
                        Medium → High.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">
                        What do the AI insights mean?
                      </h5>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        AI insights analyze vital sign trends and patterns to
                        identify potential clinical concerns (e.g., respiratory
                        decompensation, hemodynamic instability) and provide
                        evidence-based recommendations.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">
                        How often does data refresh?
                      </h5>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        By default, data refreshes every 30 seconds when
                        auto-refresh is enabled. You can adjust this interval
                        (10-120 seconds) in Settings or manually refresh using
                        Ctrl+R.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">
                        Can I export patient data?
                      </h5>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Yes! In the detailed patient view, click the "Export"
                        button to download vital signs data as CSV. You can
                        select different time ranges (1h, 4h, 12h, 24h) before
                        exporting.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">
                        How do I add clinical notes?
                      </h5>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Click "Add Note" in the patient detail view or use
                        Ctrl+N. Notes are timestamped and displayed below the
                        vitals graph for easy reference during rounds.
                      </p>
                    </div>
                  </div>}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Version 2.0.0 • Last updated: 2024
                </div>
                <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
};
export default HelpModal;