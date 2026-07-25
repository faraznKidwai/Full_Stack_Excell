import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full text-left font-sans text-slate-300">
      
      {/* Upper Green Background Block matching the image structure but keeping your original deep green dark theme gradient */}
      <div 
        className="relative overflow-hidden px-5 py-14 lg:px-8 lg:py-16" 
        style={{ background: 'radial-gradient(1200px 500px at 20% 0%, #0d4d3a25 0%, transparent 60%), #0d4d3a' }}
      >
        {/* Subtle decorative dot grid background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '28px 28px' }} 
        />

        <div className="relative max-w-7xl mx-auto">
          
          {/* ==================== UPPER SECTION: 3-COLUMN COMPLIANCE ADDRESS MATRIX ==================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 text-center md:text-left">
            
            {/* Column 1: Analyst Details */}
            <div>
              <h5 className="text-white text-[15px] font-bold tracking-wide mb-3">
                SEBI Registered Research Analyst Details:
              </h5>
              <p className="text-sm leading-relaxed text-slate-100/90 space-y-1">
                <span className="block">Registration Name: Zamzam Capital</span>
                <span className="block">Type of Registration: Non-Individual</span>
                <span className="block">Registration No: INH000016199</span>
                <span className="block">Validity: Jun 12, 2024 – Perpetual</span>
              </p>
              <p className="mt-5 text-sm leading-relaxed text-slate-100/90 space-y-1">
                <span className="block">Principal Officer: Mr. Saif Ahmed</span>
                <span className="block">
                  Email: <a href="mailto:po@zamzam-capital.com" className="hover:text-emerald-300 transition-colors underline">po@zamzam-capital.com</a>
                </span>
                <span className="block">Tel: +91 8694010200</span>
              </p>
            </div>

            {/* Column 2: SEBI Office Address */}
            <div>
              <h5 className="text-white text-[15px] font-bold tracking-wide mb-3">
                SEBI Office Address:
              </h5>
              <p className="text-sm leading-relaxed text-slate-100/90 space-y-1">
                <span className="block">7th Floor, 756-L, Anna Salai</span>
                <span className="block">Chennai – 600002, Tamil Nadu</span>
                <span className="block">Tel. Board: +91-44- 28880222 / 28526686</span>
                <span className="block">
                  E-mail : <a href="mailto:sebisro@sebi.gov.in" className="hover:text-emerald-300 transition-colors underline">sebisro@sebi.gov.in</a>
                </span>
              </p>
              <p className="mt-5 text-sm leading-relaxed text-slate-100/90 space-y-1">
                <span className="block">Compliance Officer: Mr. Shafik Ahmed</span>
                <span className="block">
                  Email: <a href="mailto:co@zamzam-capital.com" className="hover:text-emerald-300 transition-colors underline">co@zamzam-capital.com</a>
                </span>
                <span className="block">Tel: +91 8694010200</span>
              </p>
            </div>

            {/* Column 3: Registered Address */}
            <div>
              <h5 className="text-white text-[15px] font-bold tracking-wide mb-3">
                Registered Address:
              </h5>
              <p className="text-sm leading-relaxed text-slate-100/90 space-y-1">
                <span className="block">No. 6 Berlie Street</span>
                <span className="block">Langford Town</span>
                <span className="block">Shanthinagar</span>
                <span className="block">Bangalore – 560025, Karnataka</span>
              </p>
              <p className="mt-5 text-sm leading-relaxed text-slate-100/90 space-y-1">
                <span className="block">Grievance Officer: Mr. Shafik Ahmed</span>
                <span className="block">
                  Email: <a href="mailto:go@zamzam-capital.com" className="hover:text-emerald-300 transition-colors underline">go@zamzam-capital.com</a>
                </span>
                <span className="block">Tel: +91 8694010200</span>
              </p>
            </div>
          </div>

          <hr className="border-white/20 my-8" />

          {/* ==================== MIDDLE SECTION: DETAILED GRIEVANCE & MOBILE LINKS ==================== */}
          <div className="flex flex-col gap-4 text-sm text-slate-100/90 leading-relaxed text-justify md:text-left">
            <p>
              For any service related assistance or grievances, you can reach us at{' '}
              <a href="mailto:support@zamzam-capital.com" className="hover:text-emerald-300 transition-colors underline font-medium">
                support@zamzam-capital.com
              </a>
              . We take minimum 15 working days to respond or to come up with the solution of your query. If you are unsatisfied with our response then you can escalate your issue to SEBI{' '}
              <a href="https://scores.sebi.gov.in/" target="_blank" rel="noopener noreferrer" className="text-lime-300 hover:text-lime-200 transition-colors underline uppercase font-bold tracking-wider">
                SCORES
              </a>.
            </p>
            
            <p>
              With regard to physical complaints, investors may send their complaints to: Office of Investor Assistance and Education, Securities and Exchange Board of India, SEBI Bhavan. Plot No. C4-A, ‘G’ Block, Bandra-Kurla Complex, Bandra (E), Mumbai – 400 051.
            </p>
            
            <p>
              <a href="#" className="text-lime-300 hover:text-lime-200 transition-colors underline font-bold">
                ODR Portal
              </a>{' '}
              could be accessed, if unsatisfied with the response. Your attention is drawn to the SEBI circular no. SEBI/HO/OIAE/OIAE_IAD-1/P/CIR/2023/131 dated July 31, 2023, on “Online Resolution of Disputes in the Indian Securities Market”.
            </p>
            
            <p className="pt-2 text-slate-200">
              <span className="font-semibold text-white">Google Play:</span>{' '}
              <a href="https://play.google.com/store/search?q=sebi+scores&c=apps" target="_blank" rel="noopener noreferrer" className="text-lime-300 hover:text-lime-200 underline font-medium">
                Get the App
              </a>{' '}
              (Or) Search for “SEBI SCORES” in Google Play Link to SEBI Scores App
              <br />
              <span className="font-semibold text-white">Apple Store:</span>{' '}
              <a href="https://apps.apple.com/in/app/sebiscores/id6478849917" target="_blank" rel="noopener noreferrer" className="text-lime-300 hover:text-lime-200 underline font-medium">
                Get the App
              </a>{' '}
              (Or) Search for “SEBI SCORES” in Apple App Store on website
            </p>
          </div>

          <hr className="border-white/20 my-8" />

          {/* ==================== REGULATORY DISCLAIMER / STANDARD WARNINGS ==================== */}
          <div className="text-xs text-slate-200/90 leading-relaxed space-y-3">
            <p>
              <span className="font-bold italic text-white">Disclaimer:</span> “Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.”
            </p>
            <p>
              <span className="font-bold italic text-white">Standard warning:</span> “Investment in securities market are subject to market risks. Read all the related documents carefully before investing.”
            </p>
          </div>
        </div>
      </div>

      {/* ==================== LOWER SECTION: WHITE/LIGHT BAR COMPLAINTS & INTERNAL LINKS BAR ==================== */}
      <div className="bg-white text-slate-600 text-[12px] py-6 px-5 border-t border-slate-200 font-medium">
        <div className="max-w-7xl mx-auto text-center leading-loose">
          <div className="block md:inline">
            © All Rights Reserved |{' '}
            <a href="https://zamzam-capital.com/wp-content/uploads/2025/07/Complaints-Board-0625.pdf" className="hover:text-emerald-600 transition-colors underline mx-1">Complaints Board</a> |{' '}
            <a href="https://zamzam-capital.com/terms-and-conditions/" className="hover:text-emerald-600 transition-colors underline mx-1">Terms & Conditions</a> |{' '}
            <a href="https://zamzam-capital.com/wp-content/uploads/2024/08/Grievance-Redressal.pdf#" className="hover:text-emerald-600 transition-colors underline mx-1">Grievance Redressal Process</a> |{' '}
            <a href="https://zamzam-capital.com/wp-content/uploads/2024/08/Individual-Code-of-Conduct.pdf" className="hover:text-emerald-600 transition-colors underline mx-1">Individual Code of Conduct</a> |{' '}
            <a href="https://zamzam-capital.com/wp-content/uploads/2024/08/Disclosure-advice.pdf" className="hover:text-emerald-600 transition-colors underline mx-1">Disclosure Advice</a>
          </div>
          <div className="mt-2 block md:mt-1">
            <a href="https://zamzam-capital.com/wp-content/uploads/2024/08/AML-Policy.pdf" className="hover:text-emerald-600 transition-colors underline mx-1">Privacy Policy</a> |{' '}
            <a href="https://zamzam-capital.com/wp-content/uploads/2024/08/Internal-Policy.pdf" className="hover:text-emerald-600 transition-colors underline mx-1">Internal Policy</a> |{' '}
            <a href="https://zamzam-capital.com/wp-content/uploads/2024/08/AML-Policy.pdf" className="hover:text-emerald-600 transition-colors underline mx-1">AML Policy</a> |{' '}
            <a href="#" className="hover:text-emerald-600 transition-colors underline mx-1">Refund Policy</a> |Trace{' '}
            <a href="https://zamzam-capital.com/disclosure-under-regulation-19/" className="hover:text-emerald-600 transition-colors underline mx-1">Disclosure</a> |{' '}
            <a href="https://zamzam-capital.com/disclaimer/" className="hover:text-emerald-600 transition-colors underline mx-1">Disclaimer</a> |{' '}
            <a href="https://zamzam-capital.com/wp-content/uploads/2024/08/Investor-Charter.pdf" className="hover:text-emerald-600 transition-colors underline mx-1">Investor Charter</a> |{' '}
            <span className="text-slate-800 font-semibold">Zamzam Capital (#INH000016199)</span>
          </div>
        </div>
      </div>

      {/* ==================== SCROLL TO TOP BUTTON ==================== */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-[95px] right-5 z-[99999] w-11 h-11 bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-full cursor-pointer flex items-center justify-center shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          aria-label="Scroll to top"
          type="button"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}
    </footer>
  );
}