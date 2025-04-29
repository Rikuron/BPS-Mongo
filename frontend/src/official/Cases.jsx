import React, { useState, useEffect, useRef } from 'react';
import NavBar from './NavBar'
import TopSection from './TopSection';
import axios from 'axios';
import { FaPlus, FaEdit } from "react-icons/fa";
import { IoBriefcase } from "react-icons/io5";
import { RiSearchEyeLine, RiDeleteBin5Fill } from "react-icons/ri";
import ongoing from '../assets/images/refresh.png'
import pending from '../assets/images/pending.png'
import resolved from '../assets/images/resolved.png'
import { API_BASE_URL , API_ENDPOINTS } from '../config/api';

const Cases = () => {
  const [showCard, setShowCard] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const cardRef = useRef(null);

  // State for case form
  const [newCase, setNewCase] = useState({
    caseId: '',
    caseName: '',
    caseType: 'Investigation',
    caseStatus: 'Pending',
    complainantName: '',
    dateFiled: ''
  });

  // State for cases list and original cases
  const [cases, setCases] = useState([]);
  const [originalCases, setOriginalCases] = useState([]);

  // State for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCaseType, setSelectedCaseType] = useState('all');
  const [selectedCaseStatus, setSelectedCaseStatus] = useState('all');

  // State for current case being edited
  const [currentCaseId, setCurrentCaseId] = useState(null);
  const [editCase, setEditCase] = useState(false);

  // State for case statistics
  const [caseStats, setCaseStats] = useState({
    ongoingCases: 0,
    pendingCases: 0,
    resolvedCases: 0,
    totalCases: 0
  }); 

  // Fetch cases on component mount
  useEffect(() => {
    fetchCases();
  }, []);

  // Fetch cases from backend
  const fetchCases = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_ENDPOINTS.CASES}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const processedCases = response.data.data.map(caseItem => ({
        ...caseItem,
        id: caseItem.caseId
      }));
      setCases(processedCases);
      setOriginalCases(processedCases);
      calculateCaseStats(processedCases);
    } catch (error) {
      console.error('Error fetching cases:', error);
      if (error.response?.status === 401) {
        alert('You are not authorized to fetch cases');
      } else {
        alert('Failed to fetch cases');
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate case statistics
  const calculateCaseStats = (casesData) => {
    const stats = {
      ongoingCases: casesData.filter(c => c.caseStatus === 'Ongoing').length,
      pendingCases: casesData.filter(c => c.caseStatus === 'Pending').length,
      resolvedCases: casesData.filter(c => c.caseStatus === 'Resolved').length,
      totalCases: casesData.length
    };
    setCaseStats(stats);
  };

  // Handle search and filter
  const handleSearch = () => {
    if (searchTerm === '' && selectedCaseType === 'all' && selectedCaseStatus === 'all') {
      setCases(originalCases);
      return;
    }
    
    const filteredCases = originalCases.filter(caseItem => 
      (searchTerm === '' ||
        caseItem.caseId.toString().includes(searchTerm) || 
        caseItem.caseName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        caseItem.complainantName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCaseType === 'all' || caseItem.caseType === selectedCaseType) &&
      (selectedCaseStatus === 'all' || caseItem.caseStatus === selectedCaseStatus)
    );

    setCases(filteredCases);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCase(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle edit case
  const handleEditCase = async (caseId) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.CASES}/${caseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const caseData = response.data.data;

      setNewCase({
        caseId: caseData.caseId,
        caseName: caseData.caseName,
        caseType: caseData.caseType,
        caseStatus: caseData.caseStatus,
        complainantName: caseData.complainantName,
        dateFiled: caseData.dateFiled.split('T')[0]
      });
      setEditCase(true);
      setCurrentCaseId(caseId);
      setShowCard(true);
    } catch (error) {
      console.error('Error fetching case:', error);
      if (error.response?.status === 401) {
        alert('You are not authorized to fetch case details');
      } else {
        alert('Failed to fetch case details');
      }
    }
  };

  // Handle delete case
  const handleDeleteCase = async (caseId) => {
    try {
      await axios.delete(`${API_ENDPOINTS.CASES}/${caseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Case deleted successfully!');
      fetchCases();
    } catch (error) {
      console.error('Error deleting case:', error);
      if (error.response?.status === 401) {
        alert('You are not authorized to delete this case');
      } else {
        alert('Failed to delete case');
      }
    }
  };

  // Add or update case
  const handleSubmitCase = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };

      const staffId = localStorage.getItem('staffId');
      const caseData = {
        ...newCase,
        staffId
      };

      const response = await axios({
        method: currentCaseId ? 'PUT' : 'POST',
        url: currentCaseId 
          ? `${API_ENDPOINTS.CASES}/${currentCaseId}` 
          : `${API_ENDPOINTS.CASES}`,
        headers,
        data: caseData
      });

      alert(currentCaseId ? 'Case updated successfully' : 'Case added successfully');
      console.log('Response:', response.data);

      fetchCases();
      
      // Reset form and close card
      setNewCase({
        caseId: '',
        caseName: '',
        caseType: 'Investigation',
        caseStatus: 'Pending',
        complainantName: '',
        dateFiled: ''
      });
      setCurrentCaseId(null);
      setShowCard(false);
      setEditCase(false)
    } catch (error) {
      console.error('Error saving case:', error);
      if (error.response?.status === 401) {
        alert('You are not authorized to save a case');
      } else {
        alert('Failed to save case');
      }
    }
  };

  // Handle card close
  const handleCloseCard = () => {
    setShowCard(false);
    setCurrentCaseId(null);
    setNewCase({
      caseId: '',
      caseName: '',
      caseType: 'Investigation',
      caseStatus: 'Pending',
      complainantName: '',
      dateFiled: ''
    });
    setEditCase(false);
  };

  // Handle click outside card
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

  return (
    <div className="flex bg-darkerWhite">
      {showCard && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div ref={cardRef} className="bg-[#F6F6F6] w-[50%] m-auto h-auto px-10 pb-6 pt-10 rounded-lg shadow-[6px_6px_0px_0_rgba(170,199,255,1)]">
            <p className="font-lexendBold text-customDarkBlue2 text-center text-2xl">
              {currentCaseId ? 'Edit Case' : 'Adding New Case'}
            </p>
            <form onSubmit={handleSubmitCase} className="w-full mt-8">
              <div className="case-name-group">
                <p className="font-lexendReg text-lg"> Case Name </p>
                <input 
                  type="text" 
                  className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                  name="caseName"
                  value={newCase.caseName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="second-row flex mt-3 items-center justify-between space-x-2">
                <div className="case-id group w-1/2">
                  <p className="font-lexendReg text-lg"> Case ID </p>
                  <input 
                    type="text"
                    className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm"
                    name="caseId"
                    value={newCase.caseId}
                    onChange={handleInputChange}
                    required
                    disabled={editCase}
                  />
                </div>
                <div className="complainant-name-group w-1/2">
                  <p className="font-lexendReg text-lg"> Complainant Name </p>
                  <input 
                    type="text" 
                    className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                    name="complainantName"
                    value={newCase.complainantName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="third-row flex items-center w-full mt-3 space-x-2">
                <div className="case-type-group w-1/3">
                  <p className="font-lexendReg text-lg"> Case Type </p>
                  <select 
                    className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm"
                    name="caseType"
                    value={newCase.caseType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Investigation">Investigation</option>
                    <option value="Violence">Violence</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="case-status-group w-1/3">
                  <p className="font-lexendReg text-lg"> Case Status </p>
                  <select 
                    className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm"
                    name="caseStatus"
                    value={newCase.caseStatus}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Resolved">Resolved</option>
                  </select> 
                </div>
                <div className="date-filed-group w-1/3">
                  <p className="font-lexendReg text-lg"> Date Filed </p>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                    name="dateFiled"
                    value={newCase.dateFiled}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-center mt-9">
                <button 
                  type="submit" 
                  className="w-[40%] h-auto bg-customBlue1 font-lexendReg text-white rounded-2xl p-4 transition transform hover:-translate-y-1.5 hover:bg-customBlue2 hover:cursor-pointer duration-300 ease-in-out"
                >
                  {currentCaseId ? 'Update Case' : 'Add New Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <NavBar />

      <div className="cases-page w-[75%] pl-10 pt-4 pr-5 ml-[25%]">
        <TopSection />

        <div className="cases-card-group flex items-center justify-between w-full h-auto mt-8 space-x-4">
          <div className="pending-cases-card flex items-center justify-between w-[25%] h-auto py-6 pr-6 pl-2 bg-white rounded-xl shadow-[4px_4px_0px_0_rgba(242,255,0,1)]">
            <div className="ml-3 mt-2">
                <p className="font-patuaOneReg text-3xl text-[#F2FF00]"> {caseStats.pendingCases} </p>
                <p className="font-lexendReg text-sm text-gray-400 mt-1"> Pending Cases </p>
            </div>
            <img src={pending} alt="pending" className="w-12 h-auto" />
          </div>

          <div className="ongoing-cases-card flex items-center justify-between w-[25%] h-auto py-6 pr-6 pl-2 bg-white rounded-xl shadow-[4px_4px_0px_0_rgba(29,78,216,1)]">
            <div className="ml-3 mt-2">
                <p className="font-patuaOneReg text-3xl text-customDarkBlue4"> {caseStats.ongoingCases} </p>
                <p className="font-lexendReg text-sm text-gray-400 mt-1"> Ongoing Cases </p>
            </div>
            <img src={ongoing} alt="ongoing" className="w-12 h-auto" />
          </div>

          <div className="resolved-cases-card flex items-center justify-between w-[25%] h-auto py-6 pr-6 pl-2 bg-white rounded-xl shadow-[4px_4px_0px_0_rgba(14,229,36,1)]">
            <div className="ml-3 mt-2">
                <p className="font-patuaOneReg text-3xl text-[#0EE524]"> {caseStats.resolvedCases} </p>
                <p className="font-lexendReg text-sm text-gray-400 mt-1"> Resolved Cases </p>
            </div>
            <img src={resolved} alt="resolved" className="w-12 h-auto" />
          </div>

          <div className="resolved-cases-card flex items-center justify-between w-[25%] h-auto py-6 pr-6 pl-2 bg-white rounded-xl shadow-[4px_4px_0px_0_rgba(170,199,255,1)]">
            <div className="ml-3 mt-2">
                <p className="font-patuaOneReg text-3xl text-customBlue1"> {caseStats.totalCases} </p>
                <p className="font-lexendReg text-sm text-gray-400 mt-1"> Total Cases </p>
            </div>
            <IoBriefcase className="w-12 h-auto text-customBlue1" />
          </div>
        </div>

        <div className="search-and-add-card bg-white w-full h-auto mt-5 px-5 py-5 rounded-xl shadow-md">
          <div className="search-bar flex items-center space-x-3">
            <input 
              type="text" 
              placeholder="Search by Case ID, Case Name, Complainant Name..." 
              className="w-[85%] h-12 px-5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="search-resident-button w-[6%] h-12 bg-customDarkBlue2 rounded-lg hover:cursor-pointer hover:bg-customDarkBlue1 transition duration-300 ease-in-out"
              onClick={handleSearch}
            > 
              <RiSearchEyeLine className="mx-auto my-auto text-3xl text-white" /> 
            </button>

            <button 
              className="add-new-resident-button w-[6%] h-12 bg-customBlue2 rounded-lg hover:cursor-pointer hover:bg-customBlue1 transition duration-300 ease-in-out"
              onClick={() => setShowCard(true)}
            > 
              <FaPlus className="mx-auto my-auto text-3xl text-white" /> 
            </button>
          </div>

          <div className="select-bar-group flex items-center space-x-3 my-3">
            <div className="case-type-select-bar w-1/2">
              <p className="font-lexendReg ml-2"> Case Type </p>
              <select 
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent"
                value={selectedCaseType}
                onChange={(e) => setSelectedCaseType(e.target.value)}  
              >
                <option value="all">All Case Types</option>
                <option value="Investigation">Investigation</option>
                <option value="Violence">Violence</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="case-status-select-bar w-1/2">
              <p className="font-lexendReg ml-2"> Case Status </p>
              <select 
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent"
                value={selectedCaseStatus}
                onChange={(e) => setSelectedCaseStatus(e.target.value)}
              >
                <option value="all">All Case Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-card bg-white w-full h-auto mt-5 px-4 pt-6 pb-4 rounded-xl shadow-md">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <p className="font-lexendReg text-lg text-gray-400"> Loading cases... </p>
              </div>
            ) : cases.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p className="font-lexendReg text-lg text-gray-400"> No cases found </p>
              </div>
            ) : (
              <table className="w-full font-lexendReg text-sm border-collapse" >
                <thead className="text-white text-center">
                  <tr>
                    <th scope="col" className="px-6 py-2 bg-customDarkBlue2 border-2 border-white">
                      Case ID
                    </th>
                    <th scope="col" className="px-6 py-2 bg-customDarkBlue2 border-2 border-white">
                      Case Name
                    </th>
                    <th scope="col" className="px-6 py-2 bg-customDarkBlue2 border-2 border-white">
                      Case Type
                    </th>
                    <th scope="col" className="px-6 py-2 bg-customDarkBlue2 border-2 border-white">
                      Case Status
                    </th>
                    <th scope="col" className="px-6 py-2 bg-customDarkBlue2 border-2 border-white">
                      Complainant Name
                    </th>
                    <th scope="col" className="px-6 py-2 bg-customDarkBlue2 border-2 border-white">
                      Date Filed
                    </th>
                    <th scope="col" className="px-6 py-2 bg-customDarkBlue2 border-2 border-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center text-customDarkBlue2">
                  {cases.sort((a, b) => a.caseId - b.caseId).map((caseItem, index) => (
                    <tr 
                      key={caseItem.id} 
                      className={index % 2 === 0 ? "bg-customBlue2/40" : "bg-customBlue1/40"}
                    >
                      <td className="px-6 py-4 border-2 border-white">{caseItem.caseId}</td>
                      <td className="px-6 py-4 border-2 border-white">{caseItem.caseName}</td>
                      <td className="px-6 py-4 border-2 border-white">{caseItem.caseType}</td>
                      <td className="px-6 py-4 border-2 border-white">{caseItem.caseStatus}</td>
                      <td className="px-6 py-4 border-2 border-white">{caseItem.complainantName}</td>
                      <td className="px-6 py-4 border-2 border-white">
                        {new Date(caseItem.dateFiled).toISOString().split('T')[0]}
                      </td>
                      <td className="px-6 py-4 border-2 border-white">
                        <div className="control-buttons-container flex items-center justify-center space-x-2">
                          <button onClick={() => handleEditCase(caseItem.caseId)}>
                            <FaEdit className="text-customDarkBlue1 text-3xl hover:text-blue-500 hover:cursor-pointer transition duration-300 ease-in-out" />
                          </button>
                          <button onClick={() => handleDeleteCase(caseItem.caseId)}>
                            <RiDeleteBin5Fill className="text-red-500 text-3xl hover:text-red-400 hover:cursor-pointer transition duration-300 ease-in-out" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cases;
