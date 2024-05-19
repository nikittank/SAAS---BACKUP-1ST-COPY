import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import backgroundImage from './assests/bg1.jpg'; // Ensure this path is correct

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contact_number, setContact] = useState('');
  const [gender, setGender] = useState('Male');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!validateEmail(email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.';
    }
    if (!name) {
      newErrors.name = 'Name is required.';
    }
    if (!contact_number) {
      newErrors.contact_number = 'Contact is required.';
    }
    if (contact_number.length !== 10) {
      newErrors.contact_number = 'Contact number must be exactly 10 digits.';
    }
    if (!dateOfBirth) {
      newErrors.dateOfBirth = 'Date of Birth is required.';
    }
    if (!company) {
      newErrors.company = 'Company is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/register', {
        email,
        password,
        name,
        contact_number,
        gender,
        date_of_birth: dateOfBirth,
        company
      });
      console.log('Registration Response:', response);
      if (response.status === 201) {
        // Store the token and user email in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', email);
        setMessage(response.data.message);
        navigate('/profile');
        window.location.reload();
        
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setMessage('Error registering user');
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      <img 
        src={backgroundImage} 
        alt="Background" 
        className="absolute inset-0 object-cover w-full h-full -z-10"
      />
      <div className="relative flex flex-col w-full max-w-sm p-5 m-auto rounded-lg bg-opacity-30 bg-gradient-to-r from-blue-200 to-slate-200 backdrop-blur-lg drop-shadow-xl bg-slate-300">
        <h2 className="mt-4 mb-6 text-2xl font-bold">Register</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">Contact</label>
            <input
              type="tel"
              value={contact_number}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
            {errors.contact_number && <p className="text-sm text-red-500">{errors.contact_number}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
            {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
          </div>
          <button type="submit" className="w-full p-2 mb-4 text-white transition ease-in-out bg-blue-500 rounded delay-250 hover:scale-105">Register</button>
          <p>Already Registered? 
          <Link className="text-blue-500" to="/login"> Login</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Register;
