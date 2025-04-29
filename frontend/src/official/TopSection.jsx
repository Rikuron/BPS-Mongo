import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';

const TopSection = () => {
  const location = useLocation();
  const navigate = useNavigate(); 

  let title;
  switch (location.pathname) {
    case '/official/dashboard':
      title = 'Barangay Dulag Dashboard';
      break;
    case '/official/residents':
      title = 'Residents Information';
      break;
    case '/official/announcements':
      title = 'Manage Announcements';
      break;
    case '/official/cases':
      title = 'Manage Cases';
      break;
    case '/official/events':
      title = 'Events Calendar';
      break;
    case '/official/users':
      title = 'Manage Users';
      break;
    default:
      title = 'Barangay Dulag System';
  }

  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/official');
      return;
    }

    // Fetch user details
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      console.log('No username found in localStorage');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Clear authentication tokens and user details
      localStorage.removeItem('token');
      localStorage.removeItem('staffId');
      localStorage.removeItem('username');
      localStorage.removeItem('isAdmin');

      // Clear any default headers
      delete axios.defaults.headers.common['Authorization'];

      // Redirect to login page
      navigate('/official');
    } catch (error) {
      console.error('Error logging out:', error);
      localStorage.clear();
      navigate('/official');
    }
  };

  return (
    <div className="top-section flex items-center justify-between">
      <p className="title-p font-patuaOneReg text-3xl text-customDarkBlue2">{title}</p>
      <div className="right-group flex items-center space-x-6">
        <div className="username-group flex items-center">
          <FaUser className="w-8 h-8 text-customDarkBlue2" />
            <p className="font-patuaOneReg text-2xl ml-4"> {username} </p>
        </div>

        <button 
          className="logout-button w-[55%] px-5 h-10 rounded-lg border-red-500 border-2 text-red-500 hover:cursor-pointer hover:bg-red-500 hover:text-white transition duration-300 ease-in-out" 
          onClick={handleLogout} 
        >
          Log out 
        </button>
      </div>
    </div>
  )
}

export default TopSection;
