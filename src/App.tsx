import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PracticePage from './pages/PracticePage';
import ScenarioListPage from './pages/ScenarioListPage';
import './App.css';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/practice/:id" element={<PracticePage />} />
            <Route path="/scenarios" element={<ScenarioListPage />} /> 
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;