import { useState } from 'react';
import Login from './components/login';
import Dashboard from './components/Dashboard';

export default function App() {
  // O estado inicial verifica se já existe um token salvo no navegador
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}