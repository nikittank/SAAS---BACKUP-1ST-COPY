import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="relative">
      <video className="absolute inset-0 z-0 object-cover min-h-screen" autoPlay loop muted>
        <source src="https://cdn.pixabay.com/video/2022/04/09/113368-697718069_large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 flex flex-col items-end justify-center min-h-screen px-8">
        <h1 className="mb-8 mr-4 text-5xl font-bold text-center text-white">
          Welcome to Yahoo Finance <br/> Revenue and Earnings <br/> Viewing Dashboard 
        </h1>
        <div className="flex flex-col items-end gap-8 mr-60">
          <Link to="/login">
            <button className="py-4 text-lg text-white bg-blue-600 rounded-lg px-9 hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
              Log In
            </button>
          </Link>
          <Link to="/register">
            <button className="px-8 py-4 text-lg text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:bg-green-600">
              Sign Up
            </button>
          </Link>
        </div>
        <p className="mt-8 mr-20 text-lg text-right text-white">
          Discover real-time stock prices and earnings data with ease.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
