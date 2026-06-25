import React from "react";
import { Building2, Factory } from "lucide-react";

const StockCard = ({ company }) => {
  const isHalal = company.status === true || company.status === "true";

  const badgeStyle = isHalal
    ? { backgroundColor: "#dcfce7", color: "#15803d" }
    : { backgroundColor: "#fdf2f2", color: "#9b1c1c" };

  return (
    <>
      {/* Dynamic styles injected directly to override the missing CSS file links */}
      <style>{`
        #card-${company.ticker}.stock-card {
          border: 1px solid #bbf7d0 !important; /* Light green border all around the card */
          border-left: 1px solid #bbf7d0 !important; /* Replaces the old left-only bar */
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        #card-${company.ticker}.stock-card:hover {
          background-color: #047857 !important; /* Elegant dark green background on hover */
          border-color: #047857 !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
        }

        /* Invert text colors automatically when card is hovered */
        #card-${company.ticker}.stock-card:hover .stock-card__ticker,
        #card-${company.ticker}.stock-card:hover .stock-card__company,
        #card-${company.ticker}.stock-card:hover .stock-card__detail-label,
        #card-${company.ticker}.stock-card:hover .stock-card__detail-value,
        #card-${company.ticker}.stock-card:hover .stock-card__detail-icon {
          color: #ffffff !important;
        }
      `}</style>

      <div className="stock-card" id={`card-${company.ticker}`}>
        <div className="stock-card__top">
          <div className="stock-card__title-row">
            <h3 className="stock-card__ticker">{company.ticker}</h3>
            <span
              className={`stock-card__badge ${
                isHalal
                  ? "stock-card__badge--halal"
                  : "stock-card__badge--non-halal"
              }`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "4px 10px",
                borderRadius: "9999px",
                fontSize: "0.78rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
                ...badgeStyle,
              }}
            >
              {isHalal ? "Halal" : "Non-Halal"}
            </span>
          </div>
          <p className="stock-card__company">{company.companyName || "—"}</p>
        </div>

        <div className="stock-card__details">
          <div className="stock-card__detail-row">
            <Building2 size={14} className="stock-card__detail-icon" />
            <span className="stock-card__detail-label">Sector:</span>
            <span className="stock-card__detail-value">
              {company.sector || "—"}
            </span>
          </div>
          <div className="stock-card__detail-row">
            <Factory size={14} className="stock-card__detail-icon" />
            <span className="stock-card__detail-label">Industry:</span>
            <span className="stock-card__detail-value">
              {company.industry || "—"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default StockCard;
