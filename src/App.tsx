import { Routes, Route } from 'react-router-dom'; 
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './app/page';
import PracticePage from './pages/PracticePage';
import ScenarioListPage from './app/scenarios/page';
import './App.css';

function App() {
  return (
    
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
    
  );
}

export default App;