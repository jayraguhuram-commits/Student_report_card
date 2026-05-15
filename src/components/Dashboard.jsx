import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
import TopHeader from './dashboard/TopHeader';
import HomeView from './dashboard/HomeView';
import AcademicsView from './dashboard/AcademicsView';
import MarksView from './dashboard/MarksView';
import ActivityView from './dashboard/ActivityView';
import RemarksView from './dashboard/RemarksView';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('home');
  const navigate = useNavigate();

  const currentStudentId = localStorage.getItem('student_id');

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/student/${currentStudentId}`);
        const resultData = await response.json();
        if (!response.ok) throw new Error(resultData.error || 'Failed to fetch student data');
        setData(resultData);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('not found') || err.message.includes('unauthorized')) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };
    if (currentStudentId) fetchStudentData();
  }, [currentStudentId]);

  const handleLogout = () => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('student_id');
    localStorage.removeItem('student_name');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-screen fade-in">
        <div className="loading-spinner"></div>
        <h2>Loading Portal Data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-screen">
        <h2>Error fetching report</h2>
        <p style={{ color: 'var(--danger)' }}>{error}</p>
        <button className="btn-primary" onClick={handleLogout}>Return to Login</button>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />

      <div className="main-area">
        <TopHeader data={data} />

        {activeView === 'home' && <HomeView data={data} />}
        {activeView === 'academics' && <AcademicsView data={data} />}
        {activeView === 'marks' && <MarksView data={data} />}
        {activeView === 'activity' && <ActivityView data={data} />}
        {activeView === 'remarks' && <RemarksView data={data} />}
      </div>
    </div>
  );
};

export default Dashboard;
