import Home from "./page/Home"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Players from "./page/Players";
import PlayerDetail from "./page/PlayerDetail";
import Leaderboard from "./page/Leaderboard";
import Sidebar from "./components/Sidebar";
import NavigationBar from "./components/NavigationBar";

const layout ={
    margin: '30px'
}

function App() {
  return (
    <Router>
      <NavigationBar />
      <div style={layout}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/players" element={<Players/>}/>
          <Route path="/players/:name" element={<PlayerDetail/>}/>
          <Route path="/leaderboard" element={<Leaderboard/>}/>
        </Routes>

      </div>
      {/* <Sidebar/> */}

    </Router>
  );
}

export default App;
