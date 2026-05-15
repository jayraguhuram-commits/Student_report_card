import React from 'react';

const Navbar = ({ searchQuery, setSearchQuery, searchResults, onResultClick, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>G</span>
        Academic
      </div>
      
      <div className="search-container">
        <span className="search-icon-nav">🔍</span>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search students..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
        />
        {searchResults.length > 0 && (
          <div className="search-results fade-in">
            {searchResults.map(s => (
              <div 
                key={s.student_id} 
                className="search-result-item" 
                onClick={() => onResultClick(s.student_id)}
              >
                <div>
                  <strong>{s.full_name}</strong> 
                  <span style={{fontSize:'12px', color:'var(--text-muted)', marginLeft: '8px'}}>
                    {s.student_id}
                  </span>
                </div>
                <div className={`status-pill ${s.percentage >= 40 ? 'pass' : 'fail'}`}>
                  {s.percentage}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={onLogout} className="btn-logout">Logout</button>
    </nav>
  );
};

export default Navbar;
