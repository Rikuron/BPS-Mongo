import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import dulag_image from '../assets/images/Dulag_ss.jpeg'
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Log in attempt with username: ', username);
      
      const response = await axios.post(`${API_ENDPOINTS.LOGIN}`, {
        username,
        password
      });
      console.log('Full login response: ', response);
      console.log('Login Response data: ', response.data);
      console.log('Username from response: ', response.data.staff.username);
      
      // Save authentication details
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('staffId', response.data.staff.staffId);
      localStorage.setItem('username', response.data.staff.username);
      localStorage.setItem('isAdmin', response.data.staff.isAdmin);

      console.log('Stored username: ', localStorage.getItem('username'));

      // Set default axios auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      navigate('/official/dashboard');
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Invalid username or password');
      } else if (error.response?.data?.message) {
        setError(error.response?.data?.message);
      } else {
        setError('Log in failed. Please try again.');
      }
    }
  };

  return (
    <div className="relative w-screen h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${dulag_image})` }}> 
      <div className="login-bar flex absolute w-[35%] h-screen bg-white left-0 rounded-br-3xl rounded-tr-3xl">
        <div className="w-[75%] my-auto mx-auto">
          <p className="text-5xl text-center font-patuaOneReg text-customDarkBlue2">
            Log In 
          </p>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="mt-8">
              <label 
                htmlFor="username"
                className="font-lexendReg text-lg"
              >
                Username
              </label>
              <input 
                type="text" 
                className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-4xl focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm" 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mt-5">
              <label 
                htmlFor="password"
                className="font-lexendReg text-lg"
              >
                Password
              </label>
              <input 
                type="password" 
                className="w-full px-5 py-2 mt-2 border border-gray-300 rounded-4xl focus:outline-none focus:ring-2 focus:ring-customBlue1 focus:border-transparent inset-shadow-sm"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required   
              />
            </div>

            <div className="flex justify-center mt-14">
              <button 
                type="submit"
                className="w-[50%] h-12 font-patuaOneReg text-white text-2xl rounded-[3rem] hover:cursor-pointer transition duration-500 ease-in-out" 
                style={{ 
                  background: isHovered ? 'var(--color-customGradient4)' : 'var(--color-customGradient3)', 
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  transition: 'background-color 0.5s ease, transform 0.5s ease'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              > 
                Enter 
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
