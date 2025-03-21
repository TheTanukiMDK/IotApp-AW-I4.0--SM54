import React, { useEffect, useState } from 'react';

// Define la interfaz para las parcelas
interface Parcela {
    id: number;
    nombre: string;
    ubicacion: string;
    responsable: string;
    tipo_cultivo: string;
    humedad: number;
    temperatura: number;
    lluvia: number;
    sol: number;
    fecha_registro: string;
    hora_registro: string;
}

const Prueba = () => {
    const [parcelas, setParcelas] = useState<Parcela[]>([]);

    useEffect(() => {
        const syncAndFetchParcelas = async () => {
            try {
                // Primero sincroniza los datos
                await fetch('http://localhost:8080/sync', { method: 'POST' });

                // Luego obtiene los datos actualizados
                const response = await fetch('http://localhost:8080/parcelas');
                const data: Parcela[] = await response.json();
                setParcelas(data);
            } catch (error) {
                console.error('Error al sincronizar o obtener las parcelas:', error);
            }
        };

        // Llama a la función por primera vez
        syncAndFetchParcelas();

        // Configura un intervalo para repetir el proceso cada 5 segundos
        const interval = setInterval(syncAndFetchParcelas, 5000);

        // Limpia el intervalo cuando el componente se desmonte
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h1>Parcelas</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Ubicación</th>
                        <th>Responsable</th>
                        <th>Tipo de Cultivo</th>
                        <th>Humedad</th>
                        <th>Temperatura</th>
                        <th>Lluvia</th>
                        <th>Sol</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                    </tr>
                </thead>
                <tbody>
                    {parcelas.map((parcela) => (
                        <tr key={parcela.id}>
                            <td>{parcela.id}</td>
                            <td>{parcela.nombre}</td>
                            <td>{parcela.ubicacion}</td>
                            <td>{parcela.responsable}</td>
                            <td>{parcela.tipo_cultivo}</td>
                            <td>{parcela.humedad}</td>
                            <td>{parcela.temperatura}</td>
                            <td>{parcela.lluvia}</td>
                            <td>{parcela.sol}</td>
                            <td>{parcela.fecha_registro}</td>
                            <td>{parcela.hora_registro}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Prueba;