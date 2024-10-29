/*
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './modules/public/home.tsx';
import Login from './modules/auth/pages/LoginPage.tsx';
import Register from'./modules/auth/pages/RegisterPage.tsx';
import AuthGuard from './modules/auth/components/AuthGuard.tsx';
import MenuPage from './modules/public/pages/MenuPage.tsx';
import CreateCompetitionPage from './modules/competitions/pages/CreateCompetitionPage.tsx';
import OnlineCompetitionMenuPage from './modules/competitions/pages/OnlineCompetitionMenuPage.tsx';
import CompetitionLobbyPage from './modules/competitions/pages/CompetitionLobbyPage.tsx';
import JoinOnlineCompetitionPage from "./modules/competitions/pages/JoinOnlineCompetitionPage.tsx";
import OnlineCompetitionPage from "./modules/competitions/pages/OnineCompetitionPage.tsx";

import {AuthProvider} from "./modules/auth/context/AuthContext.tsx";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/auth/login" element={<Login />} />
                        <Route path="/auth/register" element={<Register />} />

                        {/* Rutas protegidas por el AuthGuard */}
                        <Route element={<AuthGuard />}>
                            <Route path="/home" element={<Home />} />
                            <Route path="/menu" element={<MenuPage />} />

                            {/*Rutas de competiciones*/}
                            <Route path="/OnlineCompetitionMenu" element={<OnlineCompetitionMenuPage />}/>
                            <Route path="/CreateCompetition" element={<CreateCompetitionPage />} />
                            <Route path="/CompetitionLobby" element={<CompetitionLobbyPage />} />
                            <Route path="/JoinCompetition" element={<JoinOnlineCompetitionPage />} />
                            <Route path="/Competition/Start" element={<OnlineCompetitionPage />} />
                        </Route>
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
