import React from 'react';
import { COVENANT_PATH_STEPS } from '../constants';
import { PathStepData } from '../types';
import { ChevronRight } from 'lucide-react';

interface CovenantPathProps {
  selectedStep: PathStepData;
  onSelectStep: (step: PathStepData) => void;
}

const CovenantPath: React.FC<CovenantPathProps> = ({ selectedStep, onSelectStep }) => {
  return (
    <div className="w-full bg-white shadow-md rounded-xl p-6 mb-8 border-t-4 border-lds-gold">
      <h2 className="text-xl font-bold text-lds-blue mb-4 uppercase tracking-wider">La Senda de los Convenios</h2>
      
      <div className="relative">
        {/* Connecting Line */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 transform -translate-y-1/2 rounded"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          {COVENANT_PATH_STEPS.map((step, index) => {
            const isSelected = selectedStep.id === step.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => onSelectStep(step)}
                  className={`flex flex-col items-center group transition-all duration-300 focus:outline-none`}
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                      isSelected
                        ? 'bg-lds-blue border-lds-blue text-white shadow-lg scale-110'
                        : 'bg-white border-gray-300 text-gray-400 hover:border-lds-blue hover:text-lds-blue'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`mt-2 text-xs md:text-sm font-semibold text-center max-w-[100px] transition-colors ${
                      isSelected ? 'text-lds-blue' : 'text-gray-500 group-hover:text-lds-blue'
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
                
                {/* Mobile connector arrow, hidden on desktop */}
                {index < COVENANT_PATH_STEPS.length - 1 && (
                  <div className="md:hidden text-gray-300">
                    <ChevronRight size={24} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CovenantPath;
