import logo from './logo.svg';
import './App.css';
import CurrentLocation from './Components/CurrentLocation/CurrentLocation';
import React from 'react';

function App() {
  return (
    <React.Fragment>
     <div className="container">
     <CurrentLocation/>
     </div>
    </React.Fragment>
    
  );
}

export default App;
