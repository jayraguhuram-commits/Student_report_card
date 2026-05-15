import React from 'react';

const ActivityView = ({ data }) => {
  return (
    <div className="content-area fade-in">
      <div className="section-title">
        📅 Class Activity Timeline
      </div>

      <div className="timeline-card">
        {data.activities && data.activities.length > 0 ? (
          data.activities.map((act, idx) => (
            <div className="timeline-item" key={idx}>
              <div className="timeline-icon">
                {act.type === 'Assignment' ? '📝' : act.type === 'Presentation' ? '🎤' : act.type === 'Lab Work' ? '🔬' : '📌'}
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <div>
                    <div className="timeline-title">{act.title}</div>
                    <div className="timeline-type">{act.type}</div>
                  </div>
                  <span className={`badge ${act.status.toLowerCase()}`}>{act.status}</span>
                </div>
                <div className="timeline-date">Due / Completed: {act.date}</div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
            No recent class activities recorded.
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityView;
