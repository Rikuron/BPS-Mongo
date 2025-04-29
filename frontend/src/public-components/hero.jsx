import React from 'react'
import { Link } from 'react-router-dom';
import background_image from '../assets/images/hero_background.jpg'
import me_lmao from '../assets/images/me_lmao.png'

const Hero = () => {
  return (
    <div className="relative w-full h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${background_image})` }}>

      <div className="overlay absolute inset-0 bg-black opacity-60" />
      
      <div className="flex">
        <div className="left-side absolute z-10 p-16 mt-4">
          <div className="text-group">
            
            <p className="font-patuaOneReg text-customBlue1 text-[2.65rem]"> Welcome to Barangay Dulag </p>
            <p className="font-patuaOneReg text-white text-[1.25rem] max-w-[31rem] mt-4"> A charming community nestled within Iligan City in the southern Philippines. Dulag is one of the many diverse barangays that make up Iligan City's vibrant landscape. 
              
            <br /> <br />

            As of 2022, this modest yet close-knit barangay is home to 1,185 residents who contribute to its unique cultural tapestry and community spirit. Surrounded by Iligan's natural beauty and positioned within this bustling industrial city, Barangay Dulag offers visitors an authentic glimpse into Filipino community life. </p>

            <div className="max-w-[27rem] mt-6">
              <p className="font-patuaOneReg text-customBlue1 text-[1.25rem] max-w-[27rem] mt-6"> Looking for someone? Check out our Resident Information Page! </p>

              <div className="information-button-container flex mt-7 justify-center">
                <Link to="/information" className="information-page-button inline-block px-12 py-2 border-2 border-customBlue1 text-white overflow-hidden group cursor-pointer relative">
                  <span className="absolute inset-y-0 left-0 w-0 bg-customBlue1 transition-all duration-300 ease-in-out group-hover:w-full -z-10"></span>
                  <p className="font-patuaOneReg text-lg relative z-10"> Information </p>
                </ Link>
              </div>
            </div>
          </div>
        </div>

        <div className="right-side absolute bottom-0 -mb-10 right-10 z-10 h-full flex justify-center w-1/2">
          <img 
            src={me_lmao} 
            alt="Barangay Dulag" 
            className="object-contain max-h-[100%] max-w-[100%]"
          />
        </div>

      </div>
    </div>
  )
}

export default Hero
