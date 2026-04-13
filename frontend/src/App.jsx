import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import ScenarioIntakeForm from './components/ScenarioIntakeForm';
import StrategyView from './components/StrategyView';
import RoleplayChat from './components/RoleplayChat';
import SessionSummary from './components/SessionSummary';

function Header() {
  return (
    <header className="app-header">
      <div>
        <h1>🤝 NegotiateAI</h1>
        <p>Your personal negotiation coach</p>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<ScenarioIntakeForm />} />
          <Route path="/strategy" element={<StrategyView />} />
          <Route path="/roleplay" element={<RoleplayChat />} />
          <Route path="/summary" element={<SessionSummary />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
}
