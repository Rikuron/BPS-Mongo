import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiFillDashboard } from "react-icons/ai";
import { FaHouseUser, FaUser, FaUsers } from "react-icons/fa";
import { BiSolidMegaphone } from "react-icons/bi";
import { IoBriefcase } from "react-icons/io5";
import { MdEvent } from "react-icons/md";

const NavBar = () => {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false); // State for admin status

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    setIsAdmin(adminStatus === 'true'); // Set admin status based on local storage
  }, []);

  return (
    <div className="nav-bar fixed w-[25%] h-screen" style={{ background: 'var(--color-customGradient7)' }}>
      <div className="title-section w-full h-[23%] border-b border-gray-400 flex items-center justify-center">
        <p className="font-patuaOneReg text-white text-3xl text-center"> Barangay Dulag System </p>
      </div>

      <div className="nav-list my-7">
        <Link to="/official/dashboard">
          <div className={`flex w-full h-13 items-center pl-7 ${location.pathname === '/official/dashboard' ? 'bg-customBlue1 text-customDarkBlue2' : 'text-white hover:bg-customBlue2 hover:text-customDarkBlue2'} transition duration-300 ease-in-out`}>
            <AiFillDashboard className="text-4xl" />
            <p className="font-lexendReg text-xl ml-4"> Dashboard </p>
          </div>
        </Link>

        <Link to="/official/residents">
          <div className={`flex w-full h-13 items-center pl-7 ${location.pathname === '/official/residents' ? 'bg-customBlue1 text-customDarkBlue2' : 'text-white hover:bg-customBlue2 hover:text-customDarkBlue2'} transition duration-300 ease-in-out`}>
            <FaHouseUser className="text-4xl" />
            <p className="font-lexendReg text-xl ml-4"> Residents </p>
          </div>
        </Link>

        <Link to="/official/announcements">
          <div className={`flex w-full h-13 items-center pl-7 ${location.pathname === '/official/announcements' ? 'bg-customBlue1 text-customDarkBlue2' : 'text-white hover:bg-customBlue2 hover:text-customDarkBlue2'} transition duration-300 ease-in-out`}>
            <BiSolidMegaphone className="text-4xl" />
            <p className="font-lexendReg text-xl ml-4"> Announcements </p>
          </div>
        </Link>

        <Link to="/official/cases">
          <div className={`flex w-full h-13 items-center pl-7 ${location.pathname === '/official/cases' ? 'bg-customBlue1 text-customDarkBlue2' : 'text-white hover:bg-customBlue2 hover:text-customDarkBlue2'} transition duration-300 ease-in-out`}>
            <IoBriefcase className="text-4xl" />
            <p className="font-lexendReg text-xl ml-4"> Cases </p>
          </div>
        </Link>

        <Link to="/official/events">
          <div className={`flex w-full h-13 items-center pl-7 ${location.pathname === '/official/events' ? 'bg-customBlue1 text-customDarkBlue2' : 'text-white hover:bg-customBlue2 hover:text-customDarkBlue2'} transition duration-300 ease-in-out`}>
            <MdEvent className="text-4xl" />
            <p className="font-lexendReg text-xl ml-4"> Events Calendar </p>
          </div>
        </Link>

        {isAdmin && ( // Conditionally render Users link
          <>
            <div className="w-[90%] h-px bg-gray-400 my-4 mx-auto" />
            
            <Link to="/official/users">
              <div className={`flex w-full h-13 items-center pl-7 ${location.pathname === '/official/users' ? 'bg-customBlue1 text-customDarkBlue2' : 'text-white hover:bg-customBlue2 hover:text-customDarkBlue2'} transition duration-300 ease-in-out`}>
                <FaUsers className="text-4xl" />
                <p className="font-lexendReg text-xl ml-4"> Users </p>
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
