import { useEffect, useState } from "react";
import { salasService, reservasService } from "../Services/api";

export default function Dashboard({onLogout}){
    const [aba, setAba] = useState('salas');
    const [salas, setSalas] = useState([]);
    const [reservas, setReservas] = useState([]);

    const [idSala, setIdSala] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [descricao, setDescricao] = useState('');
    const [erroForm, setErroForm] = useState('');

    const carregarDados = async () => {
        try{ 
            const listaSalas = await salasService.listarTodas();
            setSalas(listaSalas);
            const listaReservas = await reservasService.listarTodas();
            setReservas(listaReservas);
        } catch(err){
           console.error('Erro ao carregar dados:', err);
        }
    };

    useEffect(() =>{
        carregarDados();
    }, []);

    const handleCriarReserva = async (e) => {
        e.preventDefault();
        setErroForm('');
        try{
            await reservasService.criar({
                id_sala: Number(idSala),
                data_inicio: dataInicio.replace('T', ' ') + ':00',
                data_fim: dataFim.replace('T', ' ') + ':00',
                descricao
            });
            alert('Reserva efetuada com sucesso!!');
            setAba('reservas');
            carregarDados();

            setIdSala(''); setDataInicio(''); setDataFim(''); setDescricao('');
        } catch(err) {
            setErroForm(err.message);
        }
    };

    return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
        <h1>Painel de Reservas</h1>
        <button onClick={onLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
      </header>

      {/* Menu de Abas */}
      <nav style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
        <button onClick={() => setAba('salas')} style={{ padding: '10px', backgroundColor: aba === 'salas' ? '#007bff' : '#f0f0f0', color: aba === 'salas' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Salas</button>
        <button onClick={() => setAba('reservas')} style={{ padding: '10px', backgroundColor: aba === 'reservas' ? '#007bff' : '#f0f0f0', color: aba === 'reservas' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Ver Reservas</button>
        <button onClick={() => setAba('nova-reserva')} style={{ padding: '10px', backgroundColor: aba === 'nova-reserva' ? '#007bff' : '#f0f0f0', color: aba === 'nova-reserva' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Nova Reserva</button>
      </nav>

      {/* Conteúdo dinâmico das Abas */}
      {aba === 'salas' && (
        <div>
          <h2>Salas Disponíveis</h2>
          <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: '1fr 1fr' }}>
            {salas.map(sala => (
              <div key={sala.id} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '6px' }}>
                <h3>{sala.nome}</h3>
                <p><strong>Localização:</strong> {sala.localizacao}</p>
                <p><strong>Capacidade:</strong> {sala.capacidade} lugares</p>
                {sala.descricao && <p><em>{sala.descricao}</em></p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {aba === 'reservas' && (
        <div>
          <h2>Histórico de Reservas</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Sala</th>
                <th style={{ padding: '10px' }}>Quem Reservou</th>
                <th style={{ padding: '10px' }}>Início</th>
                <th style={{ padding: '10px' }}>Fim</th>
                <th style={{ padding: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map(reserva => (
                <tr key={reserva.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '10px' }}>{reserva.sala_nome}</td>
                  <td style={{ padding: '10px' }}>{reserva.usuario_nome}</td>
                  <td style={{ padding: '10px' }}>{new Date(reserva.data_inicio).toLocaleString()}</td>
                  <td style={{ padding: '10px' }}>{new Date(reserva.data_fim).toLocaleString()}</td>
                  <td style={{ padding: '10px', color: reserva.status === 'ativa' ? 'green' : 'red', fontWeight: 'bold' }}>{reserva.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aba === 'nova-reserva' && (
        <div style={{ maxWidth: '500px' }}>
          <h2>Agendar uma Sala</h2>
          {erroForm && <p style={{ color: 'red', fontWeight: 'bold' }}>{erroForm}</p>}
          <form onSubmit={handleCriarReserva}>
            <div style={{ marginBottom: '12px' }}>
              <label>Escolha a Sala:</label>
              <select value={idSala} onChange={(e) => setIdSala(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                <option value="">-- Selecione uma sala --</option>
                {salas.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label>Data/Hora de Início:</label>
              <input type="datetime-local" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label>Data/Hora de Fim:</label>
              <input type="datetime-local" value={dataFim} onChange={(e) => setDataFim(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Descrição / Motivo:</label>
              <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', height: '60px' }} />
            </div>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Salvar Reserva</button>
          </form>
        </div>
      )}
    </div>
  );
}