import React, { useMemo, useState, Children } from 'react';
import { motion } from 'framer-motion';
import PatientCard from './PatientCard';
import FilterModal from './FilterModal';
import SortModal from './SortModal';
import { Patient } from '../utils/mockData';
interface DashboardOverviewProps {
  patients: Patient[];
  onSelectPatient: (id: string) => void;
}
/**
 * DashboardOverview - Grid con funcionalidad completa
 *
 * Features:
 * - Search by name
 * - Filter by risk level, ventilation, age
 * - Sort by name, age, risk, bed number
 * - Staggered animation
 */
const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  patients,
  onSelectPatient
}) => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  // Filter state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    riskLevel: [] as string[],
    ventilationSupport: [] as string[],
    ageRange: {
      min: 0,
      max: 100
    }
  });
  // Sort state
  const [showSortModal, setShowSortModal] = useState(false);
  const [sort, setSort] = useState({
    field: 'name',
    order: 'asc' as 'asc' | 'desc'
  });
  // Filter and sort patients
  const filteredAndSortedPatients = useMemo(() => {
    let result = [...patients];
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query) || p.bedNumber.toLowerCase().includes(query) || p.diagnosis.toLowerCase().includes(query));
    }
    // Apply filters
    if (filters.riskLevel.length > 0) {
      result = result.filter(p => filters.riskLevel.includes(p.riskLevel));
    }
    if (filters.ventilationSupport.length > 0) {
      result = result.filter(p => filters.ventilationSupport.includes(p.ventilationSupport));
    }
    result = result.filter(p => p.age >= filters.ageRange.min && p.age <= filters.ageRange.max);
    // Apply sort
    result.sort((a, b) => {
      let aValue: any = a[sort.field as keyof Patient];
      let bValue: any = b[sort.field as keyof Patient];
      // Special handling for risk level
      if (sort.field === 'riskLevel') {
        const riskOrder = {
          low: 1,
          medium: 2,
          high: 3
        };
        aValue = riskOrder[a.riskLevel];
        bValue = riskOrder[b.riskLevel];
      }
      if (aValue < bValue) return sort.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.order === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [patients, searchQuery, filters, sort]);
  // Active filter count
  const activeFilterCount = filters.riskLevel.length + filters.ventilationSupport.length + (filters.ageRange.min > 0 || filters.ageRange.max < 100 ? 1 : 0);
  // Variantes para staggered animation
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };
  return <div>
      {/* Header - Optimizado para mobile */}
      <div className="mb-4 sm:mb-6">
        {/* Row 1: Title + Patient Count */}
        <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Patient Overview
          </h2>
          <span className="text-sm sm:text-base text-gray-500 font-normal">
            ({filteredAndSortedPatients.length}{' '}
            {filteredAndSortedPatients.length === 1 ? 'patient' : 'patients'})
          </span>
        </div>

        {/* Row 2: Search + Actions - Stack en mobile */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Search Bar - Full width en mobile */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" type="text" placeholder="Search patients..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>}
            </div>
          </div>

          {/* Action Buttons - Inline en mobile */}
          <div className="flex gap-2">
            <button onClick={() => setShowFilterModal(true)} className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 relative">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" />
              </svg>
              <span>Filter</span>
              {activeFilterCount > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>}
            </button>
            <button onClick={() => setShowSortModal(true)} className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
              </svg>
              <span>Sort</span>
            </button>
          </div>
        </div>
      </div>

      {/* No results message */}
      {filteredAndSortedPatients.length === 0 && <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No patients found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filters
          </p>
          {(searchQuery || activeFilterCount > 0) && <button onClick={() => {
        setSearchQuery('');
        setFilters({
          riskLevel: [],
          ventilationSupport: [],
          ageRange: {
            min: 0,
            max: 100
          }
        });
      }} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Clear all filters
            </button>}
        </div>}

      {/* Patient Cards Grid */}
      {filteredAndSortedPatients.length > 0 && <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" variants={containerVariants} initial="hidden" animate="visible" key={`${searchQuery}-${JSON.stringify(filters)}-${JSON.stringify(sort)}`}>
          {filteredAndSortedPatients.map(patient => <motion.div key={patient.id} variants={itemVariants}>
              <PatientCard patient={patient} onClick={() => onSelectPatient(patient.id)} />
            </motion.div>)}
        </motion.div>}

      {/* Modals */}
      <FilterModal isOpen={showFilterModal} onClose={() => setShowFilterModal(false)} filters={filters} onApplyFilters={setFilters} />

      <SortModal isOpen={showSortModal} onClose={() => setShowSortModal(false)} currentSort={sort} onApplySort={setSort} />
    </div>;
};
export default DashboardOverview;