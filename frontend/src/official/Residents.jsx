import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; 
import NavBar from './NavBar';
import TopSection from './TopSection';
import { FaPlus , FaEdit } from "react-icons/fa";
import { RiSearchEyeLine , RiDeleteBin5Fill } from "react-icons/ri";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { API_ENDPOINTS } from '../config/api';

const Residents = () => {
  const [residentId, setResidentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('Male');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [occupation, setOccupation] = useState('');
  const [currentResidentId, setCurrentResidentId] = useState(null); // To track the resident being edited

  const [showCard, setShowCard] = useState(false);
  const [residents, setResidents] = useState([]);
  const [originalResidents, setOriginalResidents] = useState([]); // New state for original residents

  const fetchResidents = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.RESIDENTS}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }); // Fetch residents

      const residentsData = response.data.data || [];

      const processedResidents = residentsData.map(resident => ({
        ...resident,
        id: resident.residentId
      }));
      
      setResidents(processedResidents);
      setOriginalResidents(processedResidents); // Store original residents
    } catch (error) {
      console.error('Error fetching residents:', error);
      if (error.response?.status === 401) {
        alert('You are not authorized to fetch residents');
      } else {
        alert('Failed to fetch residents');
      }
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const cardRef = useRef(null);

  const handleAddResidentClick = () => {
    setShowCard(true);
    setCurrentResidentId(null); // Reset for adding new resident
    setResidentId('');
    setFullName('');
    setBirthdate('');
    setGender('Male');
    setContactNumber('');
    setAddress('');
    setMaritalStatus('Single');
    setOccupation('');
  };

  const handleCloseCard = () => {
    setShowCard(false);
    setResidentId('');
    setFullName('');
    setBirthdate('');
    setGender('Male');
    setContactNumber('');
    setAddress('');
    setMaritalStatus('Single');
    setOccupation('');
    setCurrentResidentId(null); // Reset current resident ID
  };

  const [searchInput, setSearchInput] = useState('');
  const [selectedAge, setSelectedAge] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState('all');

  const handleSearch = () => {
    if (searchInput === '' && selectedAge === 'all' && selectedGender === 'all' && selectedMaritalStatus === 'all') {
      setResidents(originalResidents);
      return;
    }
    
    const filteredResidents = originalResidents.filter(resident => { // Use originalResidents for filtering
      const matchesSearch = searchInput === '' ||
        resident.residentId.toString().includes(searchInput) ||
        resident.fullName.toLowerCase().includes(searchInput.toLowerCase()) ||
        resident.address.toLowerCase().includes(searchInput.toLowerCase()) ||
        resident.contactNumber.includes(searchInput) ||
        resident.occupation.toLowerCase().includes(searchInput.toLowerCase());
      
      const age = calculateAge(resident.birthdate);
      const ageCategory = getAgeCategory(age);
      const matchesAge = selectedAge === 'all' || ageCategory === selectedAge;

      if (selectedAge !== 'all') {
        console.log(`Resident: ${resident.fullName}, Age: ${age}, Category: ${ageCategory}, Selected: ${selectedAge}, Matches: ${matchesAge}`);
      }

      const matchesGender = selectedGender === 'all' || (resident.gender && resident.gender.toLowerCase() === selectedGender.toLowerCase());
      const matchesMaritalStatus = selectedMaritalStatus === 'all' || (resident.maritalStatus && resident.maritalStatus.toLowerCase() === selectedMaritalStatus.toLowerCase());

      return matchesSearch && matchesAge && matchesGender && matchesMaritalStatus;
    });

    setResidents(filteredResidents);
  };


  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDateObj = new Date(birthdate);
    const age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      return age - 1;
    }

    return age;
  };

  const getAgeCategory = (age) => {
    if (age >= 0 && age <= 12) return 'children';
    if (age >= 13 && age <= 17) return 'youth';
    if (age >= 18 && age <= 59) return 'adults';
    if (age >= 60) return 'seniors';
    return null; // Return null for invalid ages
  };

  const handleEdit = async (residentId) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.RESIDENTS}/${residentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const resident = response.data.data;
  
      setResidentId(resident.residentId);
      setFullName(resident.fullName);
      setBirthdate(resident.birthdate.split('T')[0]);
      setGender(resident.gender);
      setContactNumber(resident.contactNumber);
      setAddress(resident.address);
      setMaritalStatus(resident.maritalStatus);
      setOccupation(resident.occupation);
      setCurrentResidentId(residentId); // Set the current resident ID for editing
      setShowCard(true); // Show the card for editing
    } catch (error) {
      console.error('Error fetching resident:', error);
      if (error.response?.status === 401) {
        alert('You are not authorized to fetch residents');
      } else {
        alert('Failed to fetch resident');
      }
    }
  };

  const handleDelete = async (residentId) => {
    try {
      await axios.delete(`${API_ENDPOINTS.RESIDENTS}/${residentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Resident deleted successfully!');

      fetchResidents();
    } catch (error) {
      console.error('Error deleting resident:', error); // Log the error
      if (error.response?.status === 401) {
        alert('You are not authorized to delete residents');
      } else {
        alert('Failed to delete resident');
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        handleCloseCard();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cardRef]);

  // Chart Data
  const ageData = [
    { name: 'Children', value: residents.filter(resident => getAgeCategory(calculateAge(resident.birthdate)) === 'children').length },
    { name: 'Youth', value: residents.filter(resident => getAgeCategory(calculateAge(resident.birthdate)) === 'youth').length },
    { name: 'Adults', value: residents.filter(resident => getAgeCategory(calculateAge(resident.birthdate)) === 'adults').length },
    { name: 'Seniors', value: residents.filter(resident => getAgeCategory(calculateAge(resident.birthdate)) === 'seniors').length },
  ];

  const genderData = [
    { name: 'Male', value: residents.filter(resident => resident.gender && resident.gender.toLowerCase() === 'male').length },
    { name: 'Female', value: residents.filter(resident => resident.gender && resident.gender.toLowerCase() === 'female').length },
    { name: 'Other', value: residents.filter(resident => resident.gender && resident.gender.toLowerCase() === 'other').length },
  ];
  
  const maritalStatusData = [
    { name: 'Single', value: residents.filter(resident => resident.maritalStatus && resident.maritalStatus.toLowerCase() === 'single').length },
    { name: 'Married', value: residents.filter(resident => resident.maritalStatus && resident.maritalStatus.toLowerCase() === 'married').length },
    { name: 'Widowed', value: residents.filter(resident => resident.maritalStatus && resident.maritalStatus.toLowerCase() === 'widowed').length },
    { name: 'Separated', value: residents.filter(resident => resident.maritalStatus && resident.maritalStatus.toLowerCase() === 'separated').length },
  ];
  
  const occupationData = Object.entries(
    residents.reduce((acc, resident) => {
      acc[resident.occupation] = (acc[resident.occupation] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="flex bg-darkerWhite">
      {showCard && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          {/* Card */}
          <div ref={cardRef} className="bg-[#F6F6F6] w-[50%] m-auto h-auto p-6 pt-10 rounded-lg shadow-[6px_6px_0px_0_rgba(170,199,255,1)]">
            <p className="font-lexendBold text-customDarkBlue2 text-center text-2xl"> {currentResidentId ? 'Edit Resident' : 'Adding New Resident'} </p>
            <form className="w-full mt-10">
              <div className="full-name-group">
                <p className="font-lexendReg text-lg"> Full Name </p>
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                  required
                />
              </div>
              <div className="second-row flex items-center w-full mt-3 space-x-2">
                <div className="birthdate-group w-1/3">
                  <p className="font-lexendReg text-lg"> Birthdate </p>
                  <input 
                    type="date" 
                    value={birthdate} 
                    onChange={(e) => setBirthdate(e.target.value)} 
                    className="w-[100%] px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                    required
                  />
                </div>
                <div className="marital-status-group w-1/3">
                  <p className="font-lexendReg text-lg"> Marital Status </p>
                  <select 
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)} 
                    className="w-[100%] px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm"
                    required
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                </div>
                <div className="gender-group w-1/3">
                  <p className="font-lexendReg text-lg"> Gender </p>
                  <select 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)} 
                    className="w-[100%] px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="third-row flex items-center w-full mt-3 space-x-2">
                <div className="resident-id-group w-1/3">
                  <p className="font-lexendReg text-lg"> Resident ID </p>
                  <input 
                    type="text" 
                    value={residentId} 
                    onChange={(e) => setResidentId(e.target.value)} 
                    className="w-[100%] px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                    required
                    disabled = {currentResidentId}
                  />
                </div>
                <div className="contact-number-group w-1/3">
                  <p className="font-lexendReg text-lg"> Contact Number </p>
                  <input 
                    type="text" 
                    value={contactNumber} 
                    onChange={(e) => setContactNumber(e.target.value)} 
                    className="w-[100%] px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                    required
                  />
                </div>
                <div className="occupation-group w-1/3">
                  <p className="font-lexendReg text-lg"> Occupation </p>
                  <input 
                    type="text" 
                    value={occupation} 
                    onChange={(e) => setOccupation(e.target.value)} 
                    className="w-[100%] px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                    required
                  />
                </div>
              </div>
              <div className="address-group mt-3">
                <p className="font-lexendReg text-lg"> Address </p>
                <input 
                  type="text" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                  required
                />
              </div>

              <div className="flex justify-center mt-9">
                <button 
                  type="button" 
                  onClick={async () => { 
                    try {
                      const headers = {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                      };

                      const residentData = {
                        residentId,
                        fullName,
                        birthdate,
                        gender,
                        contactNumber,
                        address,
                        maritalStatus,
                        occupation
                      };

                      console.log('Resident data: ', residentData);
                      console.log('Headers: ', headers);

                      const response = await axios({
                        method: currentResidentId ? 'PUT' : 'POST',
                        url: currentResidentId 
                          ? `${API_ENDPOINTS.RESIDENTS}/${currentResidentId}` 
                          : API_ENDPOINTS.RESIDENTS,
                        headers,
                        data: residentData
                      });
                      console.log('Server response: ', response);
                      alert(currentResidentId ? 'Resident updated successfully' : 'Resident added successfully');
                      fetchResidents(); // Refresh the residents list after addition or update
                      handleCloseCard(); // Close the card after successful addition or update
                    } catch (error) {
                      console.error('Error saving resident:', {
                        message: error.message,
                        response: error.response?.data,
                        status: error.response?.status,
                        statusText: error.response?.statusText
                      }); 
                      
                      // Log the error
                      if (error.response?.status === 401) {
                        alert('You are not authorized to save residents');
                      } else {
                        const errorMessage = error.response?.data?.message || error.message || 'Failed to save resident';
                        alert(`Error: ${errorMessage}`);
                      }
                    }
                  }}
                  className="w-[40%] h-auto bg-customBlue1 font-lexendReg text-white rounded-2xl text-lg p-2 transition transform hover:-translate-y-1.5 hover:bg-customBlue2 hover:cursor-pointer duration-300 ease-in-out">
                  {currentResidentId ? ('Update Resident') : (<> Register New <br /> Resident </>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <NavBar />

      <div className="residents w-[75%] pl-10 pt-4 pr-5 ml-[25%]">
        <TopSection />

        <div className="search-and-add-card bg-white w-full h-auto mt-8 px-5 pt-6 pb-3 rounded-xl shadow-md">
          <div className="search-bar flex items-center space-x-3">
            <input 
              type="text" 
              placeholder="Search by ID, Name, Address, Contact Number, Occupation..." 
              className="w-[85%] h-12 px-5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
              onChange={(e) => setSearchInput(e.target.value)} 
            />
            <button 
              className="search-resident-button w-[6%] h-12 bg-customDarkBlue2 rounded-lg hover:cursor-pointer hover:bg-customDarkBlue1 transition duration-300 ease-in-out" 
              onClick={handleSearch}
            > 
              <RiSearchEyeLine className="mx-auto my-auto text-3xl text-white" /> 
            </button>

            <button className="add-new-resident-button w-[6%] h-12 bg-customBlue2 rounded-lg hover:cursor-pointer hover:bg-customBlue1 transition duration-300 ease-in-out"
            onClick={handleAddResidentClick} > <FaPlus className="mx-auto my-auto text-3xl text-white" /> </button>
          </div>

          <div className="select-bar-group flex items-center space-x-3 my-3">
            <div className="age-select-bar w-1/3">
              <p className="font-lexendReg ml-2"> Age Category </p>
              <select 
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent"
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}  
              >
                <option value="all">All Ages</option>
                <option value="children">Children</option>
                <option value="youth">Youth</option>
                <option value="adults">Adults</option>
                <option value="seniors">Seniors</option>
              </select>
            </div>
            <div className="gender-select-bar w-1/3">
              <p className="font-lexendReg ml-2"> Gender </p>
              <select 
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}  
              >
                <option value="all">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="marital-status-select-bar w-1/3">
              <p className="font-lexendReg ml-2"> Marital Status </p>
              <select 
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent"
                value={selectedMaritalStatus}
                onChange={(e) => setSelectedMaritalStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Separated">Separated</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-card bg-white w-full h-auto mt-5 px-4 pt-4 pb-4 rounded-xl shadow-md">
          <div className="total-residents pb-3 pl-2">
            <p className="font-patuaOneReg text-black text-2xl"> Total Residents:  <strong className="text-customDarkBlue1">{residents.length}</strong> </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-lexendReg text-sm border-collapse" >
              <thead className="text-white text-center">
                <tr>
                  <th scope="col" className="px-6 bg-customDarkBlue2 border-2 border-white">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-2 bg-customDarkBlue2 border-2 border-white">
                    Full Name
                  </th>
                  <th scope="col" className="px-6 bg-customDarkBlue2 border-2 border-white">
                    Birthdate
                  </th>
                  <th scope="col" className="px-6 bg-customDarkBlue2 border-2 border-white">
                    Gender
                  </th>
                  <th scope="col" className="px-6 bg-customDarkBlue2 border-2 border-white">
                    Contact Number
                  </th>
                  <th scope="col" className="px-6 bg-customDarkBlue2 border-2 border-white">
                    Address
                  </th>
                  <th scope="col" className="px-6 bg-customDarkBlue2 border-2 border-white">
                    Marital Status
                  </th>
                  <th scope="col" className="px-6 bg-customDarkBlue2 border-2 border-white">
                    Occupation
                  </th>
                  <th scope="col" className="px-6 bg-customDarkBlue2 border-2 border-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-center text-customDarkBlue2">
                {residents.sort((a, b) => a.residentId - b.residentId).map((resident, index) => (
                  <tr key={resident.id} className={index % 2 === 0 ? "bg-customBlue2/40" : "bg-customBlue1/40"}>
                    <td className="px-6 py-4 border-2 border-white">{resident.residentId}</td>
                    <td className="px-6 py-4 border-2 border-white">{resident.fullName}</td>
                    <td className="px-6 py-4 border-2 border-white">
                      {new Date(resident.birthdate).toISOString().split('T')[0]}
                    </td>
                    <td className="px-6 py-4 border-2 border-white">{resident.gender}</td>
                    <td className="px-6 py-4 border-2 border-white">{resident.contactNumber}</td>
                    <td className="px-6 py-4 border-2 border-white">{resident.address}</td>
                    <td className="px-6 py-4 border-2 border-white">{resident.maritalStatus}</td>
                    <td className="px-6 py-4 border-2 border-white">{resident.occupation}</td>
                    <td className="px-6 py-4 border-2 border-white">
                      <div className="control-buttons-container flex items-center justify-between space-x-2">
                        <button onClick={() => handleEdit(resident.residentId)}>
                          <FaEdit className="text-customDarkBlue1 text-3xl hover:text-blue-500 hover:cursor-pointer transition duration-300 ease-in-out" />
                        </button>
                        <button onClick={() => handleDelete(resident.id)}>
                          <RiDeleteBin5Fill className="text-red-500 text-3xl hover:text-red-400 hover:cursor-pointer transition duration-300 ease-in-out" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="charts-row-1 flex justify-between items-center space-x-5">
          <div className="ages-bar-chart-card bg-customBlue1/40 w-1/2 h-auto mt-5 px-4 pt-6 pb-4 rounded-xl shadow-md">
            <h2 className="font-patuaOneReg text-2xl text-customDarkBlue2 text-center"> Age Distribution </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ageData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  <Cell key="Children" fill="#82ca9d" />
                  <Cell key="Youth" fill="#8884d8" />
                  <Cell key="Adults" fill="#ffc658" />
                  <Cell key="Seniors" fill="#ff8042" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="gender-pie-chart-card bg-customBlue2/40 w-1/2 h-auto mt-5 px-4 pt-6 pb-4 rounded-xl shadow-md">
            <h2 className="font-patuaOneReg text-2xl text-customDarkBlue2 text-center"> Gender Distribution </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  <Cell key="Male" fill="#0a305f" />
                  <Cell key="Female" fill="#f84848" />
                  <Cell key="Other" fill="#7e6f6f" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="charts-row-2 flex justify-between items-center space-x-5">
          <div className="marital-status-pie-chart-card bg-customBlue2/40 w-1/2 h-auto mt-4 mb-8 px-4 pt-6 pb-4 rounded-xl shadow-md">
            <h2 className="font-patuaOneReg text-2xl text-customDarkBlue2 text-center"> Marital Status Distribution </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={maritalStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  <Cell key="Single" fill="#82ca9d" />
                  <Cell key="Married" fill="#7a7405" />
                  <Cell key="Widowed" fill="#ff8042" />
                  <Cell key="Separated" fill="#8884d8" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="occupaiton-bar-chart-card bg-customBlue1/40 w-1/2 h-auto mt-4 mb-8 px-4 pt-6 pb-4 rounded-xl shadow-md">
            <h2 className="font-patuaOneReg text-2xl text-customDarkBlue2 text-center"> Occupation Distribution </h2>
            <ResponsiveContainer width="100%" height={300}>
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

      </div>
    </div>
  )
}

export default Residents;
