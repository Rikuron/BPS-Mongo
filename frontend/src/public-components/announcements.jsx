import React, { useEffect, useState } from 'react';
import placeholder from '../assets/images/placeholder.png';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return placeholder;
    const baseUrl = API_ENDPOINTS.BASE_URL.replace('/api', '');
    const normalizedPath = imagePath.replace(/\\/g, '/');
    return `${baseUrl}/${normalizedPath}`;
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.ANNOUNCEMENTS);
        const announcementsData = response.data.data || []; 

        const sortedAnnouncements = announcementsData.sort((a, b) => {
          const dateA = a.updatedAt || a.dateTimePosted;
          const dateB = b.updatedAt || b.dateTimePosted;

          return new Date(dateB) - new Date(dateA);
        });

        setAnnouncements(sortedAnnouncements.slice(0, 3)); // Get the latest 3 announcements
      } catch (error) {
        console.error('Error fetching announcements:', error.response || error);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="flex w-full h-[30rem]" style={{ background: 'var(--color-customGradient2)' }}>
        <div className="m-auto">
          <p className="text-white font-patuaOneReg text-2xl">Loading announcements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full h-[30rem]" style={{ background: 'var(--color-customGradient2)' }}>
      <div className="card-group flex mx-auto my-auto space-x-14">
        {announcements.length === 0 ? (
          <div className="text-center">
            <p className="text-white font-patuaOneReg text-2xl">No announcements found</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.announcementId} className="card w-72 h-[22rem] bg-white rounded-3xl shadow-xl transition-transform duration-300 ease-in-out hover:scale-105">
              <div className="announcement-img w-[85%] mx-auto pt-7">
                <img 
                  src={getImageUrl(announcement.image)} 
                  alt={announcement.title} 
                  onError={(e) => { e.target.onerror = null; e.target.src = placeholder; }} 
                  className="w-full h-32 object-cover"
                />
              </div>
              <div className="announcement-headline w-[85%] mx-auto mt-3">
                <p className="font-patuaOneReg text-customDarkBlue2 text-[1.3rem]">{announcement.title}</p>
              </div>
              <div className="anouncement-description w-[85%] mx-auto mt-1.5">
                <p className="font-patuaOneReg text-[0.8rem] text-justify">{announcement.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;
