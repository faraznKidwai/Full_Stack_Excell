import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
} from "lucide-react";
import StockCard from "./StockCard";
import logo from "../assets/ZamZamWater_logo.jpg";
import ".././App.css";

const CARDS_PER_PAGE = 12;

const UserView = () => {
  const [companies, setCompanies] = useState([]);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_PAGE);
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
  const loadMoreRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Using relative URLs here maps perfectly to Vercel Serverless in production
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
    setVisibleCount(CARDS_PER_PAGE);
  }, [searchQuery, selectedSector, companies]);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setVisibleCount((prev) => prev + CARDS_PER_PAGE);
    }
  }, []);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [handleObserver, filteredCompanies]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const visibleCards = filteredCompanies.slice(0, visibleCount);

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
            Search, Screen &amp; Filter Zamzam Capital’s updated Halal Stocks
            List
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
            Stocks List issued by Zamzam Capital’s Shariah Board and includes
            all subsequently issued Mainboard IPOs listed on the National Stock
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
            <strong>Note :</strong> Zamzam Capital updates the
            Shariah-compliance of Mainboard IPOs before their Offer Date on an
            on-going basis through its{" "}
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

          {/* Clean Light Stats Cards Deck */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
              marginTop: "20px",
            }}
          >
            {/* Total Stocks Covered */}
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
                {stats.totalStocks
                  ? stats.totalStocks.toLocaleString()
                  : "1,694"}
              </h3>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#64748b",
                  margin: "0",
                  lineHeight: "1.5",
                }}
              >
                Only NSE-listed stocks with Market Cap &gt; INR 500 Cr are
                included in our screening universe.
              </p>
            </div>

            {/* Halal Certified Stocks */}
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

            {/* Sectors Covered */}
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
                Sectors excluded BFSI, Alcohol, Pork, Defense, Gambling, Media
                &amp; Entertainment.
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
          {/* Header Bar - Always Visible & Clickable */}
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
            <div
              style={{
                color: "#02966c",
                display: "flex",
                alignItems: "center",
              }}
            >
              {isNoticeOpen ? (
                <ChevronUp size={22} />
              ) : (
                <ChevronDown size={22} />
              )}
            </div>
          </div>

          {/* Collapsible Content Section */}
          <div
            style={{
              maxHeight: isNoticeOpen ? "1000px" : "0px",
              opacity: isNoticeOpen ? 1 : 0,
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              borderTop: isNoticeOpen
                ? "1px solid #f1f5f9"
                : "1px solid transparent",
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
                Halal List Comprised of Shariah-Compliant Shares listed in the
                Indian Stock Market
              </h4>

              <p
                style={{
                  fontSize: "0.92rem",
                  color: "#475569",
                  lineHeight: "1.6",
                  margin: "0 0 16px 0",
                }}
              >
                The following listed companies on the National Stock Exchange
                (NSE) with a market capitalisation of at least INR 500 crore
                have been certified as{" "}
                <strong style={{ color: "#0f172a" }}>Shariah Compliant</strong>{" "}
                by the Shariah Board of Zamzam Capital, comprised of the
                following Shariah Scholars:
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
                Shariah-compliance screening covers business activity, financial
                ratios analysis and qualitative research parameters. The
                criteria used by the Shariah Board of Zamzam Capital is
                published{" "}
                <a
                  href="https://zamzam-capital.com/shariah/"
                  target="blank"
                  style={{ color: "#02966c", textDecoration: "underline" }}
                >
                  here
                </a>
                . This Screener will use data from the latest Halal Stocks List
                issued by the Shariah Board of Zamzam Capital that is published{" "}
                <a
                  href="https://zamzam-capital.com/halal-stocks/"
                  target="blank"
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
              className={`filter-btn ${
                selectedSector ? "filter-btn--active" : ""
              }`}
              onClick={() => setShowFilterDropdown((prev) => !prev)}
            >
              <SlidersHorizontal size={15} />
              <span>{selectedSector || "All Sectors"}</span>
              <ChevronDown
                size={14}
                className={`filter-btn__chevron ${
                  showFilterDropdown ? "open" : ""
                }`}
              />
            </button>

            {showFilterDropdown && (
              <div className="filter-dropdown">
                <button
                  className={`filter-dropdown__item ${
                    !selectedSector ? "active" : ""
                  }`}
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
                    className={`filter-dropdown__item ${
                      selectedSector === sector ? "active" : ""
                    }`}
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
          Showing {Math.min(visibleCount, filteredCompanies.length)} of{" "}
          {filteredCompanies.length} stocks
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

            {visibleCount < filteredCompanies.length && (
              <div ref={loadMoreRef} className="load-more-trigger">
                <Loader2 size={22} className="spin" />
                Loading more stocks...
              </div>
            )}

            {filteredCompanies.length === 0 && (
              <div className="no-results">
                <Search size={48} strokeWidth={1.2} />
                <h3>No stocks found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}
          </>
        )}
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="user-footer" id="user-footer">
        <div className="user-footer__inner">
          <p className="user-footer__copy">
            &copy; {new Date().getFullYear()} Zamzam Capital. All rights
            reserved.
          </p>
          <p className="user-footer__disclaimer">
            Investment in securities market are subject to market risks. Read
            all the related documents carefully before investing.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserView;
