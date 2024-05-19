import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import backgroundImage from './assests/bg1.jpg';

const Login = ({ setEmail }) => {
  const [email, setEmailState] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Attempting to login with:', { email, password });
    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        password,
      });
      const { token } = response.data;
      console.log('Server response:', response.data);
      console.log('Received Token:', token);
      localStorage.setItem('token', token); // Store token in localStorage
      localStorage.setItem('email', email); // Store email in localStorage
      setEmail(email); // Update email in App component's state
      setMessage('');
      navigate('/profile');
      window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
     <img 
    src={backgroundImage} 
    alt="Background" 
    className="absolute inset-0 object-cover w-full h-full -z-10"
  />
     
      
      <form className="flex flex-col w-full max-w-sm p-5 p-6 m-auto bg-white rounded rounded-lg shadow-md bg-opacity-30 bg-gradient-to-r from-blue-200 to-slate-200 backdrop-blur-lg drop-shadow-xl bg-slate-300" onSubmit={handleLogin}>
        <h2 className="mb-4 text-2xl font-bold">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full p-2 mt-1 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmailState(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full p-2 mt-1 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {message && <p className="mb-4 text-red-500 ">{message}</p>}
        <button className="w-full p-2 mb-4 text-white bg-blue-500 rounded" type="submit">Login</button>
        
        <p>New User ? 
          <Link className = "text-blue-500 " to ="/register"> Register</Link></p>
      </form>
    </div>
  );
};

export default Login;
