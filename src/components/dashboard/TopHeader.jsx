import React from 'react';

const TopHeader = ({ data }) => {
  return (
    <header className="top-header">
      <div className="header-title">Student Monitoring System</div>

      <div className="header-profile">
        <div className="header-avatar">
          P
        </div>
        <div className="header-profile-info">
          <div className="header-profile-name">Parent Account</div>
          <div className="header-profile-id">Monitoring: {data?.full_name || 'Student'}</div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
