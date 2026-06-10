import React from 'react';
import { TrendingUp, Building2, Factory } from 'lucide-react';

const StockCard = ({ company }) => {
  const isHalal = company.status === true || company.status === 'true';

  return (
    <div className="stock-card" id={`card-${company.ticker}`}>
      <div className="stock-card__top">
        <div className="stock-card__title-row">
          <h3 className="stock-card__ticker">{company.ticker}</h3>
          <span
            className={`stock-card__badge ${
              isHalal ? 'stock-card__badge--halal' : 'stock-card__badge--non-halal'
            }`}
          >
            {isHalal ? 'Halal' : 'Non-Halal'}
          </span>
          <div className="stock-card__trend-icon">
            <TrendingUp size={20} />
          </div>
        </div>
        <p className="stock-card__company">{company.companyName || '—'}</p>
      </div>

      <div className="stock-card__details">
        <div className="stock-card__detail-row">
          <Building2 size={14} className="stock-card__detail-icon" />
          <span className="stock-card__detail-label">Sector:</span>
          <span className="stock-card__detail-value">{company.sector || '—'}</span>
        </div>
        <div className="stock-card__detail-row">
          <Factory size={14} className="stock-card__detail-icon" />
          <span className="stock-card__detail-label">Industry:</span>
          <span className="stock-card__detail-value">{company.industry || '—'}</span>
        </div>
      </div>

      <div className="stock-card__footer">
        <div className="stock-card__metric">
          <span className="stock-card__metric-label">MARKET CAP</span>
          <span className="stock-card__metric-value">—</span>
        </div>
        <div className="stock-card__metric">
          <span className="stock-card__metric-label">CURRENT PRICE</span>
          <span className="stock-card__metric-value">—</span>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
