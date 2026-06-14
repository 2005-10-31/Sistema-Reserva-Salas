const API_URL = 'http://localhost:3000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensagem || 'Erro ao fazer login');
    return data;
  },
  registar: async (nome, email, password, role = 'user') => {
    const response = await fetch(`${API_URL}/auth/registar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, password, role }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensagem || 'Erro ao registar');
    return data;
  }
};

export const salasService = {
  listarTodas: async () => {
    const response = await fetch(`${API_URL}/salas`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar salas');
    return response.json();
  }
};

export const reservasService = {
  listarTodas: async () => {
    const response = await fetch(`${API_URL}/reservas`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar reservas');
    return response.json();
  },
  criar: async (reservaDados) => {
    const response = await fetch(`${API_URL}/reservas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reservaDados),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.mensagem || 'Erro ao criar reserva');
    return data;
  }
};