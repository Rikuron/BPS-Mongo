import React, { useState, useEffect, useRef , navigate } from 'react';
import NavBar from './NavBar';
import TopSection from './TopSection';
import { FaPlus, FaEdit } from "react-icons/fa";
import { RiSearchEyeLine, RiDeleteBin5Fill } from "react-icons/ri";
import axios from 'axios'; 
import { API_ENDPOINTS } from '../config/api';

const Users = () => {
  const [staffId, setStaffId] = useState('');
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [showCard, setShowCard] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditStaff, setCurrentEditStaff] = useState(null);
  const cardRef = useRef(null);

  const handleAddUserClick = () => {
    setIsEditMode(false);
    resetForm();
    setShowCard(true);
  };

  const resetForm = () => {
    setStaffId('');
    setFullName('');
    setPosition('');
    setContactNumber('');
    setEmail('');
    setUsername('');
    setPassword('');
  };

  const handleEditClick = async (staffMember) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.STAFF}/${staffMember.staffId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const staff = response.data.data;

      setIsEditMode(true);
      setCurrentEditStaff(staff);
      setStaffId(staff.staffId);
      setFullName(staff.fullName);
      setPosition(staff.position);
      setContactNumber(staff.contactNumber);
      setEmail(staff.email);
      setUsername(staff.username);
      setPassword('');
      setShowCard(true);
    } catch (error) {
      console.error('Error fetching staff member:', error);
      if (error.response?.status === 401) {
        alert('You are not authorized to fetch staff members');
      } else {
        alert('Failed to fetch staff member');
      }
    }
  };

  const handleDeleteClick = async (staffId) => {
    try {
      await axios.delete(`${API_ENDPOINTS.STAFF}/${staffId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Staff member deleted successfully');
      fetchStaff(); // Refresh staff list
    } catch (error) {
      console.error('Error deleting staff member:', error);
      if (error.response?.status === 401) {
        alert('You are not authorized to delete staff members');
      } else {
        alert('Failed to delete staff member');
      }
    }
  };

  const handleCloseCard = () => {
    setShowCard(false);
    setIsEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const staffData = {
        staffId,
        fullName,
        position,
        contactNumber,
        email,
        username,
        ...(password && { password })
      };

      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };

      if (isEditMode) {
        await axios.put(`${API_ENDPOINTS.STAFF}/${staffId}`, staffData, { headers });
        alert('Staff member updated successfully');
      } else {
        await axios.post(API_ENDPOINTS.STAFF, staffData, { headers });
        alert('Staff member added successfully');
      }

      resetForm();
      setShowCard(false);
      fetchStaff(); // Refresh staff list
    } catch (error) {
      console.error('Error submitting staff member:', error);
      if (error.response?.status === 401) {
        alert('You are not authorized to submit staff members');
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to submit staff member');
      }
    }
  };

  const onSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value) {
      setFilteredStaff(staff);
    }
  };

  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredStaff(staff);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase().trim();

    const filtered = staff.filter(staffMember => {
      return (
        staffMember.staffId.toLowerCase().includes(searchTermLower) ||
        staffMember.fullName.toLowerCase().includes(searchTermLower) ||
        staffMember.position.toLowerCase().includes(searchTermLower) ||
        staffMember.contactNumber.toLowerCase().includes(searchTermLower) ||
        staffMember.email.toLowerCase().includes(searchTermLower) ||
        staffMember.username.toLowerCase().includes(searchTermLower)
      );
    });

    setFilteredStaff(filtered);
  };

  const fetchStaff = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.STAFF, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStaff(response.data.data);
      setFilteredStaff(response.data.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
      if (error.response?.status === 401) {
        alert('You are not authorized to fetch staff members');
      } else {
        alert('Failed to fetch staff members');
      }
    }
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      alert('You are not authorized to access this page');
      navigate('/official/dashboard');
    }

    fetchStaff(); // Fetch staff on component mount

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
          <div ref={cardRef} className="bg-[#F6F6F6] w-[50%] m-auto h-auto px-10 pb-6 pt-10 rounded-lg shadow-[6px_6px_0px_0_rgba(170,199,255,1)]">
            <p className="font-lexendBold text-customDarkBlue2 text-center text-2xl"> 
              {isEditMode ? 'Edit User' : 'Adding New User'} 
            </p>
            <form className="w-full mt-8" onSubmit={handleSubmit}>
              <div className="case-name-group w-full">
                <p className="font-lexendReg text-lg"> Full Name </p>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                  required 
                />
              </div>
              <div className="second-row flex mt-3 items-center justify-between space-x-2">
                <div className="position-group w-1/2">
                  <p className="font-lexendReg text-lg"> Position </p>
                  <input 
                    type="text" 
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                    required 
                  />
                </div>
                <div className="contact-number-group w-1/2">
                  <p className="font-lexendReg text-lg"> Contact Number </p>
                  <input 
                    type="text" 
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                    required 
                  />
                </div>
              </div>
              <div className="email-group w-full">
                <p className="font-lexendReg text-lg"> Email </p>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                  required 
                />
              </div>
              <div className="fourth-row flex items-center w-full mt-3 space-x-2">
                <div className="staff-id-group w-1/3">
                  <p className="font-lexendReg text-lg"> Staff ID </p>
                  <input
                    type="text"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm"
                    required
                    disabled={isEditMode}
                  />
                </div>

                <div className="username-group w-1/3">
                  <p className="font-lexendReg text-lg"> Username </p>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                    required 
                  />
                </div>
                <div className="password-group w-1/3">
                  <p className="font-lexendReg text-lg"> Password </p>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                    required={!isEditMode}
                  />
                  {isEditMode && (
                    <p className="text-xs text-gray-500 mt-1">
                      Leave blank if not changing password
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-center mt-9">
                <button 
                  type="submit" 
                  className="w-[40%] h-auto bg-customBlue1 font-lexendReg text-white rounded-2xl p-4 transition transform hover:-translate-y-1.5 hover:bg-customBlue2 hover:cursor-pointer duration-300 ease-in-out"
                >
                  {isEditMode ? 'Update User' : 'Add New User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <NavBar />

      <div className="users-page w-[75%] pl-10 pt-4 pr-5 ml-[25%]">
        <TopSection />

        <div className="search-and-add-card bg-white w-full h-auto mt-8 px-5 py-5 rounded-xl shadow-md">
          <div className="search-bar flex items-center space-x-3">
            <input 
              type="text" 
              placeholder="Search by ID, Name, Contact Number, Position..." 
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
              onClick={handleAddUserClick}
            > 
              <FaPlus className="mx-auto my-auto text-3xl text-white" /> 
            </button>
          </div>
        </div>

        <div className="table-card bg-white w-full h-auto mt-5 px-4 pt-6 pb-4 rounded-xl shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full font-lexendReg text-sm border-collapse" >
              <thead className="text-white text-center">
                <tr>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Staff ID
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Full Name
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Contact Number
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3 bg-customDarkBlue2 border-2 border-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-center text-customDarkBlue2">
                {filteredStaff.map((staffMember, index) => {
                  const rowClass = index % 2 === 0 ? 'bg-customBlue1/40' : 'bg-customBlue2/40';
                  return (
                    <tr key={staffMember.staffId} className={rowClass}>
                      <td className="px-6 py-4 border-2 border-white">{staffMember.staffId}</td>
                      <td className="px-6 py-4 border-2 border-white">{staffMember.fullName}</td>
                      <td className="px-6 py-4 border-2 border-white">{staffMember.position}</td>
                      <td className="px-6 py-4 border-2 border-white">{staffMember.contactNumber}</td>
                      <td className="px-6 py-4 border-2 border-white">{staffMember.email}</td>
                      <td className="px-6 py-4 border-2 border-white">{staffMember.username}</td>
                      <td className="px-6 py-4 border-2 border-white">
                        <div className="control-buttons-container flex items-center justify-center space-x-2">
                          <button onClick={() => handleEditClick(staffMember)}>
                            <FaEdit className="text-customDarkBlue1 text-3xl hover:text-blue-500 hover:cursor-pointer transition duration-300 ease-in-out" />
                          </button>
                          <button onClick={() => handleDeleteClick(staffMember.staffId)}>
                            <RiDeleteBin5Fill className="text-red-500 text-3xl hover:text-red-400 hover:cursor-pointer transition duration-300 ease-in-out" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredStaff.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No staff members found... 
              </div>
            )}
          </div>
        </div>
      </div>        
    </div>
  )
}

export default Users