import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/common/Navbar';
import { Route, Routes } from 'react-router-dom';
import Flight from './components/flight/Flight';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/flights' element={<Flight />}></Route>
      </Routes>
    </div>
  );
}

export default App;
