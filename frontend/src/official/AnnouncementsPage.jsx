import React, { useState, useEffect, useRef } from 'react';
import NavBar from './NavBar';
import TopSection from './TopSection';
import { FaPlus , FaEdit } from "react-icons/fa";
import { RiSearchEyeLine , RiDeleteBin5Fill } from "react-icons/ri";
import axios from 'axios'; 
import { API_ENDPOINTS } from '../config/api';

const AnnouncementsPage = () => {
  const [announcementId, setAnnouncementId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditAnnouncement, setCurrentEditAnnouncement] = useState(null);
  const cardRef = useRef(null);

  const handleAddAnnouncementClick = () => {
    setIsEditMode(false);
    setAnnouncementId('');
    setTitle('');
    setDescription('');
    setImage(null);
    setShowCard(true);
  };

  const handleEditClick = (announcement) => {
    setIsEditMode(true);
    setCurrentEditAnnouncement(announcement);
    setAnnouncementId(announcement.announcementId);
    setTitle(announcement.title);
    setDescription(announcement.description);
    setImage(announcement.image);
    setShowCard(true);
  }

  const handleDeleteClick = async (announcementId) => {
    try {
      await axios.delete(`${API_ENDPOINTS.ANNOUNCEMENTS}/${announcementId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Announcement deleted successfully');
      fetchAnnouncements(); // Fetch announcements after deletion
    } catch (error) {
      console.error('Error deleting announcement:', error);
      if (error.response?.status === 401) {
        alert('You are not authorized to delete this announcement');
      } else {
        alert('Failed to delete announcement');
      }
    }
  }

  const handleCloseCard = () => {
    setShowCard(false);
    setIsEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('announcementId', announcementId);
    formData.append('title', title);
    formData.append('description', description);

    if (image) {
      formData.append('image', image);
    }

    try {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      };

      if (isEditMode) {
        await axios.put(
          `${API_ENDPOINTS.ANNOUNCEMENTS}/${announcementId}`, 
          formData, 
          { headers }
        );
        alert('Announcement updated successfully');
      } else {
        const dateTimePosted = new Date().toISOString();
        formData.append('dateTimePosted', dateTimePosted);
        formData.append('staffId', localStorage.getItem('staffId'));

        await axios.post(
          `${API_ENDPOINTS.ANNOUNCEMENTS}`, 
          formData,
          { headers }
        );
        alert('Announcement posted successfully');
      }

      setAnnouncementId('');
      setTitle('');
      setDescription('');
      setImage(null);
      setShowCard(false);

      fetchAnnouncements(); // Fetch announcements after posting
    } catch (error) {
      console.error('Error posting announcement:', error);
      if (error.response?.status === 401) {
        alert('You are not authorized to post an announcement');
      } else {
        alert('Failed to post announcement');
      }
    }
  };

  const onSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value) {
      setFilteredAnnouncements(announcements);
    }
  }

  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredAnnouncements(announcements);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase().trim();

    const filtered = announcements.filter(announcement => {

      if (announcement.announcementId.toLowerCase().includes(searchTermLower)) {
        return true;
      }

      if (announcement.title.toLowerCase().includes(searchTermLower)) {
        return true;
      }

      const postDate = new Date(announcement.dateTimePosted);
      const formattedDate = postDate.toISOString().split('T')[0];
      const formattedTime = postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (
        formattedDate.includes(searchTermLower) ||
        formattedTime.includes(searchTermLower)
      ) {
        return true;
      }

      if (announcement.updatedAt) {
        const updatedDate = new Date(announcement.updatedAt);
        const formattedUpdatedDate = updatedDate.toISOString().split('T')[0];
        const formattedUpdatedTime = updatedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (
          formattedUpdatedDate.includes(searchTermLower) ||
          formattedUpdatedTime.includes(searchTermLower)
        ) {
          return true;
        }
      }

      return false;
    });

    setFilteredAnnouncements(filtered);
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.ANNOUNCEMENTS}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }); // Fetch announcements

      const announcementsData = response.data.data || [];
      const sortedAnnouncements = announcementsData.sort((a, b) => {
        const dateA = a.updatedAt || a.dateTimePosted;
        const dateB = b.updatedAt || b.dateTimePosted;

        return new Date(dateB) - new Date(dateA)
      });

      setAnnouncements(sortedAnnouncements);
      setFilteredAnnouncements(sortedAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error.response || error);
      setAnnouncements([]);
      setFilteredAnnouncements([]);
    }
  };

  useEffect(() => {
    fetchAnnouncements(); // Fetch announcements on component mount
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        handleCloseCard();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  


  return (
    <div className="flex bg-darkerWhite">
      {showCard && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          {/* Card */}
          <div ref={cardRef} className="bg-[#F6F6F6] w-[45%] m-auto h-auto p-6 pt-10 rounded-lg shadow-[6px_6px_0px_0_rgba(170,199,255,1)]">
            <p className="font-lexendBold text-customDarkBlue2 text-center text-2xl"> 
              {isEditMode ? 'Edit Announcement' : 'Posting New Announcement'} 
            </p>
            <form className="w-full mt-10" onSubmit={handleSubmit}>
              <div className="first-row flex items-center w-full space-x-2">
                <div className="announcement-id w-5/12">
                  <p className="font-lexendReg text-lg"> Announcement ID </p>
                  <input 
                    type="text" 
                    value={announcementId}
                    onChange={(e) => setAnnouncementId(e.target.value)}
                    className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                    required 
                    disabled={isEditMode}
                  />
                </div>
                <div className="title-group w-7/12">
                  <p className="font-lexendReg text-lg"> Title </p>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                    required 
                  />
                </div>
              </div>
              <div className="second-row flex items-center w-full mt-3 space-x-2">
                <div className="description-group w-7/12">
                  <p className="font-lexendReg text-lg"> Description </p>
                  <textarea 
                    rows="7" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-[100%] px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                    required 
                  />
                </div>              
                <div className="image-group w-5/12">
                  <p className="font-lexendReg text-lg"> Image </p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full mt-2 h-[11.7rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                  />
                  {isEditMode && currentEditAnnouncement.image && (
                    <p className="text-sm text-gray-600 mt-2">
                      Current Image: {currentEditAnnouncement.image.split('/').pop()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-center mt-9">
                <button 
                  type="submit" 
                  className="w-[40%] h-auto bg-customBlue1 font-lexendReg text-white rounded-2xl p-2 transition transform hover:-translate-y-1.5 hover:bg-customBlue2 hover:cursor-pointer duration-300 ease-in-out"
                >
                  {isEditMode ? 'Update' : 'Post New'} <br /> Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <NavBar />

      <div className="announcements-page w-[75%] pl-10 pt-4 pr-5 ml-[25%]">
        <TopSection />

        <div className="search-and-add-card bg-white w-full h-auto mt-8 px-5 py-5 rounded-xl shadow-md">
          <div className="search-bar flex items-center space-x-3">
            <input 
              type="text" 
              placeholder="Search by ID, Title, Date Posted..." 
              value={searchTerm}
              onChange={onSearchInputChange}
              className="w-[85%] h-12 px-5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
            />
            <button 
              onClick={handleSearch}
              className="search-resident-button w-[6%] h-12 bg-customDarkBlue2 rounded-lg hover:cursor-pointer hover:bg-customDarkBlue1 transition duration-300 ease-in-out" 
            > 
              <RiSearchEyeLine className="mx-auto my-auto text-3xl text-white" /> 
            </button>
            <button 
              className="add-new-resident-button w-[6%] h-12 bg-customBlue2 rounded-lg hover:cursor-pointer hover:bg-customBlue1 transition duration-300 ease-in-out"
              onClick={handleAddAnnouncementClick}
            > 
              <FaPlus className="mx-auto my-auto text-3xl text-white" /> 
            </button>
          </div>
        </div>

        <div className="table-card bg-white w-full h-auto mt-5 px-4 pt-6 pb-4 rounded-xl shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full font-lexendReg text-sm border-collapse" >
              <thead className="text-white text-center">
                <tr >
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Date and Time Posted
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Date and Time UPDATED
                   </th> 
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-center text-customDarkBlue2">
                {filteredAnnouncements.map((announcement, index) => {
                  const rowClass = index % 2 === 0 ? 'bg-customBlue1/40' : 'bg-customBlue2/40';
                  return (
                    <tr key={announcement.announcementId} className={rowClass}>
                      <td className="px-6 py-4 border-2 border-white">{announcement.announcementId}</td>
                      <td className="px-6 py-4 border-2 border-white">{announcement.title}</td>
                      <td className="px-6 py-4 border-2 border-white">
                        {announcement.description.length > 40 
                          ? `${announcement.description.substring(0, 40)}...` 
                          : announcement.description}
                      </td>
                      <td className="px-6 py-4 border-2 border-white">
                        {new Date(announcement.dateTimePosted).toISOString().split('T')[0]} | {new Date(announcement.dateTimePosted).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 border-2 border-white">
                        {announcement.updatedAt ? (
                          <>
                            {new Date(announcement.updatedAt).toISOString().split('T')[0]} | {new Date(announcement.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {announcement.updateCount && (
                              <span className="block text-xs text-gray-500">
                                (Updated {announcement.updateCount} time{parseInt(announcement.updateCount) > 1 ? 's' : ''})
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400">Never</span>
                        )}
                      </td>  
                      <td className="px-6 py-4 border-2 border-white">
                        <div className="control-buttons-container flex items-center justify-center space-x-2">
                          <button onClick={() => handleEditClick(announcement)}>
                            <FaEdit className="text-customDarkBlue1 text-3xl hover:text-blue-500 hover:cursor-pointer transition duration-300 ease-in-out" />
                          </button>
                          <button onClick={() => handleDeleteClick(announcement.announcementId)}>
                            <RiDeleteBin5Fill className="text-red-500 text-3xl hover:text-red-400 hover:cursor-pointer transition duration-300 ease-in-out" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredAnnouncements.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No Announcements found matching your search... 
              </div>
            )}
          </div>
        </div>
      </div>        
    </div>
  )
}

export default AnnouncementsPage;
