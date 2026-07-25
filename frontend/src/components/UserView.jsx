import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  SlidersHorizontal,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import StockCard from "./StockCard";
import logo from "../assets/ZamZamWater_logo.jpg";
import ".././App.css";

const CARDS_PER_PAGE = 30;

const UserView = () => {
  const [companies, setCompanies] = useState([]);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [sectors, setSectors] = useState([]);
  const [stats, setStats] = useState({
    totalStocks: 0,
    halalStocks: 0,
    sectorsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [arraiImageError, setArraiImageError] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [rowsRes, statsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/rows`),
          fetch(`${import.meta.env.VITE_API_URL}/api/stats`),
        ]);

        const rows = await rowsRes.json();
        const statsData = await statsRes.json();

        setCompanies(rows);
        setFilteredCompanies(rows);
        setStats(statsData);

        const uniqueSectors = [
          ...new Set(rows.map((r) => r.sector).filter(Boolean)),
        ].sort();
        setSectors(uniqueSectors);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = companies;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.ticker?.toLowerCase().includes(q) ||
          c.companyName?.toLowerCase().includes(q) ||
          c.sector?.toLowerCase().includes(q)
      );
    }

    if (selectedSector) {
      filtered = filtered.filter((c) => c.sector === selectedSector);
    }

    setFilteredCompanies(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, selectedSector, companies]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Monitor window scroll events for scroll-to-top feature
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(filteredCompanies.length / CARDS_PER_PAGE);

  // Get index slices for the current page slice
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const visibleCards = filteredCompanies.slice(startIndex, endIndex);

  // Pagination Handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: document.getElementById("search-section")?.offsetTop || 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: document.getElementById("search-section")?.offsetTop || 0, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="user-page"
      style={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      {/* ===== TOP BAR ===== */}
      <div className="topbar" id="topbar">
        <div className="topbar__inner">
          <span className="topbar__registration">
            SEBI REGISTERED RA (INH000016199)
          </span>
          <div className="topbar__right">
            <a
              href="https://wa.me/918694010200"
              target="_blank"
              rel="noopener noreferrer"
              className="topbar__link"
            >
              <Phone size={13} strokeWidth={2.5} /> +91 8694010200
            </a>
            <a href="mailto:info@zamzam-capital.com" className="topbar__link">
              <Mail size={13} strokeWidth={2.5} /> info@zamzam-capital.com
            </a>
          </div>
        </div>
      </div>

      {/* ===== MAIN NAVBAR ===== */}
      <nav className="main-nav" id="main-nav">
        <div className="main-nav__inner">
          <a
            href="https://zamzam-capital.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="main-nav__logo-link"
          >
            <span className="main-nav__brand">
              <img src={logo} alt="Zamzam Capital" />
            </span>
          </a>
          <div className="main-nav__links">
            <a
              href="https://zamzam-capital.com/shariah/ "
              className="main-nav__link main-nav__link--active"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shariah Compliance
            </a>
            <a
              href="https://zamzam-capital.com/halal-stocks/"
              target="_blank"
              rel="noopener noreferrer"
              className="main-nav__link"
            >
              Halal Stocks
            </a>
          </div>
        </div>
      </nav>

      {/* ===== WHITE CLEAN HERO CONTAINER ===== */}
      <div
        style={{
          padding: "40px 20px",
          maxWidth: "1200px",
          margin: "40px auto 20px auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            padding: "60px 40px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <span
            style={{
              textTransform: "uppercase",
              letterSpacing: "3px",
              fontSize: "0.75rem",
              fontWeight: "700",
              color: "#64748b",
              display: "block",
              marginBottom: "16px",
            }}
          >
            Shariah-Compliant Investments
          </span>

          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              color: "#0f172a",
              margin: "0 0 16px 0",
            }}
          >
            Screener <span style={{ color: "#02966c" }}>by Zamzam Capital</span>
          </h1>

          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              color: "#1e293b",
              margin: "0 0 20px 0",
            }}
          >
            Search, Screen &amp; Filter Zamzam Capital’s updated Halal Stocks List
          </h2>

          <p
            style={{
              fontSize: "0.95rem",
              color: "#475569",
              lineHeight: "1.6",
              maxWidth: "800px",
              margin: "0 auto 16px auto",
            }}
          >
            Stocks are updated for Shariah-compliance based on the latest Halal
            Stocks List issued by Zamzam Capital’s Shariah Board and includes all
            subsequently issued Mainboard IPOs listed on the National Stock
            Exchange (NSE). Sectors excluded are Banking & Finance, Insurance,
            Alcohol, Pork, Defence, Gambling, Tobacco, Media & Entertainment
          </p>

          <p
            style={{
              fontSize: "0.9rem",
              fontStyle: "italic",
              color: "#1e293b",
              margin: "0 0 40px 0",
            }}
          >
            <strong>Note :</strong> Zamzam Capital updates the Shariah-compliance
            of Mainboard IPOs before their Offer Date on an on-going basis through
            its{" "}
            <a
              href="https://t.me/zamzamcapital"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#22d3ee",
                textDecoration: "underline",
                fontWeight: "500",
              }}
            >
              Telegram Channel
            </a>
          </p>

          {/* Stats Deck */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                textAlign: "left",
              }}
            >
              <p
                style={{
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  letterSpacing: "1.5px",
                  color: "#64748b",
                  fontWeight: "700",
                  margin: "0 0 8px 0",
                }}
              >
                Total Stocks Covered
              </p>
              <h3
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "800",
                  color: "#0f172a",
                  margin: "0 0 8px 0",
                }}
              >
                {stats.totalStocks ? stats.totalStocks.toLocaleString() : "1,694"}
              </h3>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#64748b",
                  margin: "0",
                  lineHeight: "1.5",
                }}
              >
                Only NSE-listed stocks with Market Cap &gt; INR 500 Cr are included
                in our screening universe.
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                textAlign: "left",
              }}
            >
              <p
                style={{
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  letterSpacing: "1.5px",
                  color: "#64748b",
                  fontWeight: "700",
                  margin: "0 0 8px 0",
                }}
              >
                Halal Certified Stocks
              </p>
              <h3
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "800",
                  color: "#0f172a",
                  margin: "0 0 8px 0",
                }}
              >
                {stats.halalStocks ? stats.halalStocks.toLocaleString() : "887"}
              </h3>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#64748b",
                  margin: "0",
                  lineHeight: "1.5",
                }}
              >
                Updated to include the latest Mainboard IPO issued on the NSE.
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                textAlign: "left",
              }}
            >
              <p
                style={{
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  letterSpacing: "1.5px",
                  color: "#64748b",
                  fontWeight: "700",
                  margin: "0 0 8px 0",
                }}
              >
                Sectors Covered
              </p>
              <h3
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "800",
                  color: "#0f172a",
                  margin: "0 0 8px 0",
                }}
              >
                {stats.sectorsCount || "58"}
              </h3>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#64748b",
                  margin: "0",
                  lineHeight: "1.5",
                }}
              >
                Sectors excluded BFSI, Alcohol, Pork, Defense, Gambling, Media &amp;
                Entertainment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== COLLAPSIBLE CERTIFICATION NOTICE ===== */}
      <div
        style={{
          padding: "0 20px",
          maxWidth: "1200px",
          margin: "0 auto 40px auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            overflow: "hidden",
            transition: "all 0.3s ease",
          }}
        >
          <div
            onClick={() => setIsNoticeOpen(!isNoticeOpen)}
            style={{
              padding: "24px 32px",
              display: "flex",
              justifyContent: "between",
              alignItems: "center",
              cursor: "pointer",
              userSelect: "none",
              backgroundColor: "#ffffff",
            }}
          >
            <div style={{ flex: 1 }}>
              <span
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  color: "#64748b",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Zamzam Capital Shariah Board
              </span>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Certification Notice
              </h3>
            </div>
            <div style={{ color: "#02966c", display: "flex", alignItems: "center" }}>
              {isNoticeOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            </div>
          </div>

          <div
            style={{
              maxHeight: isNoticeOpen ? "1000px" : "0px",
              opacity: isNoticeOpen ? 1 : 0,
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              borderTop: isNoticeOpen ? "1px solid #f1f5f9" : "1px solid transparent",
            }}
          >
            <div style={{ padding: "32px" }}>
              <h4
                style={{
                  fontSize: "1.05rem",
                  fontWeight: "700",
                  color: "#0f172a",
                  margin: "0 0 16px 0",
                }}
              >
                Halal List Comprised of Shariah-Compliant Shares listed in the Indian
                Stock Market
              </h4>

              <p
                style={{
                  fontSize: "0.92rem",
                  color: "#475569",
                  lineHeight: "1.6",
                  margin: "0 0 16px 0",
                }}
              >
                The following listed companies on the National Stock Exchange (NSE) with
                a market capitalisation of at least INR 500 crore have been certified as{" "}
                <strong style={{ color: "#0f172a" }}>Shariah Compliant</strong> by the
                Shariah Board of Zamzam Capital, comprised of the following Shariah Scholars:
              </p>

              <ul
                style={{
                  listStyleType: "disc",
                  paddingLeft: "20px",
                  margin: "0 0 20px 0",
                  fontSize: "0.92rem",
                  color: "#334155",
                  lineHeight: "1.8",
                }}
              >
                <li>Mufti Asadullah Qasmi</li>
                <li>Mufti Mohammad Yahya Qasmi</li>
                <li>Dr. Sahlu Rahman E.</li>
              </ul>

              <p
                style={{
                  fontSize: "0.92rem",
                  color: "#475569",
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                Shariah-compliance screening covers business activity, financial ratios
                analysis and qualitative research parameters. The criteria used by the
                Shariah Board of Zamzam Capital is published{" "}
                <a
                  href="https://zamzam-capital.com/shariah/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#02966c", textDecoration: "underline" }}
                >
                  here
                </a>
                . This Screener will use data from the latest Halal Stocks List issued by
                the Shariah Board of Zamzam Capital that is published{" "}
                <a
                  href="https://zamzam-capital.com/halal-stocks/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#02966c", textDecoration: "underline" }}
                >
                  here
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SEARCH & FILTER ===== */}
      <section className="search-section" id="search-section">
        <div className="search-section__inner">
          <div className="search-bar">
            <Search size={18} className="search-bar__icon" />
            <input
              id="search-input"
              type="text"
              className="search-bar__input"
              placeholder="Search by ticker, company name, sector or industry"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-bar__clear"
                onClick={() => setSearchQuery("")}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="filter-wrapper" ref={filterRef}>
            <button
              id="filter-btn"
              className={`filter-btn ${selectedSector ? "filter-btn--active" : ""}`}
              onClick={() => setShowFilterDropdown((prev) => !prev)}
            >
              <SlidersHorizontal size={15} />
              <span>{selectedSector || "All Sectors"}</span>
              <ChevronDown
                size={14}
                className={`filter-btn__chevron ${showFilterDropdown ? "open" : ""}`}
              />
            </button>

            {showFilterDropdown && (
              <div className="filter-dropdown">
                <button
                  className={`filter-dropdown__item ${!selectedSector ? "active" : ""}`}
                  onClick={() => {
                    setSelectedSector("");
                    setShowFilterDropdown(false);
                  }}
                >
                  All Sectors
                </button>
                {sectors.map((sector) => (
                  <button
                    key={sector}
                    className={`filter-dropdown__item ${selectedSector === sector ? "active" : ""}`}
                    onClick={() => {
                      setSelectedSector(sector);
                      setShowFilterDropdown(false);
                    }}
                  >
                    {sector}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="search-section__meta">
          Showing {filteredCompanies.length > 0 ? startIndex + 1 : 0} -{" "}
          {Math.min(endIndex, filteredCompanies.length)} of {filteredCompanies.length} stocks
        </div>
      </section>

      {/* ===== CARDS GRID ===== */}
      <section className="cards-section" id="cards-section">
        {isLoading ? (
          <div className="cards-loading">
            <Loader2 size={36} className="spin" />
            <p>Loading stocks...</p>
          </div>
        ) : (
          <>
            <div className="cards-grid">
              {visibleCards.map((company) => (
                <StockCard key={company.id} company={company} />
              ))}
            </div>

            {filteredCompanies.length === 0 && (
              <div className="no-results">
                <Search size={48} strokeWidth={1.2} />
                <h3>No stocks found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}

            {/* ===== PAGINATION UI CONTROLS ===== */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "16px",
                  marginTop: "40px",
                  paddingBottom: "20px",
                }}
              >
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: currentPage === 1 ? "#f1f5f9" : "#ffffff",
                    color: currentPage === 1 ? "#94a3b8" : "#0f172a",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    fontWeight: "500",
                    fontSize: "0.9rem",
                    transition: "all 0.2s",
                  }}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "#475569",
                    fontWeight: "500",
                  }}
                >
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: currentPage === totalPages ? "#f1f5f9" : "#ffffff",
                    color: currentPage === totalPages ? "#94a3b8" : "#0f172a",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    fontWeight: "500",
                    fontSize: "0.9rem",
                    transition: "all 0.2s",
                  }}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ===== REDESIGNED COMPLIANCE FOOTER LAYOUT ===== */}
      <footer
        className="zamzam-sebi-exact-footer"
        style={{
          width: "100%",
          textAlign: "left",
          color: "#cbd5e1",
          position: "relative",
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* Emerald Green Primary Compliance Matrix */}
        <div 
          style={{ 
            backgroundColor: "#0d4d3a", 
            padding: "56px 20px" 
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
            
            {/* 3-Column Profile Grid */}
            <div 
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "32px",
                fontSize: "13px"
              }}
            >
              {/* Analyst Info Section */}
              <div>
                <h5 style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700, letterSpacing: "0.02em", marginBottom: "12px" }}>
                  SEBI Registered Research Analyst Details:
                </h5>
                <div style={{ color: "#e2e8f0", lineHeight: "1.6" }}>
                  <p>Registration Name: Zamzam Capital</p>
                  <p>Type of Registration: Non-Individual</p>
                  <p>Registration No: INH000016199</p>
                  <p>Validity: Jun 12, 2024 – Perpetual</p>
                </div>
                <div style={{ color: "#e2e8f0", lineHeight: "1.6", marginTop: "16px" }}>
                  <p>Principal Officer: Mr. Saif Ahmed</p>
                  <p style={{ margin: 0 }}>Email: <a href="mailto:po@zamzam-capital.com" style={{ color: "inherit", textDecoration: "underline" }}>po@zamzam-capital.com</a></p>
                  <p>Tel: +91 8694010200</p>
                </div>
              </div>

              {/* SEBI HQ Info Section */}
              <div>
                <h5 style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700, letterSpacing: "0.02em", marginBottom: "12px" }}>
                  SEBI Office Address:
                </h5>
                <div style={{ color: "#e2e8f0", lineHeight: "1.6" }}>
                  <p>7th Floor, 756-L, Anna Salai</p>
                  <p>Chennai – 600002, Tamil Nadu</p>
                  <p>Tel. Board: +91-44- 28880222 / 28526686</p>
                  <p style={{ margin: 0 }}>E-mail : <a href="mailto:sebisro@sebi.gov.in" style={{ color: "inherit", textDecoration: "underline" }}>sebisro@sebi.gov.in</a></p>
                </div>
                <div style={{ color: "#e2e8f0", lineHeight: "1.6", marginTop: "16px" }}>
                  <p>Compliance Officer: Mr. Shafik Ahmed</p>
                  <p style={{ margin: 0 }}>Email: <a href="mailto:co@zamzam-capital.com" style={{ color: "inherit", textDecoration: "underline" }}>co@zamzam-capital.com</a></p>
                  <p>Tel: +91 8694010200</p>
                </div>
              </div>

              {/* Registered Location Section */}
              <div>
                <h5 style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700, letterSpacing: "0.02em", marginBottom: "12px" }}>
                  Registered Address:
                </h5>
                <div style={{ color: "#e2e8f0", lineHeight: "1.6" }}>
                  <p>No. 6 Berlie Street</p>
                  <p>Langford Town</p>
                  <p>Shanthinagar</p>
                  <p>Bangalore – 560025, Karnataka</p>
                </div>
                <div style={{ color: "#e2e8f0", lineHeight: "1.6", marginTop: "16px" }}>
                  <p>Grievance Officer: Mr. Shafik Ahmed</p>
                  <p style={{ margin: 0 }}>Email: <a href="mailto:go@zamzam-capital.com" style={{ color: "inherit", textDecoration: "underline" }}>go@zamzam-capital.com</a></p>
                  <p>Tel: +91 8694010200</p>
                </div>
              </div>
            </div>

            <hr style={{ border: 0, borderTop: "1px solid rgba(255, 255, 255, 0.1)", margin: "24px 0" }} />

            {/* Grievance Narrative Framework */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "#e2e8f0", lineHeight: "1.6" }}>
              <p style={{ margin: 0 }}>
                For any service related assistance or grievances, you can reach us at{" "}
                <a href="mailto:support@zamzam-capital.com" style={{ color: "inherit", textDecoration: "underline", fontWeight: 500 }}>support@zamzam-capital.com</a>. 
                We take minimum 15 working days to respond or to come up with the solution of your query. If you are unsatisfied with our response then you can escalate your issue to SEBI{" "}
                <a href="https://scores.sebi.gov.in/" target="_blank" rel="noopener noreferrer" style={{ color: "#a3e635", textDecoration: "underline", fontWeight: 700 }}>SCORES</a>.
              </p>
              <p style={{ margin: 0 }}>
                With regard to physical complaints, investors may send their complaints to: Office of Investor Assistance and Education, Securities and Exchange Board of India, SEBI Bhavan. Plot No. C4-A, ‘G’ Block, Bandra-Kurla Complex, Bandra (E), Mumbai – 400 051.
              </p>
              <p style={{ margin: 0 }}>
                <a href="#" style={{ color: "#a3e635", textDecoration: "underline", fontWeight: 700 }}>ODR Portal</a> could be accessed, if unsatisfied with the response. Your attention is drawn to the SEBI circular no. SEBI/HO/OIAE/OIAE_IAD-1/P/CIR/2023/131 dated July 31, 2023, on “Online Resolution of Disputes in the Indian Securities Market”.
              </p>
              <p style={{ marginTop: "4px", color: "#cbd5e1", margin: 0 }}>
                Google Play:{" "}
                <a href="https://play.google.com/store/search?q=sebi+scores&c=apps" target="_blank" rel="noopener noreferrer" style={{ color: "#a3e635", textDecoration: "underline", fontWeight: 500 }}>Get the App</a>{" "}
                (Or) Search for “SEBI SCORES” in Google Play Link to SEBI Scores App
                <br />
                Apple Store:{" "}
                <a href="https://apps.apple.com/in/app/sebiscores/id6478849917" target="_blank" rel="noopener noreferrer" style={{ color: "#a3e635", textDecoration: "underline", fontWeight: 500 }}>Get the App</a>{" "}
                (Or) Search for “SEBI SCORES” in Apple App Store on website
              </p>
            </div>

            <hr style={{ border: 0, borderTop: "1px solid rgba(255, 255, 255, 0.1)", margin: "24px 0" }} />

            {/* Standard Legal Warnings */}
            <div style={{ fontSize: "11px", color: "rgba(203, 213, 225, 0.9)", lineHeight: "1.6" }}>
              <p style={{ marginBottom: "8px" }}>
                <span style={{ fontWeight: 700, fontStyle: "italic", color: "#ffffff" }}>Disclaimer:</span>{" "}
                “Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.”
              </p>
              <p style={{ margin: 0 }}>
                <span style={{ fontWeight: 700, fontStyle: "italic", color: "#ffffff" }}>Standard warning:</span>{" "}
                “Investment in securities market are subject to market risks. Read all the related documents carefully before investing.”
              </p>
            </div>

            {/* ARRAI Brand Frame */}
            <div style={{ marginTop: "32px", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "12px", fontStyle: "italic", color: "#ffffff", fontWeight: 500 }}>Proud member of</span>
              <div 
                style={{ 
                  backgroundColor: "#ffffff", 
                  padding: "8px", 
                  borderRadius: "4px", 
                  maxWidth: "200px", 
                  minHeight: "44px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}
              >
                {!arraiImageError ? (
                  <img 
                    src="https://arrai.org.in/wp-content/uploads/2021/09/ARRAI_Full-Lockup_2x.png" 
                    alt="Association of Registered Research Analysts of India" 
                    style={{ height: "36px", width: "100%", objectFit: "contain" }}
                    onError={() => setArraiImageError(true)}
                  />
                ) : (
                  <span style={{ fontSize: "10px", color: "#1e3a8a", fontWeight: 700, textAlign: "center", lineHeight: "1.2" }}>
                    Association of Registered<br />Research Analysts of India
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Clean White Bottom Navigation Row */}
        <div 
          style={{ 
            backgroundColor: "#ffffff", 
            color: "#64748b", 
            fontSize: "11px", 
            padding: "20px 20px", 
            borderTop: "1px solid #e2e8f0", 
            textAlign: "center" 
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
            <p style={{ lineHeight: "2.2", margin: 0 }}>
              © All Rights Reserved |{" "}
              <a href="https://zamzam-capital.com/compliance/?jump=complaints" style={{ color: "#64748b", textDecoration: "underline" }}>Complaints Board</a> |{" "}
              <a href="https://zamzam-capital.com/compliance/?jump=terms" style={{ color: "#64748b", textDecoration: "underline" }}>Terms &amp; Conditions</a> |{" "}
              <a href="https://zamzam-capital.com/compliance/?jump=gre" style={{ color: "#64748b", textDecoration: "underline" }}>Grievance Redressal Mechanism</a> |{" "}
              <a href="https://zamzam-capital.com/compliance/?jump=conduct" style={{ color: "#64748b", textDecoration: "underline" }}>Code of Conduct</a> |{" "}
              <a href="https://zamzam-capital.com/compliance/?jump=da" style={{ color: "#64748b", textDecoration: "underline" }}>Disclosure Advice</a>
            </p>
            <p style={{ lineHeight: "2.2", margin: 0, marginTop: "8px" }}>
              <a href="https://zamzam-capital.com/compliance/?jump=privacy" style={{ color: "#64748b", textDecoration: "underline" }}>Privacy Policy</a> |{" "}
              <a href="https://zamzam-capital.com/compliance/?jump=internal" style={{ color: "#64748b", textDecoration: "underline" }}>Internal Policy</a> |{" "}
              <a href="https://zamzam-capital.com/compliance/?jump=aml" style={{ color: "#64748b", textDecoration: "underline" }}>AML Policy</a> |{" "}
              <a href="https://zamzam-capital.com/compliance/?jump=refund" style={{ color: "#64748b", textDecoration: "underline" }}>Refund Policy</a> |{" "}
              <a href="https://zamzam-capital.com/compliance/?jump=disclosure" style={{ color: "#64748b", textDecoration: "underline" }}>Disclosure</a> |{" "}
              <a href="https://zamzam-capital.com/compliance/?jump=disclaimer" style={{ color: "#64748b", textDecoration: "underline" }}>Disclaimer</a> |{" "}
              <a href="https://zamzam-capital.com/compliance/?jump=investor" style={{ color: "#64748b", textDecoration: "underline" }}>Investor Charter</a> |{" "}
              <span style={{ color: "#334155", fontWeight: 600 }}>Zamzam Capital (#INH000016199)</span>
            </p>
          </div>
        </div>

        {/* Tailored Geometry Developer Stamp */}
        <div style={{ backgroundColor: "#ffffff", display: "flex", justifyContent: "center", padding: "4px 16px 20px 16px" }}>
          <div
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#ffffff",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.15)",
              background: "linear-gradient(90deg, rgba(0,143,122,0.95), rgba(6,111,93,0.95))",
              clipPath: "polygon(0 0, 100% 0, 96% 100%, 4% 100%)",
            }}
          >
            <span style={{ color: "rgba(255, 255, 255, 0.85)" }}>Developed by</span>
            <a
              href="https://aquibyazdani.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: 700, color: "#ffffff", transition: "color 0.2s ease", textDecoration: "none" }}
            >
              aquibyazdani.com
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Scroll-to-Top Component Action */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        type="button"
        style={{
          position: "fixed",
          bottom: "95px",
          right: "20px",
          zIndex: 99999,
          width: "44px",
          height: "44px",
          backgroundColor: "#0fa978",
          color: "#ffffff",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          display: showScrollTop ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          transition: "background-color 0.2s, transform 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#0c8e64";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#0fa978";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <svg viewBox="0 0 24 24" style={{ width: "20px", height: "20px", fill: "none", stroke: "currentColor", strokeWidth: "2.5" }}>
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default UserView;
