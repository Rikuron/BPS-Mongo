import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const Contact = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('');

    try {
      const response = await axios.post(API_ENDPOINTS.SEND_EMAIL, { email , message });

      setSubmitStatus('Email sent successfully!');
      setEmail('');
      setMessage('');
    } catch (error) {
      setSubmitStatus('Failed to send email. Please try again.');
      console.error('Error sending email:', error);
    }
  };

  return (
    <div className="dulag-image flex w-full h-[38.28rem]">
        <div className="map-container w-[70%]">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44727.306306752806!2d124.39863507721178!3d8.191899378666273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x325582717ecc2433%3A0x437412835ab8322e!2sDulag%2C%20Iligan%20City%2C%20Lanao%20del%20Norte!5e1!3m2!1sen!2sph!4v1741424099897!5m2!1sen!2sph" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Barangay Dulag Location"
                className="w-full h-full"
            />
        </div>
        <div className="w-[30%] flex mt-22 justify-center">
            <div className="w-[85%]">
                <div className="text-center">
                    <p className="font-patuaOneReg text-customDarkBlue2 text-[1.675rem]"> Get in touch with us! </p>
                </div>
                {submitStatus && (
                    <div className={`
                        mt-4 p-2 text-center rounded 
                        ${submitStatus.includes('successfully') 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }
                    `}>
                        {submitStatus}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="mt-9">
                    <div className="mb-4">
                        <p className="font-patuaOneReg text-xl text-customDarkBlue2"> Your email </p>
                        <input 
                            type="email" 
                            id="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 px-3 py-1 border bg-white inset-shadow-2xs border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent"
                            placeholder="youremail@example.com" 
                            required
                        />
                    </div>
                    <div className="mb-8">
                        <p className="font-patuaOneReg text-xl text-customDarkBlue2"> Your message </p>
                        <textarea 
                            id="message" 
                            rows="7" 
                            value={message}
                            onChange={(e) => {setMessage(e.target.value)}}
                            className="w-full mt-1 px-3 py-1 border bg-white inset-shadow-2xs border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent resize-none"
                            placeholder="Your message here..." 
                            required
                        />
                    </div>
                    <div className="mt-4 text-center">
                        <button 
                            type="submit" 
                            className="hover:cursor-pointer text-white text-2xl font-patuaOneReg w-[50%] h-[3.5rem] py-2 px-6 rounded-4xl transition duration-500 ease-in-out"
                            style={{ 
                                background: isHovered ? 'var(--color-customGradient4)' : 'var(--color-customGradient3)', 
                                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                                transition: 'background-color 0.5s ease, transform 0.5s ease'
                            }}

                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Contact;
