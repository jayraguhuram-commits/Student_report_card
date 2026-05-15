import React from 'react';

const ProfileHeader = ({ data }) => {
  return (
    <div className="profile-header google-card">
      <div 
        className="avatar" 
        style={{backgroundColor: data.avatar_color || 'var(--primary)'}}
      >
        {data.full_name.charAt(0)}
      </div>
      <div className="profile-info">
        <h1>{data.full_name}</h1>
        <p>Student ID: {data.student_id} • Class: {data.class}-{data.section} • Roll No: {data.roll_no}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
