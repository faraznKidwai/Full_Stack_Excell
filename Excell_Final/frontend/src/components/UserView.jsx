import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  SlidersHorizontal,
  Phone,
  Mail,
  BarChart3,
  TrendingUp,
  PieChart,
  ChevronDown,
  X,
  Loader2,
} from 'lucide-react';
import StockCard from './StockCard';

const CARDS_PER_PAGE = 12;
const API_BASE = 'http://localhost:5000';

const UserView = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [sectors, setSectors] = useState([]);
  const [stats, setStats] = useState({ totalStocks: 0, halalStocks: 0, sectorsCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const loadMoreRef = useRef(null);
  const filterRef = useRef(null);

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [rowsRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/api/rows`),
          fetch(`${API_BASE}/api/stats`),
        ]);

        const rows = await rowsRes.json();
        const statsData = await statsRes.json();

        setCompanies(rows);
        setFilteredCompanies(rows);
        setStats(statsData);

        const uniqueSectors = [...new Set(rows.map((r) => r.sector).filter(Boolean))].sort();
        setSectors(uniqueSectors);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Client-side search + sector filter
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

  // Infinite scroll via Intersection Observer
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setVisibleCount((prev) => prev + CARDS_PER_PAGE);
    }
  }, []);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [handleObserver, filteredCompanies]);

  // Close filter dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const visibleCards = filteredCompanies.slice(0, visibleCount);

  return (
    <div className="user-page">
      {/* ===== TOP BAR ===== */}
      <div className="topbar" id="topbar">
        <div className="topbar__inner">
          <span className="topbar__item">
            SEBI Registered Research Analyst — INH000016199
          </span>
          <div className="topbar__right">
            <a
              href="https://wa.me/918694010200"
              target="_blank"
              rel="noopener noreferrer"
              className="topbar__link"
            >
              <Phone size={11} />
              +91-8694010200
            </a>
            <a href="mailto:info@zamzam-capital.com" className="topbar__link">
              <Mail size={11} />
              info@zamzam-capital.com
            </a>
          </div>
        </div>
      </div>

      {/* ===== MAIN NAVBAR ===== */}
      <nav className="main-nav" id="main-nav">
        <div className="main-nav__inner">
          <a href="/" className="main-nav__logo-link">
            <div className="main-nav__logo-placeholder">ZC</div>
            <span className="main-nav__brand">Zamzam Capital</span>
          </a>
          <div className="main-nav__links">
            <a href="/" className="main-nav__link main-nav__link--active">
              Screener
            </a>
            <a
              href="https://zamzam-capital.com"
              target="_blank"
              rel="noopener noreferrer"
              className="main-nav__link"
            >
              About Us
            </a>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="hero" id="hero">
        <div className="hero__inner">
          <span className="hero__badge">Shariah-Compliant Investments</span>
          <h1 className="hero__title">Screener by Zamzam Capital</h1>
          <p className="hero__subtitle">
            Search, Screen &amp; Filter Zamzam Capital's updated Halal Stocks List
          </p>
          <p className="hero__description">
            Stocks are updated for Shariah-compliance based on the latest Halal Stocks List issued
            by Zamzam Capital's Shariah Board and includes all subsequently issued Mainboard IPOs
            listed on the National Stock Exchange (NSE).
          </p>
          <p className="hero__note">
            <strong>Note :</strong> Zamzam Capital updates the Shariah-compliance of Mainboard IPOs
            before their Offer Date on an on-going basis through its Telegram Channel
          </p>

          {/* Stats Row */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card__icon-wrap">
                <BarChart3 size={22} />
              </div>
              <h3 className="stat-card__number">{stats.totalStocks.toLocaleString()}</h3>
              <p className="stat-card__label">Total Stocks Covered</p>
              <p className="stat-card__desc">
                Only NSE-listed stocks with Market Cap &gt; INR 500 Cr are included in our
                screening universe.
              </p>
            </div>

            <div className="stat-card stat-card--accent">
              <div className="stat-card__icon-wrap">
                <TrendingUp size={22} />
              </div>
              <h3 className="stat-card__number">{stats.halalStocks.toLocaleString()}</h3>
              <p className="stat-card__label">Halal Certified Stocks</p>
              <p className="stat-card__desc">
                Updated to include the latest Mainboard IPO issued on the NSE.
              </p>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon-wrap">
                <PieChart size={22} />
              </div>
              <h3 className="stat-card__number">{stats.sectorsCount}</h3>
              <p className="stat-card__label">Sectors Covered</p>
              <p className="stat-card__desc">
                Sectors excluded BFSI, Alcohol, Pork, Defense, Gambling, Media &amp; Entertainment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEARCH & FILTER ===== */}
      <section className="search-section" id="search-section">
        <div className="search-section__inner">
          <div className="search-bar">
            <Search size={18} className="search-bar__icon" />
            <input
              id="search-input"
              type="text"
              className="search-bar__input"
              placeholder="Search by ticker, company name or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-bar__clear" onClick={() => setSearchQuery('')}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="filter-wrapper" ref={filterRef}>
            <button
              id="filter-btn"
              className={`filter-btn ${selectedSector ? 'filter-btn--active' : ''}`}
              onClick={() => setShowFilterDropdown((prev) => !prev)}
            >
              <SlidersHorizontal size={15} />
              <span>{selectedSector || 'All Sectors'}</span>
              <ChevronDown
                size={14}
                className={`filter-btn__chevron ${showFilterDropdown ? 'open' : ''}`}
              />
            </button>

            {showFilterDropdown && (
              <div className="filter-dropdown">
                <button
                  className={`filter-dropdown__item ${!selectedSector ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedSector('');
                    setShowFilterDropdown(false);
                  }}
                >
                  All Sectors
                </button>
                {sectors.map((sector) => (
                  <button
                    key={sector}
                    className={`filter-dropdown__item ${selectedSector === sector ? 'active' : ''}`}
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
          Showing {Math.min(visibleCount, filteredCompanies.length)} of {filteredCompanies.length}{' '}
          stocks
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
            &copy; {new Date().getFullYear()} Zamzam Capital. All rights reserved.
          </p>
          <p className="user-footer__disclaimer">
            Investment in securities market are subject to market risks. Read all the related
            documents carefully before investing.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserView;
