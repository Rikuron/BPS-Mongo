import React, { useState , useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import TopSection from './TopSection';
import { FaHouseUser , FaUserPlus, FaUserEdit , FaBriefcaseMedical } from "react-icons/fa";
import { BiSolidMegaphone } from "react-icons/bi";
import { IoBriefcase } from "react-icons/io5";
import { MdEvent , MdEventRepeat , MdAnnouncement , MdOutlineAnnouncement } from "react-icons/md";
import { Link } from 'react-router-dom';
import { ResponsiveContainer , BarChart , CartesianGrid , XAxis , YAxis , Tooltip , Legend , Bar } from 'recharts';
import { API_ENDPOINTS } from '../config/api';
import meeting from '../assets/images/meeting.png'
import case_icon from '../assets/images/auction.png'
import community from '../assets/images/people.png'

const Dashboard = () => {
  const [residents, setResidents] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const headers = {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        };

        // Fetch residents with authorization
        try {
          const residentsResponse = await axios.get(API_ENDPOINTS.RESIDENTS, { headers }); 
          const residentsData = Array.isArray(residentsResponse.data.data) ? residentsResponse.data.data : [];
          setResidents(residentsData);
        } catch (error) {
          console.error('Error fetching residents', error);
          setResidents([]);
        }

        // Fetch recent activities with authorization
        try {
          const activitiesResponse = await axios.get(API_ENDPOINTS.RECENT_ACTIVITIES, { headers });
          console.log('Activities response: ', activitiesResponse.data);
          const activitiesData = Array.isArray(activitiesResponse.data.data) ? activitiesResponse.data.data : [];
          const sortedActivities = [...activitiesData]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0 ,3);
          setRecentActivities(sortedActivities);
        } catch (error) {
          console.error('Error fetching recent activities', error);
          setRecentActivities([]);
        }

        // Fetch upcoming events with authorization
        try {
          const eventsResponse = await axios.get(API_ENDPOINTS.EVENTS, { headers });
          const allEvents = Array.isArray(eventsResponse.data.data) ? eventsResponse.data.data : [];

          const now = new Date();
          const upcoming = [...allEvents]
            .filter(event => {
              const eventDate = new Date(event.date);
              return eventDate > now;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);

          setUpcomingEvents(upcoming);
        } catch (error) {
          console.error('Error fetching upcoming events', error);
          setUpcomingEvents([]);
        }

      } catch (error) {
        console.error('Error fetching residents:', error);
        if (error.response?.status === 401) {
          alert('You are not authorized to fetch residents');
        } else {
          alert('Failed to fetch residents');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setLoading]);

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    setIsAdmin(adminStatus === 'true');
  }, []);

  // Occupation Data
  const occupationData = Object.entries(
    residents.reduce((acc, resident) => {
      acc[resident.occupation] = (acc[resident.occupation] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Recent Activties section
  const getTimeDifference = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      'resident_create': <FaUserPlus className="text-customDarkBlue2 text-4xl" />,
      'resident_update': <FaUserEdit className="text-customDarkBlue2 text-4xl" />,
      'announcement_create': <MdAnnouncement className="text-customDarkBlue2 text-4xl" />,
      'announcement_update': <MdOutlineAnnouncement className="text-customDarkBlue2 text-4xl" />,
      'case_create': <IoBriefcase className="text-customDarkBlue2 text-4xl" />,
      'case_update': <FaBriefcaseMedical className="text-customDarkBlue2 text-4xl" />,
      'event_create': <MdEvent className="text-customDarkBlue2 text-4xl" />,
      'event_update': <MdEventRepeat className="text-customDarkBlue2 text-4xl" />
    };
    return iconMap[type] || 'Activity occurred';
  };

  const getActivityDescription = (activity) => {
    const descriptionMap = {
      'resident_create': `${activity.residentName} was added to the database`,
      'resident_update': `${activity.residentName} was updated in the database`,
      'announcement_create': `${activity.announcementTitle} was added to the database`,
      'announcement_update': `${activity.announcementTitle} was updated in the database`,
      'case_create': `${activity.caseName} was added to the database`,
      'case_update': `${activity.caseName} was updated in the database`,
      'event_create': `${activity.eventTitle} was added to the database`,
      'event_update': `${activity.eventTitle} was updated in the database`
    };
    return descriptionMap[activity.type] || 'Activity occurred';
  }

  if (loading) {
    return (
      <div className="flex bg-darkerWhite">
        <NavBar />
        <div className="dashboard w-[75%] pl-10 pt-4 pr-5 ml-[25%]">
          <TopSection />
          <div className="mt-8 text-center">
            <p className="font-lexendReg text-xl">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }
    
  return (
    <div className="flex bg-darkerWhite">
      <NavBar />

      <div className="dashboard w-[75%] pl-10 pt-4 pr-5 ml-[25%]">

        <TopSection />

        <div className="columns-container flex mt-8 space-x-4">

          <div className="first-column w-[67%]">
            <div className="recent-activities-card w-full h-auto bg-white rounded-xl shadow-md">
              <div className="pl-5 py-3 rounded-t-xl bg-customDarkBlue3">
                <p className="font-lexendReg text-xl text-white"> Recent Activities </p>
              </div>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <div className="recent-activity-item flex pl-5 py-3 items-center justify-between">
                    <div className="flex">
                      {getActivityIcon(activity.type)}
                      <div className="ml-3 -space-y-0.5">
                        <p className="font-lexendReg"> {activity.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} </p>
                        <p className="font-lexendReg text-gray-400 text-sm"> 
                          {getActivityDescription(activity)}   
                        </p>
                      </div>
                    </div>
                    <p className="font-lexendReg text-gray-400 text-sm pr-4"> 
                      {getTimeDifference(activity.createdAt)}
                    </p>
                  </div>
                  {index < recentActivities.length - 1 && (
                    <div className="w-[95%] h-[0.5px] bg-gray-300 mx-auto" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="job-distributions-chart w-full h-96 bg-white rounded-xl shadow-md my-4">
              <p className="font-patuaOneReg text-2xl text-center text-customDarkBlue2 pt-4">Occupation Distribution</p>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={occupationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="second-column w-[33%]">
            <div className="quick-links-card w-full h-auto bg-white rounded-xl shadow-md">
              <div className="pl-5 py-3 rounded-t-xl bg-customBlue1/90">
                <p className="font-lexendReg text-xl"> Quick Links </p>
              </div>

              <div>
                <Link to="/official/residents" className="flex items-center pl-5 py-3">
                  <FaHouseUser className="text-customDarkBlue2 text-4xl hover:text-customDarkBlue1 transition duration-300 ease-in-out" />
                  <p className="font-lexendReg text-md ml-3 hover:text-customDarkBlue1 transition duration-300 ease-in-out">Register New Resident</p>
                </Link>  
              </div>
              
              <div className="w-[95%] h-[0.5px] bg-gray-300 mx-auto" />

              <div>
                <Link to="/official/announcements" className="flex items-center pl-5 py-3">
                  <BiSolidMegaphone className="text-customDarkBlue2 text-4xl hover:text-customDarkBlue1 transition duration-300 ease-in-out" />
                  <p className="font-lexendReg text-md ml-3 hover:text-customDarkBlue1 transition duration-300 ease-in-out">Post New Announcement</p>
                </Link>
                </div>

              <div className="w-[95%] h-[0.5px] bg-gray-300 mx-auto" />

              <div>
                <Link to="/official/cases" className="flex items-center pl-5 py-3">
                  <IoBriefcase className="text-customDarkBlue2 text-4xl hover:text-customDarkBlue1 transition duration-300 ease-in-out" />
                  <p className="font-lexendReg text-md ml-3 hover:text-customDarkBlue1 transition duration-300 ease-in-out">Add New Case</p>
                </Link>
              </div>
              
              <div className="w-[95%] h-[0.5px] bg-gray-300 mx-auto" />

              <div>
                <Link to="/official/events" className="flex items-center pl-5 py-3">
                  <MdEvent className="text-customDarkBlue2 text-4xl hover:text-customDarkBlue1 transition duration-300 ease-in-out" />
                  <p className="font-lexendReg text-md ml-3 hover:text-customDarkBlue1 transition duration-300 ease-in-out">Add New Event</p>
                </Link>
              </div>
              
              <div className="w-[95%] h-[0.5px] bg-gray-300 mx-auto" />

              {isAdmin && (
                <>
                  <div>
                    <Link to="/official/users" className="flex items-center pl-5 py-3">
                      <FaUserPlus className="text-customDarkBlue2 text-4xl hover:text-customDarkBlue1 transition duration-300 ease-in-out" />
                      <p className="font-lexendReg text-md ml-3 hover:text-customDarkBlue1 transition duration-300 ease-in-out">Register New User</p>
                    </Link>
                  </div>
                </>
              )}
            </div>

            <div className="upcoming-events-card w-full h-auto bg-white rounded-xl shadow-md my-4">
              <div className="pl-5 py-3 rounded-t-xl bg-yellow-200">
                <p className="font-lexendReg text-xl">Upcoming Events</p>
              </div>

              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <React.Fragment key={event.eventId}>
                    <div className="flex items-center pl-5 py-3">
                      <img 
                        src={
                          event.category === 'Meeting' ? meeting :
                          event.category === 'Case Proceeding' ? case_icon :
                          event.category === 'Community Event' ? community :
                          meeting
                        } 
                        alt={`${event.category} icon`} 
                        className="w-9 h-auto" 
                      />
                      <div className="ml-4">
                        <p className="font-lexendReg text-md">{event.eventTitle}</p>
                        <p className="font-lexendReg text-gray-400 text-sm">
                          {event.date.split('T')[0]}
                        </p>
                        <p className="font-lexendReg text-gray-400 text-xs">
                          {event.time} | {event.location}
                        </p>
                      </div>
                    </div>
                    {index < upcomingEvents.length - 1 && (
                      <div className="w-[95%] h-[0.5px] bg-gray-300 mx-auto" />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <div className="pl-5 py-3 text-gray-500">
                  No upcoming events
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard;
