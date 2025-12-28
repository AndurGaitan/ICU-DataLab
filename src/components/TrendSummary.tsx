import React, { useState } from 'react';
import { Patient } from '../utils/mockData';
interface TrendSummaryProps {
  patient: Patient;
}
const TrendSummary: React.FC<TrendSummaryProps> = ({
  patient
}) => {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  return <div className="space-y-3">
      {patient.aiTrendSummaries.map((trend, index) => <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className={`p-3 flex justify-between items-center cursor-pointer ${trend.severity === 'high' ? 'bg-red-50' : trend.severity === 'medium' ? 'bg-yellow-50' : 'bg-blue-50'}`} onClick={() => setExpandedInsight(expandedInsight === trend.id ? null : trend.id)}>
            <div className="flex items-center">
              {trend.severity === 'high' ? <svg className="h-5 w-5 text-red-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg> : trend.severity === 'medium' ? <svg className="h-5 w-5 text-yellow-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg> : <svg className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>}
              <span className={`font-medium ${trend.severity === 'high' ? 'text-red-800' : trend.severity === 'medium' ? 'text-yellow-800' : 'text-blue-800'}`}>
                {trend.summary}
              </span>
            </div>
            <svg className={`h-5 w-5 transform transition-transform ${expandedInsight === trend.id ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          {expandedInsight === trend.id && <div className="p-3 bg-white">
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  AI Analysis
                </h4>
                <p className="text-sm text-gray-600">{trend.analysis}</p>
              </div>
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Contributing Factors
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {trend.contributingFactors.map((factor, i) => <li key={i}>{factor}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Recommendation
                </h4>
                <p className="text-sm text-gray-600">{trend.recommendation}</p>
              </div>
            </div>}
        </div>)}
    </div>;
};
export default TrendSummary;