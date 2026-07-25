import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false); // Added state to track logo loading error safely

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
      
      {/* Upper Green Background Block */}
      <div className="relative bg-[#0d4d3a] px-5 py-12 lg:px-8 lg:py-14">
        <div className="relative max-w-7xl mx-auto">
          
          {/* ==================== UPPER SECTION: 3-COLUMN MATRIX ==================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left text-[13px]">
            
            {/* Column 1: Analyst Details */}
            <div>
              <h5 className="text-white font-bold tracking-wide mb-3 text-[14px]">
                SEBI Registered Research Analyst Details:
              </h5>
              <div className="leading-relaxed text-slate-200 space-y-0.5">
                <p>Registration Name: Zamzam Capital</p>
                <p>Type of Registration: Non-Individual</p>
                <p>Registration No: INH000016199</p>
                <p>Validity: Jun 12, 2024 – Perpetual</p>
              </div>
              <div className="mt-4 leading-relaxed text-slate-200 space-y-0.5">
                <p>Principal Officer: Mr. Saif Ahmed</p>
                <p>
                  Email: <a href="mailto:po@zamzam-capital.com" className="hover:underline">po@zamzam-capital.com</a>
                </p>
                <p>Tel: +91 8694010200</p>
              </div>
            </div>

            {/* Column 2: SEBI Office Address */}
            <div>
              <h5 className="text-white font-bold tracking-wide mb-3 text-[14px]">
                SEBI Office Address:
              </h5>
              <div className="leading-relaxed text-slate-200 space-y-0.5">
                <p>7th Floor, 756-L, Anna Salai</p>
                <p>Chennai – 600002, Tamil Nadu</p>
                <p>Tel. Board: +91-44- 28880222 / 28526686</p>
                <p>
                  E-mail: <a href="mailto:sebisro@sebi.gov.in" className="hover:underline">sebisro@sebi.gov.in</a>
                </p>
              </div>
              <div className="mt-4 leading-relaxed text-slate-200 space-y-0.5">
                <p>Compliance Officer: Mr. Shafik Ahmed</p>
                <p>
                  Email: <a href="mailto:co@zamzam-capital.com" className="hover:underline">co@zamzam-capital.com</a>
                </p>
                <p>Tel: +91 8694010200</p>
              </div>
            </div>

            {/* Column 3: Registered Address */}
            <div>
              <h5 className="text-white font-bold tracking-wide mb-3 text-[14px]">
                Registered Address:
              </h5>
              <div className="leading-relaxed text-slate-200 space-y-0.5">
                <p>No. 6 Berlie Street</p>
                <p>Langford Town</p>
                <p>Shanthinagar</p>
                <p>Bangalore – 560025, Karnataka</p>
              </div>
              <div className="mt-4 leading-relaxed text-slate-200 space-y-0.5">
                <p>Grievance Officer: Mr. Shafik Ahmed</p>
                <p>
                  Email: <a href="mailto:go@zamzam-capital.com" className="hover:underline">go@zamzam-capital.com</a>
                </p>
                <p>Tel: +91 8694010200</p>
              </div>
            </div>
          </div>

          <hr className="border-white/10 my-6" />

          {/* ==================== MIDDLE SECTION: GRIEVANCE LINKS ==================== */}
          <div className="flex flex-col gap-3 text-[13px] text-slate-200 leading-relaxed">
            <p>
              For any service related assistance or grievances, you can reach us at{' '}
              <a href="mailto:support@zamzam-capital.com" className="underline font-medium">
                support@zamzam-capital.com
              </a>
              . We take minimum 15 working days to respond or to come up with the solution of your query. If you are unsatisfied with our response then you can escalate your issue to SEBI{' '}
              <a href="https://scores.sebi.gov.in/" target="_blank" rel="noopener noreferrer" className="text-lime-400 hover:text-lime-300 underline font-bold">
                CHECK SCORES
              </a>.
            </p>
            
            <p>
              With regard to physical complaints, investors may send their complaints to: Office of Investor Assistance and Education, Securities and Exchange Board of India, SEBI Bhavan. Plot No. C4-A, ‘G’ Block, Bandra-Kurla Complex, Bandra (E), Mumbai – 400 051.
            </p>
            
            <p>
              <a href="#" className="text-lime-400 hover:text-lime-300 underline font-bold">
                ODR Portal
              </a>{' '}
              could be accessed, if unsatisfied with the response. Your attention is drawn to the SEBI circular no. SEBI/HO/OIAE/OIAE_IAD-1/P/CIR/2023/131 dated July 31, 2023, on “Online Resolution of Disputes in the Indian Securities Market”.
            </p>
            
            <p className="mt-1 text-slate-300">
              Google Play: <a href="#" className="text-lime-400 underline font-medium">Get the App on Google Play</a> (Or) Search for "SEBI SCORES" in Google Play Link to SEBI Scores App
              <br />
              Apple Store: <a href="#" className="text-lime-400 underline font-medium">Get the App on Apple Store</a> (Or) Search for "SEBI SCORES" in Apple App Store on website
            </p>
          </div>

          <hr className="border-white/10 my-6" />

          {/* ==================== QUICK NAVIGATION SECTION ==================== */}
          <div className="text-[13px] mb-6">
            <h5 className="text-white font-bold mb-2">Quick Navigation</h5>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-200 font-medium">
              <a href="#" className="hover:text-white transition-colors">Home</a>
              <a href="#" className="hover:text-white transition-colors">About Us</a>
              <a href="#" className="hover:text-white transition-colors">Shariah Board</a>
              <a href="#" className="hover:text-white transition-colors">Halal Stocks</a>
              <a href="#" className="hover:text-white transition-colors">Research Blog</a>
              <a href="#" className="hover:text-white transition-colors">Compliance & Disclosures</a>
              <a href="#" className="hover:text-white transition-colors">Join Us</a>
            </div>
          </div>

          <hr className="border-white/10 my-6" />

          {/* ==================== REGULATORY DISCLAIMERS ==================== */}
          <div className="text-[11px] text-slate-300/90 leading-relaxed space-y-2">
            <p>
              <span className="font-bold italic text-white">Disclaimer:</span> “Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.”
            </p>
            <p>
              <span className="font-bold italic text-white">Standard warning:</span> “Investment in securities market are subject to market risks. Read all the related documents carefully before investing.”
            </p>
          </div>

          {/* ==================== FIXED: CLEAN ARRAI MEMBER LOGO PIECE ==================== */}
          <div className="mt-8 flex items-center gap-3">
            <span className="text-[12px] italic text-white font-medium">Proud member of</span>
            <div className="bg-white p-2 rounded max-w-[200px] flex items-center justify-center min-h-[44px]">
              {!logoFailed ? (
                <img 
                  src="https://arrai.org.in/wp-content/uploads/2021/09/ARRAI_Full-Lockup_2x.png" style="background-color: #ffffff; width: 15%;" 
                  alt="Association of Registered Research Analysts of India" 
                  className="h-9 object-contain"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <span className="text-[10px] text-blue-900 font-bold text-center leading-tight">
                  Association of Registered<br />Research Analysts of India
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ==================== LOWER SECTION: WHITE COMPLAINTS LINKS BAR ==================== */}
      <div className="bg-white text-slate-500 text-[11px] py-5 px-5 border-t border-slate-200">
        <div className="max-w-7xl mx-auto text-center leading-loose">
          <div className="flex flex-wrap justify-center gap-x-1 gap-y-0.5">
            <span>© All Rights Reserved</span> | 
            <a href="#" className="hover:text-emerald-700 underline">Complaints Board</a> | 
            <a href="#" className="hover:text-emerald-700 underline">Terms & Conditions</a> | 
            <a href="#" className="hover:text-emerald-700 underline">Grievance Redressal Mechanism</a> | 
            <a href="#" className="hover:text-emerald-700 underline">Code of Conduct</a> | 
            <a href="#" className="hover:text-emerald-700 underline">Disclosure Advice</a>
          </div>
          <div className="flex flex-wrap justify-center gap-x-1 gap-y-0.5 mt-1">
            <a href="#" className="hover:text-emerald-700 underline">Privacy Policy</a> | 
            <a href="#" className="hover:text-emerald-700 underline">Internal Policy</a> | 
            <a href="#" className="hover:text-emerald-700 underline">AML Policy</a> | 
            <a href="#" className="hover:text-emerald-700 underline">Refund Policy</a> | 
            <a href="#" className="hover:text-emerald-700 underline">Disclosure</a> | 
            <a href="#" className="hover:text-emerald-700 underline">Disclaimer</a> | 
            <a href="#" className="hover:text-emerald-700 underline">Investor Charter</a> | 
            <span className="text-slate-700 font-semibold">Zamzam Capital (#INH000016199)</span>
          </div>
        </div>
      </div>

      {/* ==================== DEVELOPER BADGE ==================== */}
      <div className="flex justify-center bg-white px-4 pt-1 pb-5 sm:px-6 lg:px-8">
        <div
          className="relative inline-flex items-center gap-2 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white shadow-lg shadow-black/15"
          style={{
            background: "linear-gradient(90deg, rgba(0,143,122,0.95), rgba(6,111,93,0.95))",
            clipPath: "polygon(0 0, 100% 0, 96% 100%, 4% 100%)",
          }}
        >
          <span className="text-white/85">Developed by</span>
          <a
            href="https://aquibyazdani.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-white transition hover:text-white/80"
          >
            aquibyazdani.com
          </a>
        </div>
      </div>

      {/* ==================== SCROLL TO TOP BUTTON ==================== */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-5 z-[99999] w-11 h-11 bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-full cursor-pointer flex items-center justify-center shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          aria-label="Scroll to top"
          type="button"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}
    </footer>
  );
}
