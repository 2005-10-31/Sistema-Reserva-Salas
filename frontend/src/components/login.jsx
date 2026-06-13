import { useState } from "react";
import { authService } from "../Services/api";

export default function Login({onLoginSuccess}){
    const[usuario, setUsuario] = useState('');
    const[senha, setSenha] = useState('');
    const[erro, setErro] = useState('');

    const handleSubmit = async (e) => {
        e.preventDfault();
        try{
            const data = await authService.login(usuario, senha);
            localStorage.setItem('token', data.token);
            onLoginSuccess();
        }catch(err){
            setErro(err.message);
        }
    };

    return(
        <div style={{maxWidth: '400px', margin: '50px auto', padding:'20px', border:'1x solid #ccc'}}>
            <h2>Login</h2>
            {erro && <p style={{color: 'red'}}>erro</p>}
            <from onSubmit={handleSubmit}>
                <div>
                    <label>Usuario:</label>
                    <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} required style={{width:'100%', marginBottom:'10px'}}/>
                </div>
                <div>
                    <label>Senha:</label>
                    <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required style={{ width: '100%', marginBottom: '20px' }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px' }}>login</button>
            </from>
        </div>
    );
}