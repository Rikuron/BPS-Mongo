import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import Homepage from './Homepage.jsx';
import Information from './Information.jsx';
import Login from './official/Login.jsx';
import Dashboard from './official/Dashboard.jsx';
import Residents from './official/Residents.jsx';
import AnnouncementsPage from './official/AnnouncementsPage.jsx';
import Cases from './official/Cases.jsx';
import EventsCalendar from './official/EventsCalendar.jsx';
import Users from './official/Users.jsx';
import { createRoot } from 'react-dom/client';
import './index.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes> 
        <Route path="/" element={<Homepage />} />
        <Route path="/information" element={<Information />} />
        <Route path="/official" element={<Login />} />
        <Route 
          path="/official/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/official/residents" 
          element={
            <ProtectedRoute>
              <Residents />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/official/announcements" 
          element={
            <ProtectedRoute>
              <AnnouncementsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/official/cases" 
          element={
            <ProtectedRoute>
              <Cases />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/official/events" 
          element={
            <ProtectedRoute>
              <EventsCalendar />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/official/users" 
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
