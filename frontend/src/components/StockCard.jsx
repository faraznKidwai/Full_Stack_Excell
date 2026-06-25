import React from "react";
import { Building2, Factory } from "lucide-react";

const StockCard = ({ company }) => {
  const isHalal = company.status === true || company.status === "true";

  // Explicit design architecture variables mapping directly inside the component
  const badgeStyle = isHalal
    ? { backgroundColor: "#dcfce7", color: "#15803d" }
    : { backgroundColor: "#fdf2f2", color: "#9b1c1c" }; // Deep Maroon-Red Config

  return (
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
  );
};

export default StockCard;
