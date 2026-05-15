import React from 'react';

const StatsGrid = ({ data }) => {
  return (
    <div className="stats-column">
      <div className="stat-card google-card">
        <div className="stat-icon" style={{color: 'var(--primary)', background: '#e8f0fe'}}>
          %
        </div>
        <div className="stat-details">
          <h3>Overall Percentage</h3>
          <div className="stat-value">{data.percentage}%</div>
        </div>
      </div>

      <div className="stat-card google-card">
        <div className="stat-icon" style={{color: '#129eaf', background: '#e4f7fb'}}>
          📅
        </div>
        <div className="stat-details">
          <h3>Attendance</h3>
          <div className="stat-value">{data.attendance}%</div>
          {data.attendance < 75 && (
            <div className="warning-flash">⚠️ Low Attendance Warning</div>
          )}
        </div>
      </div>

      <div className="stat-card google-card">
        <div className="stat-icon" style={{
          color: data.overall_status === 'Pass' ? 'var(--success)' : 'var(--danger)', 
          background: data.overall_status === 'Pass' ? 'var(--success-bg)' : 'var(--danger-bg)'
        }}>
          {data.overall_status === 'Pass' ? '✓' : '✗'}
        </div>
        <div className="stat-details">
          <h3>Final Status</h3>
          <div className="stat-value" style={{
            color: data.overall_status === 'Pass' ? 'var(--success)' : 'var(--danger)'
          }}>
            {data.overall_status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsGrid;
