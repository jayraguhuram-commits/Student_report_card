import React from 'react';
import MarksTable from './MarksTable';

const ResultsView = ({ data }) => {
  return (
    <div className="content-area fade-in">
      <div className="section-title" style={{ marginBottom: '20px', fontSize: '20px' }}>
        📋 Academic Results — {data.full_name}
      </div>

      {/* Summary Cards */}
      <div className="results-header">
        <div className="results-summary-card">
          <div className="results-summary-icon">📊</div>
          <div className="results-summary-value" style={{ color: 'var(--primary)' }}>
            {data.percentage}%
          </div>
          <div className="results-summary-label">Overall Percentage</div>
        </div>

        <div className="results-summary-card">
          <div className="results-summary-icon">📝</div>
          <div className="results-summary-value">
            {data.total_marks}<span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>/{data.total_max}</span>
          </div>
          <div className="results-summary-label">Total Marks</div>
        </div>

        <div className="results-summary-card">
          <div className="results-summary-icon">📅</div>
          <div className="results-summary-value" style={{ color: data.attendance >= 75 ? 'var(--success)' : 'var(--danger)' }}>
            {data.attendance}%
          </div>
          <div className="results-summary-label">Attendance</div>
        </div>

        <div className="results-summary-card">
          <div className="results-summary-icon">{data.overall_status === 'Pass' ? '✅' : '❌'}</div>
          <div className="results-summary-value" style={{
            color: data.overall_status === 'Pass' ? 'var(--success)' : 'var(--danger)'
          }}>
            {data.overall_status}
          </div>
          <div className="results-summary-label">Final Status</div>
        </div>
      </div>

      {/* Marks Table */}
      <div className="results-table-card">
        <h2>Subject-wise Performance</h2>
        <MarksTable marks={data.marks} />
      </div>
    </div>
  );
};

export default ResultsView;
