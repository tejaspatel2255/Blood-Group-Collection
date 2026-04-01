import { useState } from 'react';
import { Droplet, ArrowRight, HeartPulse, Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Onboarding() {
  const { markOnboardingSeen } = useAppContext();
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Register donors from your community", icon: <HeartPulse className="w-20 h-20 text-white" /> },
    { title: "Filter by blood group instantly", icon: <Search className="w-20 h-20 text-white" /> },
    { title: "Save lives in emergencies", icon: <Droplet className="w-20 h-20 text-white" /> }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else markOnboardingSeen();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col pt-16 items-center bg-primary text-white select-none">
      <div className="flex flex-col items-center mb-8">
        <Droplet className="w-16 h-16 mb-2" />
        <h1 className="text-3xl font-heading font-bold text-center leading-tight">Patel Samaj<br/>Blood Donor App</h1>
        <p className="text-red-200 mt-2 italic font-medium">"Your blood donors at your fingertips"</p>
      </div>

      <div className="flex-1 w-full max-w-md flex flex-col items-center justify-center px-6 transition-all duration-300">
        <div className="bg-red-700/50 p-6 rounded-full shadow-inner mb-6 animate-pulse">
            {steps[step].icon}
        </div>
        <h2 className="text-2xl font-bold text-center tracking-wide">{steps[step].title}</h2>
      </div>

      <div className="pb-12 w-full max-w-md px-6 flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-white' : 'w-2 bg-red-400'}`} />
          ))}
        </div>
        <button 
          onClick={handleNext} 
          className="w-full bg-white text-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 active:scale-95 transition-transform"
        >
          {step === steps.length - 1 ? 'Get Started' : 'Next'} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
