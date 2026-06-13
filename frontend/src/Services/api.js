const API_URL = 'http://localhost:3000;' 

// Função auxiliar para enviar o Token de Autenticação nas rotas protegidas
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const authService = {
  login: async (usuario, senha) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha }), // Ajuste as chaves conforme o seu middleware valida
    });
    if (!response.ok) throw new Error('Usuário ou senha inválidos');
    return response.json(); // Espera-se retornar { token: '...' }
  },
};

export const salasService = {
  listarTodas: async () => {
    const response = await fetch(`${API_URL}/salas`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar salas');
    return response.json();
  },
};