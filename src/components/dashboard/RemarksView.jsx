import React, { useState, useEffect } from 'react';

const RemarksView = ({ data }) => {
  const [activeTab, setActiveTab] = useState('remarks');
  const [teacher, setTeacher] = useState('');
  const [queryText, setQueryText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [localQueries, setLocalQueries] = useState([]);

  useEffect(() => {
    if (data && data.queries) {
      setLocalQueries(data.queries);
    }
  }, [data]);

  const teachers = ["Mr. Sharma (Math)", "Mrs. Gupta (English)", "Mr. Patel (Physics)", "Ms. Rao (Chemistry)", "Mr. Singh (Computer Science)"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: data.student_id,
          teacher: teacher,
          query_text: queryText
        }),
      });

      if (response.ok) {
        setSubmitMessage('Your query has been sent successfully.');
        
        // Add to local state to show immediately
        const newQuery = {
          teacher: teacher,
          query_text: queryText,
          date: new Date().toISOString().split('T')[0],
          status: 'Pending'
        };
        setLocalQueries([newQuery, ...localQueries]);

        setTeacher('');
        setQueryText('');
      } else {
        setSubmitMessage('Failed to send query. Please try again.');
      }
    } catch (err) {
      setSubmitMessage('Error connecting to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content-area fade-in">
      <div className="section-title">
        💬 Communication Center
      </div>

      <div className="tabs-header">
        <button 
          className={`tab-btn ${activeTab === 'remarks' ? 'active' : ''}`}
          onClick={() => setActiveTab('remarks')}
        >
          Teacher Remarks
        </button>
        <button 
          className={`tab-btn ${activeTab === 'queries' ? 'active' : ''}`}
          onClick={() => setActiveTab('queries')}
        >
          Your Queries
        </button>
      </div>

      {activeTab === 'remarks' && (
        <div className="remarks-grid fade-in">
          {data.remarks && data.remarks.length > 0 ? (
            data.remarks.map((remark, idx) => {
              const cardClass = remark.type === 'Positive' ? 'positive' : remark.type === 'Needs Improvement' ? 'needs-improvement' : 'general';
              return (
                <div className={`remark-card ${cardClass}`} key={idx}>
                  <div className="remark-header">
                    <div>
                      <div className="remark-teacher">{remark.teacher}</div>
                      <div className="remark-date">{remark.date}</div>
                    </div>
                    <span className={`badge ${remark.type === 'Positive' ? 'completed' : remark.type === 'Needs Improvement' ? 'missed' : 'pending'}`}>
                      {remark.type}
                    </span>
                  </div>
                  <div className="remark-text">"{remark.remark}"</div>
                </div>
              );
            })
          ) : (
            <div style={{ color: 'var(--text-muted)', padding: '20px' }}>
              No teacher remarks found for this student.
            </div>
          )}
        </div>
      )}

      {activeTab === 'queries' && (
        <div className="fade-in">
          <div className="query-form-card">
            <h3 style={{ fontSize: '16px', color: 'var(--primary)', marginBottom: '16px' }}>Ask a Query</h3>
            <form onSubmit={handleSubmit} className="query-form">
              <div className="query-input-group">
                <label>Select Teacher</label>
                <select value={teacher} onChange={(e) => setTeacher(e.target.value)} required>
                  <option value="" disabled>-- Choose a Teacher --</option>
                  {teachers.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="query-input-group">
                <label>Your Query</label>
                <textarea 
                  value={queryText} 
                  onChange={(e) => setQueryText(e.target.value)} 
                  placeholder="Type your question or concern here..."
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ alignSelf: 'flex-start' }}>
                {isSubmitting ? 'Sending...' : 'Send Query'}
              </button>
              {submitMessage && (
                <div style={{ marginTop: '12px', fontSize: '14px', color: submitMessage.includes('successfully') ? 'var(--success)' : 'var(--danger)' }}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>

          <h3 style={{ fontSize: '16px', color: 'var(--primary)', marginBottom: '16px' }}>Query History</h3>
          <div className="remarks-grid">
            {localQueries && localQueries.length > 0 ? (
              localQueries.map((q, idx) => (
                <div className="remark-card" style={{ borderLeftColor: 'var(--accent)' }} key={idx}>
                  <div className="remark-header">
                    <div>
                      <div className="remark-teacher">To: {q.teacher}</div>
                      <div className="remark-date">{q.date}</div>
                    </div>
                    <span className={`badge ${q.status === 'Answered' ? 'completed' : 'pending'}`}>
                      {q.status}
                    </span>
                  </div>
                  <div className="remark-text">"{q.query_text}"</div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>You haven't asked any queries yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RemarksView;
