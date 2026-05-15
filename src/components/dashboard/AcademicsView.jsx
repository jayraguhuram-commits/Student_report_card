import React, { useState } from 'react';

const CircularProgress = ({ percentage, size = 48, strokeWidth = 4 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="#e2e8f0" strokeWidth={strokeWidth} fill="none"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="var(--success)" strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease', strokeLinecap: 'round' }}
        />
      </svg>
      <span style={{ position: 'absolute', fontSize: size * 0.28, fontWeight: '700', color: 'var(--primary)' }}>
        {percentage}%
      </span>
    </div>
  );
};

const AcademicsView = ({ data }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Group syllabus by subject
  const syllabusBySubject = {};
  if (data.syllabus) {
    data.syllabus.forEach(item => {
      if (!syllabusBySubject[item.subject]) {
        syllabusBySubject[item.subject] = [];
      }
      syllabusBySubject[item.subject].push(item);
    });
  }

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
  };

  const closeDrawer = () => {
    setSelectedSubject(null);
  };

  // Calculate overall subject completion for the header
  const getSubjectOverallCompletion = (subject) => {
    const lessons = syllabusBySubject[subject] || [];
    if (lessons.length === 0) return 0;
    const total = lessons.reduce((acc, curr) => acc + curr.student_completion_pct, 0);
    return Math.round(total / lessons.length);
  };

  return (
    <div className="content-area fade-in">
      <div className="section-title">
        📚 Academics Overview
      </div>

        <div className="marks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {data.marks.map((m, idx) => {
            const lessonCount = syllabusBySubject[m.subject]?.length || 0;
            const overallCompletion = getSubjectOverallCompletion(m.subject);
            return (
              <div 
                key={idx} 
                className="results-table-card fade-in" 
                style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onClick={() => handleSubjectClick(m.subject)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                      📚
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--primary)', margin: 0 }}>{m.subject}</h3>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{lessonCount} Topics</span>
                    </div>
                  </div>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '16px' }}>
                    →
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Syllabus Completion</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent)' }}>{overallCompletion}%</span>
                </div>
                
                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${overallCompletion}%`, background: 'var(--accent)', borderRadius: '3px' }}></div>
                </div>
              </div>
            );
          })}
        </div>

      {/* Drawer */}
      {selectedSubject && (
        <>
          <div className="drawer-overlay" onClick={closeDrawer}></div>
          <div className="drawer-container">
            <div className="drawer-header">
              <div className="drawer-title-group">
                <div className="drawer-icon">📖</div>
                <div>
                  <div className="drawer-title">{selectedSubject}</div>
                  <div className="drawer-subtitle">Topics: {syllabusBySubject[selectedSubject]?.length || 0}</div>
                </div>
              </div>
              <CircularProgress percentage={getSubjectOverallCompletion(selectedSubject)} size={56} strokeWidth={5} />
              <button className="drawer-close" onClick={closeDrawer}>✕</button>
            </div>
            
            <div className="drawer-content">
              {syllabusBySubject[selectedSubject] && syllabusBySubject[selectedSubject].length > 0 ? (
                syllabusBySubject[selectedSubject].map((lesson, l_idx) => (
                  <div className="topic-card" key={l_idx}>
                    <div className="topic-left">
                      <div className="topic-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                      </div>
                      <div className="topic-title">{lesson.lesson}</div>
                    </div>
                    <div className="topic-right">
                      <CircularProgress percentage={lesson.student_completion_pct} size={44} />
                      <span className="topic-chevron">⌄</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                  No syllabus topics available for this subject.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AcademicsView;
