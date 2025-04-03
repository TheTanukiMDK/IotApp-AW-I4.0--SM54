import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import '../css/PerfilUser.css';

function PerfilUser() {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    //const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    //const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        // Obtener los datos del usuario desde localStorage
        const storedUsername = localStorage.getItem('username');
        const storedEmail = localStorage.getItem('email');
        //const storedProfilePicture = localStorage.getItem('profilePicture'); // Si tienes la imagen guardada
        if (storedUsername) setUsername(storedUsername);
        if (storedEmail) setEmail(storedEmail);
        //if (storedProfilePicture) setProfilePicture(storedProfilePicture);
    }, []);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId'); // Asegúrate de guardar el ID del usuario en localStorage
    
        // Validar que los campos de nombre y correo no estén vacíos
        if (!username.trim() || !email.trim()) {
            Swal.fire('Advertencia', 'No se puede dejar campos vacios', 'warning');
            return;
        }
    
        if (!userId) {
            Swal.fire('Error', 'No se encontró el ID del usuario.', 'error');
            return;
        }
    
        const response = await fetch('http://localhost:4000/api/updateUser', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: parseInt(userId),
                username,
                email,
            }),
        });
    
        if (response.ok) {
            Swal.fire('Éxito', 'Datos actualizados correctamente.', 'success');
            localStorage.setItem('username', username);
            localStorage.setItem('email', email);
        } else {
            Swal.fire('Error', 'Error al actualizar los datos.', 'error');
        }
    };
    
    const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId'); // Obtener el userId desde localStorage
    
        if (!userId) {
            Swal.fire('Error', 'No se encontró el ID del usuario.', 'error');
            return;
        }
    
        if (!currentPassword.trim()) {
            Swal.fire('Advertencia', 'Por favor, ingresa tu contraseña actual.', 'warning');
            return;
        }
    
        if (newPassword.length < 8) {
            Swal.fire('Advertencia', 'La nueva contraseña debe tener al menos 8 caracteres.', 'warning');
            return;
        }
    
        const response = await fetch('http://localhost:4000/api/updateUser', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: parseInt(userId),
                currentPassword,
                newPassword,
            }),
        });
    
        if (response.ok) {
            Swal.fire('Éxito', 'Contraseña actualizada correctamente.', 'success');
            setCurrentPassword('');
            setNewPassword('');
        } else {
            const errorData = await response.json();
            Swal.fire('Error', `Error al actualizar la contraseña: ${errorData.message}`, 'error');
        }
    };

    /*     const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                const formData = new FormData();
                formData.append('image', file);
        
                try {
                    const response = await fetch('http://localhost:4000/api/updateUser', {
                        method: 'POST',
                        body: formData,
                    });
        
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Imagen subida:', data.imageUrl);
                        setProfilePicture(data.imageUrl); // Actualiza el estado con la URL de la imagen
                        localStorage.setItem('profilePicture', data.imageUrl); // Guarda la URL en localStorage
                    } else {
                        alert('Error al subir la imagen');
                    }
                } catch (error) {
                    console.error('Error al subir la imagen:', error);
                }
            }
        };
    
        const handleImageClick = () => {
            // Simular un clic en el input de tipo file
            fileInputRef.current?.click();
        };
    
        const handleSavePhoto = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('No se encontró el ID del usuario.');
                return;
            }
    
            const response = await fetch('http://localhost:4000/api/updateUser', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: parseInt(userId),
                    profilePicture,
                }),
            });
    
            if (response.ok) {
                alert('Foto de perfil actualizada correctamente.');
                if (profilePicture) localStorage.setItem('profilePicture', profilePicture);
            } else {
                alert('Error al actualizar la foto de perfil.');
            }
        }; */

    return (
        <>
            <Header title="Perfil de usuario"></Header>
            <Sidebar></Sidebar>
            <section className="profile-user">
                <div className="profile-container">
                    {/* <div className="foto-contenedor">
                        <div className="avatar" >
                            <div onClick={handleImageClick}>
                                <img
                                    src={profilePicture || '/assets/img/default-profile.jpg'}
                                    alt="Foto de perfil"
                                    className="profile-image"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef} // Referencia al input
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }} // Ocultar el input
                                />
                            </div>
                            <button className="save-photo" onClick={handleSavePhoto}>
                                Guardar cambios
                            </button>
                        </div>

                    </div> */}
                    <div className="info-contenedor">
                        <div>
                            <form className="form-update" onSubmit={handleSave}>
                                <h2>Información personal</h2>
                                <label htmlFor="name">Nombre</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Tu nombre"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />

                                <label htmlFor="email">Correo electrónico</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Tu correo"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button type="submit">Actualizar</button>
                            </form>

                            <form className="form-update" onSubmit={handlePasswordUpdate}>
                                <h2 className="title-update">Actualizar contraseña</h2>
                                <label htmlFor="password">Contraseña actual</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Contraseña actual"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                                <label htmlFor="new-password">Nueva contraseña</label>
                                <input
                                    type="password"
                                    id="new-password"
                                    name="new-password"
                                    placeholder="Nueva contraseña"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button type="submit">Actualizar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default PerfilUser;