import React from "react";
import { Building2, Factory } from "lucide-react";
import ".././App.css";

const StockCard = ({ company }) => {
  const isHalal = company.status === true || company.status === "true";

  return (
    <div className="stock-card" id={`card-${company.ticker}`}>
      <div className="stock-card__top">
        <div className="stock-card__title-row">
          <h3 className="stock-card__ticker">{company.ticker}</h3>
          <span
            className={`status-pill ${
              isHalal ? "pill--halal" : "pill--nonhalal"
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
  );
};

export default StockCard;
