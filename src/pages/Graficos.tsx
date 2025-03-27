import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Radar, Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    Filler
} from 'chart.js';
import Sidebar from '../components/Sidebar';
import HeaderGrafic from '../components/HeaderGrafic';
import '../css/Graficos.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    Filler
);
interface SensorData {
    fecha: string;
    hora: string;
    humedad: number;
    temperatura: number;
    lluvia: number;
    sol: number;
}

function Graficos() {
    const { id_parcela } = useParams<{ id_parcela: string }>();
    const [dataTodos, setDataTodos] = useState<SensorData | null>(null);
    const [dataPorHora, setDataPorHora] = useState<SensorData[]>([]);
    const [dataPorDia, setDataPorDia] = useState<SensorData[]>([]);
    const [nombreParcela, setNombreParcela] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const syncAndFetchData = async () => {
            try {
                const syncResponse = await fetch('http://localhost:8080/sync', { method: 'GET' });
                    if (!syncResponse.ok) {
                        throw new Error(`Error ${syncResponse.status}: No se pudo sincronizar los datos.`);
                    }

                if (id_parcela) {
                     // Obtener el nombre de la parcela
                     const parcelaResponse = await fetch(`http://localhost:8080/parcelas/${id_parcela}`);
                     if (!parcelaResponse.ok) {
                         throw new Error(`Error ${parcelaResponse.status}: No se pudo obtener el nombre de la parcela.`);
                     }
                     const parcelaData = await parcelaResponse.json();
                     setNombreParcela(parcelaData.nombre);

                    const todosResponse = await fetch(`http://localhost:8080/sensores/${id_parcela}/todos`);
                    if (!todosResponse.ok) {
                        throw new Error(`Error ${todosResponse.status}: No se pudieron obtener los datos "todos".`);
                    }
                    const todosData: SensorData[] = await todosResponse.json();
                    setDataTodos(todosData[todosData.length - 1]); // Solo el último dato

                    const porHoraResponse = await fetch(`http://localhost:8080/sensores/${id_parcela}/por-hora`);
                    if (!porHoraResponse.ok) {
                        throw new Error(`Error ${porHoraResponse.status}: No se pudieron obtener los datos "por hora".`);
                    }
                    const porHoraData: SensorData[] = await porHoraResponse.json();
                    setDataPorHora(porHoraData.slice(0,10)); // Todos los datos con limite de 10

                    const porDiaResponse = await fetch(`http://localhost:8080/sensores/${id_parcela}/por-dia`);
                    if (!porDiaResponse.ok) {
                        throw new Error(`Error ${porDiaResponse.status}: No se pudieron obtener los datos "por día".`);
                    }
                    const porDiaData: SensorData[] = await porDiaResponse.json();
                    setDataPorDia(porDiaData.slice(-7)); // Últimos 7 días
                }
            } catch (error: any) {
                console.error('Error al sincronizar o obtener los datos:', error);
                setError(error.message);
            }
        };

        syncAndFetchData();
        const interval = setInterval(syncAndFetchData, 10000);
        return () => clearInterval(interval);
    }, [id_parcela]);
    const radarData = dataTodos
    ? {
        labels: ['Humedad', 'Temperatura', 'Lluvia', 'Sol'],
        datasets: [
            {
                label: 'Datos de sensores',
                data: [dataTodos.humedad, dataTodos.temperatura, dataTodos.lluvia, dataTodos.sol],
                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Fondo entre las líneas
                borderColor: 'rgba(54, 162, 235, 1)', // Color de las líneas
                pointBackgroundColor: 'rgba(54, 162, 235, 1)', // Color de los puntos
                pointBorderColor: '#fff', // Borde de los puntos
                pointHoverBackgroundColor: '#fff', // Fondo de los puntos al pasar el mouse
                pointHoverBorderColor: 'rgba(54, 162, 235, 1)', // Borde de los puntos al pasar el mouse
                fill: true, // Habilitar el fondo entre las líneas
            },
        ],
    }
    : null;
    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false, // Evita problemas de redimensionamiento
        plugins: {
            legend: {
                display: true,
                position: 'top' as const, // Posición de la leyenda
                labels: {
                    font: {
                        size: 14, // Tamaño de la fuente de la leyenda
                    },
                    color: '#333', // Color del texto de la leyenda
                },
            },
        },
        scales: {
            r: {
                angleLines: {
                    color: 'rgba(0, 0, 0, 0.1)', // Color de las líneas angulares
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)', // Color de las líneas del grid
                },
                ticks: {
                    display: true, // Mostrar los números en el radar
                    color: '#666', // Color de los números
                    font: {
                        size: 1, // Tamaño de la fuente de los números
                    },
                },
                pointLabels: {
                    font: {
                        size: 14, // Tamaño de la fuente de las etiquetas
                    },
                    color: '#444', // Color de las etiquetas
                },
            },
        },
    };

    const lineData = {
        labels: dataPorHora.map((data) => data.hora),
        datasets: [
            {
                label: 'Humedad',
                data: dataPorHora.map((data) => data.humedad),
                borderColor: '#36A2EB',
                fill: false,
            },
            {
                label: 'Temperatura',
                data: dataPorHora.map((data) => data.temperatura),
                borderColor: '#FF6384',
                fill: false,
            },
            {
                label: 'Lluvia',
                data: dataPorHora.map((data) => data.lluvia),
                borderColor: '#FFCE56',
                fill: false,
            },
            {
                label: 'Sol',
                data: dataPorHora.map((data) => data.sol),
                borderColor: '#4BC0C0',
                fill: false,
            },
        ],
    };

    const barData = {
        labels: dataPorDia.map((data) => data.fecha),
        datasets: [
            {
                label: 'Humedad',
                data: dataPorDia.map((data) => data.humedad),
                backgroundColor: '#36A2EB',
            },
            {
                label: 'Temperatura',
                data: dataPorDia.map((data) => data.temperatura),
                backgroundColor: '#FF6384',
            },
            {
                label: 'Lluvia',
                data: dataPorDia.map((data) => data.lluvia),
                backgroundColor: '#FFCE56',
            },
            {
                label: 'Sol',
                data: dataPorDia.map((data) => data.sol),
                backgroundColor: '#4BC0C0',
            },
        ],
    };

    return (
        <div className="graficos">
            <HeaderGrafic></HeaderGrafic>
            <Sidebar></Sidebar>
            <div className="contenido">
                <h1 style={{ textAlign: 'center' }}>{nombreParcela}</h1>
                <h2 style={{ textAlign: 'center' }}>Datos Historicos de Sensores</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="card-graficos">
                    <h2>Datos de sensores</h2>
                    {radarData ? (
                        <div className="chart-container" style={{ width: '400px', height: '400px' }}>
                            <Radar data={radarData} options={radarOptions} />
                        </div>
                    ) : (
                        <p>No hay datos disponibles.</p>
                    )}
                </div>

                <div className="card-graficos">
                    <h2>Datos Por Hora</h2>
                    {dataPorHora.length > 0 ? (
                        <div className="chart-container" style={{ width: '900px', height: '600px' }}>
                            <Line data={lineData} />
                        </div>
                    ) : (
                        <p>No hay datos disponibles.</p>
                    )}
                </div>

                <div className="card-graficos">
                    <h2>Últimos 7 Días</h2>
                    {dataPorDia.length > 0 ? (
                        <div className="chart-container" style={{ width: '700px', height: '400px' }}>
                            <Bar data={barData} />
                        </div>
                    ) : (
                        <p>No hay datos disponibles.</p>
                    )}
                </div>
            </div>

        </div>
    );
}

export default Graficos;