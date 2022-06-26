import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navegationbar from './components/Navegationbar/Navegationbar';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Router>
        <Navegationbar></Navegationbar>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/predict' element={<Prediction/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
