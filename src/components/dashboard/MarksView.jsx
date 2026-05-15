import React from 'react';

const MarksView = ({ data }) => {
  return (
    <div className="content-area fade-in">
      <div className="section-title">
        📊 Detailed Paper Evaluation
      </div>
      
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        Review your child's performance broken down by paper evaluation criteria: Handwriting, Writing Content, and Presentation.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {data.marks.map((m, idx) => {
          const hwPct = (m.handwriting / 10) * 100;
          const contentPct = (m.content / 80) * 100;
          const presPct = (m.presentation / 10) * 100;
          
          return (
            <div key={idx} className="results-table-card fade-in" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--primary)', fontWeight: '600' }}>{m.subject}</h3>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent)' }}>{m.marks}</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/{m.max_marks}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="eval-metric">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
                    <span>✍️ Handwriting</span>
                    <span>{m.handwriting} / 10</span>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${hwPct}%`, background: 'var(--primary-light)', borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
                  </div>
                </div>

                <div className="eval-metric">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
                    <span>📖 Writing Content</span>
                    <span>{m.content} / 80</span>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${contentPct}%`, background: 'var(--primary)', borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
                  </div>
                </div>

                <div className="eval-metric">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
                    <span>🎨 Presentation</span>
                    <span>{m.presentation} / 10</span>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${presPct}%`, background: 'var(--accent)', borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarksView;
