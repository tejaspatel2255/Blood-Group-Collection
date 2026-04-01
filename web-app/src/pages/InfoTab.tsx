import { useState } from 'react';
import { Info, CheckCircle2, XCircle, HeartHandshake } from 'lucide-react';

export default function InfoTab() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      title: "Before you donate",
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      content: "Eat an easily digestible meal before donating blood. Stay hydrated — drink plenty of fluids in the 24 hours leading up to your donation. Rest well the night before donation. Avoid fatty foods which can affect tests on your blood."
    },
    {
      title: "When can NOT I donate blood?",
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      content: "Don't come to donate blood after consuming alcohol or other mood-altering substances. If you have a cold, flu, sore throat, or are taking antibiotics, you must wait until you are fully recovered. If you've had a tattoo or piercing in the last 6 months."
    },
    {
      title: "Eligibility Criteria",
      icon: <Info className="w-5 h-5 text-blue-500" />,
      content: "You must be between 18 and 65 years old. You must weigh at least 45 kg for men and 50 kg for women. Your hemoglobin must be at least 12.5 g/dL. You must be in generally good health and feeling well."
    },
    {
      title: "After you donate",
      icon: <HeartHandshake className="w-5 h-5 text-primary" />,
      content: "Keep the bandage on for the next few hours. Rest for a few minutes and enjoy the refreshments provided. Drink extra liquids for the rest of the day. Avoid strenuous physical activity or heavy lifting for 24 hours."
    }
  ];

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto animate-fade-in">
      <h1 className="text-2xl font-heading font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Info className="w-6 h-6 text-primary" /> Guidelines & Tips
      </h1>

      <div className="space-y-4 mb-8">
        {faqs.map((faq, index) => (
          <div key={index} className="premium-card overflow-hidden">
            <button 
              className="w-full p-4 flex items-center justify-between text-left focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex items-center gap-3">
                {faq.icon}
                <span className="font-heading font-semibold text-gray-900">{faq.title}</span>
              </div>
              <span className={`transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out px-4 overflow-hidden text-gray-600 text-sm leading-relaxed ${openIndex === index ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="border-t border-gray-50 pt-3">
                {faq.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="premium-card bg-red-50 p-6 text-center border border-red-100">
        <h3 className="font-heading font-bold text-primary mb-2">Need Help?</h3>
        <p className="text-sm text-gray-700 mb-5">Contact the Patel Samaj administrative desk for donor verifications or emergency blood requests.</p>
        <a href="tel:104" className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-red-200 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          Emergency Call 104
        </a>
      </div>
    </div>
  );
}
