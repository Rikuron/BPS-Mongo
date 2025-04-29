import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/Logo.png';

const Header = () => {
  return (
    <div className="flex w-full h-20" style={{ background: 'var(--color-customGradient1)' }}>
        <div className="logo-group flex my-auto ml-14">
            <div className="logo">
              <img src={logo} alt="logo" className="logo-img max-w-16 " />
            </div>
            <div className="ml-4 -space-y-1">
              <p className="font-patuaOneReg text-2xl text-customDarkBlue2"> Barangay Dulag </p>
              <p className="font-patuaOneReg text-[1.2rem] text-customDarkBlue2"> Iligan City </p>
            </div>
        </div>
        <div className="nav-list flex items-center ml-auto mr-22 space-x-16">
          <Link to="/" className="nav-link relative text-white text-xl font-lexendBold group">
            Home
            <span className="absolute h-[0.2rem] bg-white w-0 left-1/2 -bottom-1 transform -translate-x-1/2 transition-all duration-300 ease-in-out group-hover:w-[120%]"></span>
          </Link>
          <Link to="/information" className="nav-link relative text-white text-xl font-lexendBold group">
            Information
            <span className="absolute h-[0.2rem] bg-white w-0 left-1/2 -bottom-1 transform -translate-x-1/2 transition-all duration-300 ease-in-out group-hover:w-[120%]"></span>
          </Link>
        </div>
    </div>
  )
}

export default Header;
