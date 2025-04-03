import React, { useState } from 'react';
import '../css/Login.css';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        // Verificar si los campos están vacíos o contienen solo espacios
        if (!email.trim() || !password.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos vacíos',
                text: 'Por favor, rellena todos los campos sin espacios en blanco',
            });
            return;
        }
    
        const res = await fetch('http://localhost:4000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email.trim(), password: password.trim() }),
        });
    
        const data = await res.json();
        if (res.ok) {
            // Guardar el token y nombre de usuario en el almacenamiento local
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);
            localStorage.setItem('email', data.user.email);
            //localStorage.setItem('profilePicture', data.user.profile_picture || '');
            localStorage.setItem('userId', data.user.id_user.toString()); // Guardar el ID del usuario
            // Redirigir al dashboard principal
            Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso',
                text: 'Redirigiendo al dashboard...',
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                navigate('/Dashboard');
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message,
            });
        }
    };

    return (
        <div className='fondo'>
            <div className='wrapper'>
                <form onSubmit={handleSubmit}>
                    <h1>Iniciar sesión</h1>
                    <div className='input-box'>
                        <input
                            type='text'
                            placeholder='Correo electrónico'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='input-box'>
                        <input
                            type='password'
                            placeholder='Contraseña'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className='button-1' type='submit'>Ingresar</button>
                    <div className='register-link'>
                        <p>¿No tienes cuenta? <a href='/Registro'>Regístrate</a></p>
                        {/*<p><a href=''>Olvide mi contraseña</a></p>*/}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;