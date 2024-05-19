import {BrowserRouter , Routes, Route} from 'react-router-dom'
import React, { useState } from 'react'
import Home from './elements/Home'
import Login from './elements/Login'
import Register from './elements/Register'
import Profile from './elements/Profile'

const App = () => {
  const [email, setEmail] = useState('');
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login setEmail={setEmail} />} />
          <Route path='/profile' element={<Profile email={email}/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App;
