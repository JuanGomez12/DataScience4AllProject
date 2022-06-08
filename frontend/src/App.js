import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navegationbar from './components/Navegationbar/Navegationbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Navegationbar></Navegationbar>
        <Routes>
          <Route path='/' />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
