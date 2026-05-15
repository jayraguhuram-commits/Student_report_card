import React from 'react';

const Sidebar = ({ activeView, setActiveView, onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">👑</div>
        <span>Parent Portal</span>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`sidebar-nav-item ${activeView === 'home' ? 'active' : ''}`}
          onClick={() => setActiveView('home')}
        >
          <div className="sidebar-nav-icon">🏠</div>
          <span>Home</span>
        </button>

        <button
          className={`sidebar-nav-item ${activeView === 'academics' ? 'active' : ''}`}
          onClick={() => setActiveView('academics')}
        >
          <div className="sidebar-nav-icon">📚</div>
          <span>Academics</span>
        </button>

        <button
          className={`sidebar-nav-item ${activeView === 'marks' ? 'active' : ''}`}
          onClick={() => setActiveView('marks')}
        >
          <div className="sidebar-nav-icon">📊</div>
          <span>Marks</span>
        </button>

        <button
          className={`sidebar-nav-item ${activeView === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveView('activity')}
        >
          <div className="sidebar-nav-icon">📅</div>
          <span>Activity</span>
        </button>

        <button
          className={`sidebar-nav-item ${activeView === 'remarks' ? 'active' : ''}`}
          onClick={() => setActiveView('remarks')}
        >
          <div className="sidebar-nav-icon">💬</div>
          <span>Remarks</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={onLogout}>
          <div className="sidebar-nav-icon">🚪</div>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
