import React from 'react';

const MarksTable = ({ marks }) => {
  return (
    <div className="marks-column google-card">
      <h2>Subject Performance</h2>
      <div className="table-responsive">
        <table className="marks-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks Obtained</th>
              <th>Max Marks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {marks.map((s, index) => {
              const width = (s.marks / s.max_marks) * 100;
              const bg = s.marks >= 40 ? 'var(--success)' : 'var(--danger)';
              return (
                <tr key={index} className="fade-in" style={{animationDelay: `${index * 0.05}s`}}>
                  <td>{s.subject}</td>
                  <td>
                    <strong>{s.marks}</strong>
                    <div className="progress-bar-bg">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${width}%`, backgroundColor: bg }}
                      ></div>
                    </div>
                  </td>
                  <td>{s.max_marks}</td>
                  <td>
                    <span className={`status-pill ${s.status.toLowerCase()}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarksTable;
