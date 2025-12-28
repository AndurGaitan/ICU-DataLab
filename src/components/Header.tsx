import React, { useState, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsModal from './SettingsModal';
import HelpModal from './HelpModal';
interface HeaderProps {
  sourceType: string;
  onBack?: () => void;
  showBackButton?: boolean;
}
/**
 * Header Component - Con funcionalidad completa
 *
 * Features:
 * - Settings modal
 * - Help & Documentation modal
 * - Mobile hamburger menu
 * - Responsive design
 */
const Header: React.FC<HeaderProps> = ({
  sourceType,
  onBack,
  showBackButton = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const handleSettingsClick = () => {
    setShowSettingsModal(true);
    setMobileMenuOpen(false);
  };
  const handleHelpClick = () => {
    setShowHelpModal(true);
    setMobileMenuOpen(false);
  };
  return <>
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Bar */}
        <div className="flex justify-between items-center py-3 md:py-4">
          {/* Left: Logo + Title */}
          <div className="flex items-center min-w-0 flex-1">
            {/* Back Button (si aplica) */}
            {showBackButton && onBack && <button onClick={onBack} className="mr-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors md:hidden" aria-label="Back to dashboard">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>}

            {/* Logo + Title */}
            <div className="flex items-center min-w-0">
              <img
                src="/icuDataLab.png"
                alt="ICU DataLab Logo"
                className="h-10 w-10 md:h-9 md:w-9 object-contain flex-shrink-0"
              />

              {/* Title - Responsive */}
              <div className="ml-2 min-w-0">
                <h1 className="text-base md:text-2xl font-bold text-gray-900 truncate">
                  Patient Monitoring
                </h1>
                {/* Subtitle - Solo desktop */}
                <p className="hidden md:block text-xs text-gray-500">
                  ICU Dashboard
                </p>
              </div>

              {/* Source Badge - Solo desktop */}
              <span className="hidden md:inline-flex ml-3 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full whitespace-nowrap">
                {sourceType === 'mock' ? 'Demo Mode' : sourceType}
              </span>
            </div>
          </div>

          {/* Right: Status + Actions */}
          <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
            {/* Status Badge - Compacto en mobile */}
            <div className="flex items-center px-2 md:px-3 py-1 bg-green-100 text-green-800 rounded-full">
              <span className="h-2 w-2 bg-green-600 rounded-full mr-1.5 md:mr-2"></span>
              <span className="text-xs md:text-sm font-medium hidden sm:inline">
                Online
              </span>
              <span className="text-xs font-medium sm:hidden">●</span>
            </div>

            {/* Settings Button - Solo desktop */}
            <button onClick={handleSettingsClick} className="hidden md:flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
              Settings
            </button>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Toggle menu" aria-expanded={mobileMenuOpen}>
              {mobileMenuOpen ? <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg> : <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && <motion.div initial={{
            height: 0,
            opacity: 0
          }} animate={{
            height: 'auto',
            opacity: 1
          }} exit={{
            height: 0,
            opacity: 0
          }} transition={{
            duration: 0.2,
            ease: 'easeInOut'
          }} className="md:hidden overflow-hidden border-t border-gray-200">
            <div className="py-3 space-y-2">
              {/* Source Info */}
              <div className="px-3 py-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                  Data Source
                </p>
                <p className="text-sm text-gray-900">
                  {sourceType === 'mock' ? 'Demo Mode (Mock Data)' : sourceType}
                </p>
              </div>

              {/* Actions */}
              <button onClick={handleSettingsClick} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
                <svg className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Settings
              </button>

              <button onClick={handleHelpClick} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
                <svg className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Help & Documentation
              </button>
            </div>
          </motion.div>}
        </AnimatePresence>
      </div>
    </header>

    {/* Modals */}
    <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />

    <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
  </>;
};
export default Header;