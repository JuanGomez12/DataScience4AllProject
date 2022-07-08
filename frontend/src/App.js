/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navegationbar from './components/Navegationbar/Navegationbar';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import "./assets/plugins/nucleo/css/nucleo.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/css/argon-dashboard-react.css";

import AdminLayout from './layouts/AdminLayout';
import Homepage from './layouts/Homepage';
import Index from './pages/Index';

function App() {

  return (
    // <div className="App">
      <Router>
        {/* <Navegationbar></Navegationbar> */}
        <Routes>
          <Route path="/admin/*" element={<AdminLayout /> } />
          <Route path='/*' element={<Homepage/>}/>
          {/* <Route path="/*" element={<Homepage /> } /> */}
          {/* <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/predict' element={<Prediction/>}/> */}
        </Routes>
      </Router>
    // </div>
  );
}

export default App;
