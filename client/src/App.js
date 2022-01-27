import React, { Component } from "react";
import Navbar from './Navbar';
import { Outlet, Link } from "react-router-dom";

import './App.css';


class App extends Component {

  render() {
    return (
      <div className="App">
        <Navbar />
        <Outlet />
      </div>
    );
  }
}

export default App;