import React from 'react';

const HomeView = ({ data }) => {
  return (
    <div className="content-area fade-in">
      <div className="greeting-banner">
        <div className="greeting-text">Welcome, Parent of {data.full_name}</div>
        <div className="greeting-sub">
          Here is the latest academic overview for your child (Class {data.class}-{data.section}, Roll No: {data.roll_no}).
        </div>
      </div>

      <div className="home-grid">
        <div className="quick-stats-card">
          <h3>Academic Standing</h3>
          <div className="quick-stat-row">
            <span className="quick-stat-label">Overall Percentage</span>
            <span className="quick-stat-value">{data.percentage}%</span>
          </div>
          <div className="quick-stat-row">
            <span className="quick-stat-label">Final Status</span>
            <span className={`status-pill ${data.overall_status.toLowerCase()}`}>
              {data.overall_status}
            </span>
          </div>
        </div>

        <div className="quick-stats-card">
          <h3>Attendance</h3>
          <div className="quick-stat-row">
            <span className="quick-stat-label">Total Attendance</span>
            <span className="quick-stat-value" style={{ color: data.attendance >= 75 ? 'var(--success)' : 'var(--danger)' }}>
              {data.attendance}%
            </span>
          </div>
          <div className="quick-stat-row">
            <span className="quick-stat-label">Status</span>
            <span className={`status-pill ${data.attendance >= 75 ? 'pass' : 'fail'}`}>
              {data.attendance >= 75 ? 'Satisfactory' : 'Needs Attention'}
            </span>
          </div>
        </div>
        
        {data.remarks && data.remarks.length > 0 && (
          <div className="quick-stats-card" style={{ gridColumn: '1 / -1' }}>
            <h3>Latest Teacher Remark</h3>
            <div style={{ padding: '16px', background: 'var(--bg-color)', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--accent)' }}>
              <div style={{ fontWeight: '600', marginBottom: '8px', color: 'var(--primary)' }}>
                {data.remarks[0].teacher} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'normal', marginLeft: '8px' }}>{data.remarks[0].date}</span>
              </div>
              <div style={{ fontStyle: 'italic', fontSize: '14px' }}>"{data.remarks[0].remark}"</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeView;
