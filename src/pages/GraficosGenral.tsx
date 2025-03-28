import React, { useEffect, useState } from 'react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
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
    const [porcentajeHumedad, setPorcentajeHumedad] = useState<number | null>(null);
    const [dataPorHora, setDataPorHora] = useState<SensorData[]>([]);
    const [dataPorDia, setDataPorDia] = useState<SensorData[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const syncResponse = await fetch('http://localhost:8080/sync', { method: 'GET' });
                if (!syncResponse.ok) {
                    throw new Error(`Error ${syncResponse.status}: No se pudo sincronizar los datos.`);
                }
                const humedadResponse = await fetch(
                    'http://localhost:8080/sensores-generales/porcentaje-humedad'
                );
                if (!humedadResponse.ok) {
                    throw new Error(`Error ${humedadResponse.status}: No se pudo obtener el porcentaje de humedad.`);
                }
                const humedadData = await humedadResponse.json();
                setPorcentajeHumedad(humedadData.porcentaje_humedad);

                const porHoraResponse = await fetch('http://localhost:8080/sensores-generales/por-hora');
                if (!porHoraResponse.ok) {
                    throw new Error(`Error ${porHoraResponse.status}: No se pudieron obtener los datos "por hora".`);
                }
                const porHoraData: SensorData[] = await porHoraResponse.json();
                setDataPorHora(porHoraData.slice(0, 10)); // Todos los datos con límite de 10

                const porDiaResponse = await fetch('http://localhost:8080/sensores-generales/por-dia');
                if (!porDiaResponse.ok) {
                    throw new Error(`Error ${porDiaResponse.status}: No se pudieron obtener los datos "por día".`);
                }
                const porDiaData: SensorData[] = await porDiaResponse.json();
                setDataPorDia(porDiaData.slice(-7)); // Últimos 7 días
            } catch (error: any) {
                console.error('Error al obtener los datos:', error);
                setError(error.message);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 100000);
        return () => clearInterval(interval);
    }, []);

    const doughnutData = porcentajeHumedad !== null
        ? {
            labels: ['Humedad', 'Resto'],
            datasets: [
                {
                    data: [porcentajeHumedad, 100 - porcentajeHumedad],
                    backgroundColor: ['#36A2EB', '#FFCE56'],
                    hoverBackgroundColor: ['#36A2EB', '#FFCE56'],
                },
            ],
        }
        : null;

    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
                labels: {
                    font: {
                        size: 14,
                    },
                    color: '#333',
                },
            },
        },
        scales: {
            r: {
                angleLines: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    display: true,
                    color: '#666',
                    font: {
                        size: 1,
                    },
                },
                pointLabels: {
                    font: {
                        size: 14,
                    },
                    color: '#444',
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
                <h1 style={{ textAlign: 'center' }}>Datos Generales</h1>
                <h2 style={{ textAlign: 'center' }}>Datos Históricos</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="card-graficos">
                    <h2>Porcentaje de humedad</h2>
                    {doughnutData ? (
                        <div className="chart-container" style={{ width: '400px', height: '400px' }}>
                            <Doughnut data={doughnutData} />
                        </div>
                    ) : (
                        <p>No hay datos disponibles.</p>
                    )}
                </div>

                <div className="card-graficos">
                    <h2>Datos de sensores por hora</h2>
                    {dataPorHora.length > 0 ? (
                        <div className="chart-container" style={{ width: '900px', height: '600px' }}>
                            <Line data={lineData} />
                        </div>
                    ) : (
                        <p>No hay datos disponibles.</p>
                    )}
                </div>

                <div className="card-graficos">
                    <h2>Datos de sensores los Últimos 7 Días</h2>
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