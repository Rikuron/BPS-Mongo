import React, { useState , useRef , useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import dulag_image from '../assets/images/Dulag_ss.jpeg'
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import QrScanner from 'qr-scanner';

const Login = () => {
  // State variables for login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // State variable for button hover effect
  const [isHovered, setIsHovered] = useState(false);

  // State variable for QR login
  const [qrSecret, setQrSecret] = useState('');
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [isQrProcessing, setIsQrProcessing] = useState(false);
  
  const scannerRef = useRef(null);
  const videoRef = useRef(null);

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

  const handleQrLogin = async (secretValue = null) => {
    if (isQrProcessing) return;

    setIsQrProcessing(true);
    setError('');

    try {
      const secretToUse = secretValue || qrSecret;

      if (!secretToUse) {
        setError('Please scan or enter a QR code secret');
        setIsQrProcessing(false);
        return;
      }

      console.log('Attempting QR login with secret: ', secretToUse);

      const response = await axios.post(
        `${API_ENDPOINTS.LOGIN}-qr`, 
        { qrSecret: secretToUse }
      );
      console.log('QR login response: ', response);
      console.log('QR login response data: ', response.data);

      if (!response.data || !response.data.token) {
        throw new Error('Invalid QR login response');
      }

      // Save authentication details
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('staffId', response.data.staff.staffId);
      localStorage.setItem('username', response.data.staff.username);
      localStorage.setItem('isAdmin', response.data.staff.isAdmin);

      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      navigate('/official/dashboard');
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Invalid QR secret');
      } else {
        setError('QR login failed. Please try again.');
      }
    }
  };

  // Function to start QR Code scanner
  const startQrScanner = async () => {
    try {
      if (!videoRef.current) return;

      // Stop and destroy existing scanner if it exists
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }

      // Initialize new scanner
      const qrScanner = new QrScanner(
        videoRef.current,
        result => {
          console.log('QR Code scanned: ', result.data);
          stopQrScanner();
          setShowQrScanner(false);
          handleQrLogin(result.data);
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      // Store scanner reference
      scannerRef.current = qrScanner;

      // Start scanning
      await qrScanner.start();
      console.log('QR Code scanner started');
    } catch (err) {
      console.error('Error initializing QR Code scanner: ', err);
      setError('QR Code scanner initialization error. Please try again.');
      setShowQrScanner(false);
    }
  };

  // Function to stop QR Code scanner
  const stopQrScanner = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
        console.log('QR Code scanner stopped');
      } catch (error) {
        console.error('Error stopping QR Code scanner: ', error);
      }
    }
  };

  // Function to toggle QR Code scanner
  const toggleQrScanner = () => {
    setShowQrScanner(!showQrScanner);
  };

  // UseEffect for QR Code Scanner view is shown
  useEffect(() => {
    if (showQrScanner) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        startQrScanner();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      stopQrScanner();
    }
  }, [showQrScanner]);

  // UseEffect to cleanup QR Code scanner on component unmount
  useEffect (() => {
    return () => {
      stopQrScanner();
    }
  }, []);

  // UseEffect to check if user is already logged in || if token exists on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    // If token exists || already logged in, navigate to dashboard
    if (token) {
      navigate('/official/dashboard');
    }
  }, [navigate]);

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

            <div className="flex flex-col items-center justify-center mt-14">
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

              <button 
                type="button"
                onClick={toggleQrScanner}
                className="font-lexendReg text-lg text-gray-400 mx-auto mt-6 hover:cursor-pointer hover:text-customDarkBlue2 transition duration-500 ease-in-out"
              >
                {showQrScanner ? "Cancel QR Login" : "Login with QR Code?"}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* QR Scanner Overlay */}
      {showQrScanner && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="font-patuaOneReg text-2xl text-customDarkBlue2 mb-4 text-center">
              Please point your QR Code to the camera
            </h3>
            
            {/* Video element for the scanner */}
            <div className="w-full h-64 overflow-hidden rounded-lg mb-4 bg-gray-100 flex items-center justify-center">
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover"
              />
              {/* Scanning animation overlay */}
              <div className="absolute inset-0 border-2 -z-50 border-blue-500 rounded-lg opacity-50 animate-pulse" />
            </div>
            
            <div className="flex justify-center">
              <button
                type="button"
                onClick={toggleQrScanner}
                className="bg-customDarkBlue1 hover:bg-customDarkBlue2 hover:cursor-pointer text-white font-bold py-2 px-4 rounded-lg transition duration-500 ease-in-out"
                disabled={isQrProcessing}
              >
                {isQrProcessing ? "Processing..." :"Cancel and return to Login"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Login