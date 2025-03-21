import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface SensorData {
    [key: string]: any; // Define la estructura de los datos que devuelven las APIs
}

function Graficos() {
    const { id_parcela } = useParams<{ id_parcela: string }>(); // Obtén el ID de la parcela desde la URL
    const [dataTodos, setDataTodos] = useState<SensorData | null>(null);
    const [dataPorHora, setDataPorHora] = useState<SensorData | null>(null);
    const [dataPorDia, setDataPorDia] = useState<SensorData | null>(null);
    const [error, setError] = useState<string | null>(null); // Estado para manejar errores

    useEffect(() => {
        const syncAndFetchData = async () => {
            try {
                // Sincroniza los datos
                const syncResponse = await fetch('http://localhost:8080/sync', { method: 'GET' });
                if (!syncResponse.ok) {
                    if (syncResponse.status === 404) {
                        throw new Error('Error 404: No se encontró el recurso para sincronizar.');
                    } else {
                        throw new Error(`Error ${syncResponse.status}: No se pudo sincronizar los datos.`);
                    }
                }

                // Obtén los datos de las APIs
                if (id_parcela) {
                    const todosResponse = await fetch(`http://localhost:8080/sensores/${id_parcela}/todos`);
                    if (!todosResponse.ok) {
                        throw new Error(`Error ${todosResponse.status}: No se pudieron obtener los datos "todos".`);
                    }
                    const todosData = await todosResponse.json();
                    setDataTodos(todosData);

                    const porHoraResponse = await fetch(`http://localhost:8080/sensores/${id_parcela}/por-hora`);
                    if (!porHoraResponse.ok) {
                        throw new Error(`Error ${porHoraResponse.status}: No se pudieron obtener los datos "por hora".`);
                    }
                    const porHoraData = await porHoraResponse.json();
                    setDataPorHora(porHoraData);

                    const porDiaResponse = await fetch(`http://localhost:8080/sensores/${id_parcela}/por-dia`);
                    if (!porDiaResponse.ok) {
                        throw new Error(`Error ${porDiaResponse.status}: No se pudieron obtener los datos "por día".`);
                    }
                    const porDiaData = await porDiaResponse.json();
                    setDataPorDia(porDiaData);
                }
            } catch (error: any) {
                console.error('Error al sincronizar o obtener los datos:', error);
                setError(error.message); // Guarda el mensaje de error en el estado
            }
        };

        // Llama a la función por primera vez
        syncAndFetchData();

        // Configura un intervalo para repetir el proceso cada 8 segundos
        const interval = setInterval(syncAndFetchData, 8000);

        // Limpia el intervalo cuando el componente se desmonte
        return () => clearInterval(interval);
    }, [id_parcela]);

    return (
        <div>
            <h1>Gráficos de la Parcela {id_parcela}</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>} {/* Muestra el error si existe */}
            <div>
                <h2>Datos Todos</h2>
                <pre>{JSON.stringify(dataTodos, null, 2)}</pre>
            </div>
            <div>
                <h2>Datos Por Hora</h2>
                <pre>{JSON.stringify(dataPorHora, null, 2)}</pre>
            </div>
            <div>
                <h2>Datos Por Día</h2>
                <pre>{JSON.stringify(dataPorDia, null, 2)}</pre>
            </div>
        </div>
    );
}

export default Graficos;