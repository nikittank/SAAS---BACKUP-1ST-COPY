import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';

const Profile = ({ email }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You need to log in to view your profile.');
        setLoading(false);
        return;
      }

      try {
        const userEmail = email || localStorage.getItem('email');
        if (!userEmail) {
          setMessage('Email is not defined.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:3000/profile/${userEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setMessage('Failed to fetch user profile.');
        setLoading(false);
      }
    };

    const fetchStockData = async () => {
      const url = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?symbol=AMRN&region=US';
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'bad3edb43bmsh28315387d25575ep15f23ajsn4f6fad265604',
          'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();

        const totalRevenue = result?.financialData?.totalRevenue?.raw || null;
        const earningsData = result?.earnings?.earningsData?.[0]?.raw || null;

        setChartData({
          labels: ['Total Revenue', 'Earnings Data'],
          datasets: [
            {
              label: 'Revenue',
              data: [totalRevenue !== null ? totalRevenue : 305690246, null],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            },
            {
              label: 'Earnings',
              data: [null, earningsData !== null ? earningsData : 95690246],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }
          ]
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setMessage('Failed to fetch stock data.');
        setLoading(false);
      }
    };

    fetchUserProfile();
    setTimeout(() => fetchStockData(), 500); // Adding timeout before fetching stock data
  }, [email]);

  useEffect(() => {
    if (chartData) {
      setTimeout(() => renderChart(chartData), 500); // Adding timeout before rendering the chart
    }
  }, [chartData]);

  const renderChart = (chartData) => {
    const ctx = document.getElementById('stockChart');
    if (!ctx) {
      console.error('Canvas element not found');
      return;
    }

    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Category'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Amount (in USD)'
            }
          }
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 bg-blue-700 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-blue-700 rounded-full animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-4 h-4 bg-blue-700 rounded-full animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>
    );
  }

  if (message) {
    return <p>{message}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  const dateOfBirth = new Date(user.date_of_birth).toLocaleDateString('en-UK', { day: '2-digit', month: 'short', year: 'numeric' });
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 md:flex-row">
      {/* Personal Details */}
      <div className="relative w-full p-8 m-4 text-left bg-blue-100 rounded-lg shadow-lg md:w-1/2">
        <h1 className="mb-6 ml-10 text-3xl font-semibold text-slate-900">
          Hello <span className="animate-waving-hand">👋🏻</span>, {user.name}
        </h1>

        {/* Conditionally rendering the image based on gender */}
        {user.gender === 'Female' && (
          <img className="absolute top-0 right-0 object-cover w-64 h-64 mt-20 mr-40 rounded-sm" src="https://wallpapercave.com/wp/wp5626922.jpg" alt="Female Avatar" />
        )}
        {user.gender === 'Male' && (
          <img className="absolute top-0 right-0 object-cover w-64 h-64 mt-20 mr-40 rounded-sm" src="https://wallpapers-clan.com/wp-content/uploads/2023/01/anime-aesthetic-boy-pfp-1.jpg" alt="Male Avatar" />
        )}

        <ul className='ml-12'>
          <li className="mb-4 text-lg"><strong>Name:</strong> {user.name}</li>
          <li className="mb-4 text-lg"><strong>Email:</strong> {user.email}</li>
          <li className="mb-4 text-lg"><strong>Contact:</strong> {user.contact_number}</li>
          <li className="mb-4 text-lg"><strong>Gender:</strong> {user.gender}</li>
          <li className="mb-4 text-lg"><strong>Date of Birth:</strong> {dateOfBirth}</li>
          <li className="mb-4 text-lg"><strong>Company:</strong> {user.company}</li>
        </ul>

        <Link className="text-blue-500" to="/login">
          <button className="w-40 p-4 mt-6 ml-12 text-white bg-blue-500 rounded-lg">Logout</button>
        </Link>
      </div>

      {/* Chart */}
      <div className="w-full m-4 bg-gray-100 rounded-lg md:w-1/2">
        <div className="p-6">
          <h2 className="mb-6 text-2xl font-bold">Yahoo Finance Realtime Stock Price Revenue and Earnings Data</h2>
          <canvas id="stockChart" width="800" height="600"></canvas>
        </div>
      </div>
    </div>
  );
};

export default Profile;
