import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
/**
 * SettingsModal - Modal profesional para configuración
 *
 * Features:
 * - Data source selection (Mock, MIMIC API, MIMIC JSON)
 * - Notification preferences
 * - Display preferences
 * - Animación smooth con Framer Motion
 */
const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [settings, setSettings] = useState({
    dataSource: 'mock',
    notifications: {
      highRisk: true,
      vitalAlerts: true,
      systemUpdates: false
    },
    display: {
      compactView: false,
      showTrends: true,
      autoRefresh: true,
      refreshInterval: 30
    }
  });
  const handleSave = () => {
    // TODO: Implement settings save logic
    console.log('Settings saved:', settings);
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
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Settings
                </h3>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Data Source */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Data Source
                  </h4>
                  <div className="space-y-2">
                    {[{
                  value: 'mock',
                  label: 'Mock Data (Demo)',
                  description: 'Simulated patient data for testing'
                }, {
                  value: 'mimic-api',
                  label: 'MIMIC-IV API',
                  description: 'Real data from MIMIC-IV database'
                }, {
                  value: 'mimic-json',
                  label: 'MIMIC-IV JSON',
                  description: 'Pre-exported JSON files'
                }].map(source => <label key={source.value} className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${settings.dataSource === source.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <input type="radio" name="dataSource" checked={settings.dataSource === source.value} onChange={() => setSettings(prev => ({
                    ...prev,
                    dataSource: source.value
                  }))} className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {source.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {source.description}
                          </div>
                        </div>
                      </label>)}
                  </div>
                </div>

                {/* Notifications */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Notifications
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          High Risk Alerts
                        </div>
                        <div className="text-xs text-gray-500">
                          Notify when patient risk level is high
                        </div>
                      </div>
                      <input type="checkbox" checked={settings.notifications.highRisk} onChange={e => setSettings(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      highRisk: e.target.checked
                    }
                  }))} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    </label>
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Vital Sign Alerts
                        </div>
                        <div className="text-xs text-gray-500">
                          Notify on abnormal vital signs
                        </div>
                      </div>
                      <input type="checkbox" checked={settings.notifications.vitalAlerts} onChange={e => setSettings(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      vitalAlerts: e.target.checked
                    }
                  }))} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    </label>
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          System Updates
                        </div>
                        <div className="text-xs text-gray-500">
                          Notify about system maintenance
                        </div>
                      </div>
                      <input type="checkbox" checked={settings.notifications.systemUpdates} onChange={e => setSettings(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      systemUpdates: e.target.checked
                    }
                  }))} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    </label>
                  </div>
                </div>

                {/* Display Preferences */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Display
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Compact View
                        </div>
                        <div className="text-xs text-gray-500">
                          Show more patients per row
                        </div>
                      </div>
                      <input type="checkbox" checked={settings.display.compactView} onChange={e => setSettings(prev => ({
                    ...prev,
                    display: {
                      ...prev.display,
                      compactView: e.target.checked
                    }
                  }))} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    </label>
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Show Trends
                        </div>
                        <div className="text-xs text-gray-500">
                          Display sparklines in cards
                        </div>
                      </div>
                      <input type="checkbox" checked={settings.display.showTrends} onChange={e => setSettings(prev => ({
                    ...prev,
                    display: {
                      ...prev.display,
                      showTrends: e.target.checked
                    }
                  }))} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    </label>
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Auto Refresh
                        </div>
                        <div className="text-xs text-gray-500">
                          Automatically update patient data
                        </div>
                      </div>
                      <input type="checkbox" checked={settings.display.autoRefresh} onChange={e => setSettings(prev => ({
                    ...prev,
                    display: {
                      ...prev.display,
                      autoRefresh: e.target.checked
                    }
                  }))} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    </label>
                    {settings.display.autoRefresh && <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Refresh Interval: {settings.display.refreshInterval}s
                        </label>
                        <input type="range" min="10" max="120" step="10" value={settings.display.refreshInterval} onChange={e => setSettings(prev => ({
                    ...prev,
                    display: {
                      ...prev.display,
                      refreshInterval: parseInt(e.target.value)
                    }
                  }))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>10s</span>
                          <span>120s</span>
                        </div>
                      </div>}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                  Cancel
                </button>
                <button onClick={handleSave} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Save Settings
                </button>
              </div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
};
export default SettingsModal;