import { useState } from 'react';
import { authService } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [isRegisto, setIsRegisto] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ texto: '', tipo: '' });

    try {
      if (isRegisto) {
        await authService.registar(nome, email, password);
        setMensagem({ texto: 'Conta criada com sucesso! Faça o login.', tipo: 'sucesso' });
        setIsRegisto(false);
      } else {
        const data = await authService.login(email, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.usuario));
        onLoginSuccess();
      }
    } catch (err) {
      setMensagem({ texto: err.message, tipo: 'erro' });
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2>{isRegisto ? 'Criar Conta' : 'Login - Reserva de Salas'}</h2>
      
      {mensagem.texto && (
        <p style={{ color: { sucesso: 'green', erro: 'red' }[mensagem.tipo], fontWeight: 'bold' }}>
          {mensagem.texto}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {isRegisto && (
          <div style={{ marginBottom: '15px' }}>
            <label>Nome:</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>
        )}
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isRegisto ? 'Registar' : 'Entrar'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        {isRegisto ? 'Já tem uma conta?' : 'Ainda não tem conta?'} {' '}
        <span onClick={() => setIsRegisto(!isRegisto)} style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
          {isRegisto ? 'Faça Login' : 'Registe-se aqui'}
        </span>
      </p>
    </div>
  );
}