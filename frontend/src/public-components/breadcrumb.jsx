import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = () => {
  return (
    <div className="bg-white w-full h-40 py-6 pl-7">
      <div className="">
        <p className="font-lexendReg text-[1rem] text-customDarkBlue3 "> 
          <Link to="/">
            Home
          </Link> 
          &nbsp; &gt; &nbsp; 
          <span className="text-customBlue1">
            <Link to="/information">
              Residents Information
            </Link>
          </span> 
        </p>
      </div>

      <div className="mt-2">
        <p className="font-patuaOneReg text-customDarkBlue1 text-3xl"> Residents Information Summary </p>
      </div>

      <div className="mt-1.5">
        <p className="font-lexendReg text-customDarkBlue3"> Have a look at our residents demographics! </p>
      </div>
    </div>
  );
}

export default Breadcrumb;
