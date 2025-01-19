import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MapComponent from './components/templates/MapComponent';
import MissionModal from './components/templates/MissionModal';
import PolygonModal from './components/templates/PolygonModal';
import HomePage from './components/templates/HomePage';



function App() {
  return (
    <BrowserRouter>
        <Routes>

          <Route path='/' element = { < HomePage /> } />

          <Route path='/MapComponent' element = { < MapComponent /> } />

          <Route path='/mission-modal' element = { < MissionModal /> } />

          <Route path='/polygon-modal' element = { < PolygonModal /> }/>

        </Routes>
   </BrowserRouter>
  );
}

export default App;