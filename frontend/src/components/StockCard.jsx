import React from "react";
import { TrendingUp, Building2, Factory } from "lucide-react";

const StockCard = ({ company }) => {
  const isHalal = company.status === true || company.status === "true";

  return (
    <>
      {/* Injected style to target only the border layout transitions safely */}
      <style>{`
 #card-${company.ticker}.stock-card {
  border: 1px solid #bbf7d0 !important; /* Light green covering all sides */
  border-left: 1px solid #bbf7d0 !important; /* Overrides old thick accent bar */
  
  /* CHANGE THIS LINE: Ensures border, shadows, and transforms all glide smoothly */
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important; 
}

#card-${company.ticker}.stock-card:hover {
  border-color: #047857 !important; /* Perimeter turns dark green on hover */
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
