import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../css/Dashboard.css';
import CardHum from '../components/CardHum';
import CardTemp from '../components/CardTemp';
import Cardlluvia from '../components/Cardlluvia';
import CardSol from '../components/CardSol';
import mapboxgl from 'mapbox-gl';
import { useNavigate } from 'react-router-dom';
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

import 'mapbox-gl/dist/mapbox-gl.css';
import '../css/MapBox.css';

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

interface Sensores {
    temperatura: number;
    humedad: number;
    lluvia: number;
    sol: number;
}

interface Parcela {
    id: number;
    nombre: string;
    latitud: number;
    longitud: number;
    responsable: string;
    tipo_cultivo: string;
    sensor: {
        temperatura: number;
        humedad: number;
        lluvia: number;
        sol: number;
    };
}

interface SensorData {
    fecha: string;
    hora: string;
    humedad: number;
    temperatura: number;
    lluvia: number;
    sol: number;
}

function Dashboard() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    const [parcelas, setParcelas] = useState<Parcela[]>([]);
    const [parcelaSeleccionada, setParcelaSeleccionada] = useState<Parcela | null>(null);
    const [sensores, setSensores] = useState<Sensores | null>(null);

    const [porcentajeHumedad, setPorcentajeHumedad] = useState<number | null>(null);
    const [dataPorHora, setDataPorHora] = useState<SensorData[]>([]);
    const [dataPorDia, setDataPorDia] = useState<SensorData[]>([]);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYWRpYXZhbmlhIiwiYSI6ImNtODdkNTM3azBlNTUyanBzeDI4ZWk0MjcifQ.eTmoY78COUVLrNAZWdyPKA';

        if (mapContainerRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [-74.5, 40],
                zoom: 9,
            });
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);

    useEffect(() => {
        fetch('https://moriahmkt.com/iotapp/test/')
            .then((response) => response.json())
            .then((data) => {
                setParcelas(data.parcelas);
                setParcelaSeleccionada(data.parcelas[0]);
                setSensores(data.sensores);
            })
            .catch((error) => console.error('Error al obtener los datos:', error));
    }, []);

    useEffect(() => {
        if (mapRef.current && parcelas.length > 0) {
            markersRef.current.forEach((marker) => marker.remove());
            markersRef.current = [];

            const bounds = new mapboxgl.LngLatBounds();

            parcelas.forEach((parcela) => {
                const { latitud, longitud, nombre, responsable, tipo_cultivo, id, sensor } = parcela;

                bounds.extend([longitud, latitud]);

                const popup = new mapboxgl.Popup({ 
                    offset: 25,
                    anchor: 'left',
                 })
                    .setHTML(`
                       <div style="
            font-size: 14px; 
            line-height: 1.6; 
            font-family: Arial, sans-serif; 
            color: #333; 
            padding: 10px; 
            border-radius: 8px; 
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2); 
            background-color: #fff;
        ">
            <h3 style="margin: 0 0 8px; font-size: 16px; color: #007BFF;">${nombre}</h3>
            <p style="margin: 0; font-weight: bold;">Responsable:</p>
            <p style="margin: 0 0 8px;">${responsable}</p>
            <p style="margin: 0; font-weight: bold;">Cultivo:</p>
            <p style="margin: 0 0 8px;">${tipo_cultivo}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 8px 0;" />
            <h4 style="margin: 0 0 8px; font-size: 14px; color: #555;">Datos de Sensores:</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li><strong>Temperatura:</strong> ${sensor.temperatura} °C</li>
                <li><strong>Humedad:</strong> ${sensor.humedad} %</li>
                <li><strong>Lluvia:</strong> ${sensor.lluvia} mm</li>
                <li><strong>Sol:</strong> ${sensor.sol} W/m²</li>
            </ul>
            <button 
                class="graf-btn" 
                data-id="${id}" 
                style="
                    margin-top: 10px; 
                    padding: 8px 12px; 
                    font-size: 14px; 
                    color: #fff; 
                    background-color: #007BFF; 
                    border: none; 
                    border-radius: 4px; 
                    cursor: pointer;
                "
            >
                Ver Histórico
            </button>
        </div>
                    `);

                const marker = new mapboxgl.Marker()
                    .setLngLat([longitud, latitud])
                    .setPopup(popup)
                    .addTo(mapRef.current!);

                markersRef.current.push(marker);

                marker.getElement().addEventListener('click', () => {
                    setParcelaSeleccionada(parcela);
                });

                popup.on('open', () => {
                    const button = document.querySelector(`.graf-btn[data-id="${id}"]`);
                    if (button) {
                        button.addEventListener('click', () => {
                            navigate(`/graficos/${id}`);
                        });
                    }
                });
            });

            mapRef.current.fitBounds(bounds, { padding: 50 });
        }
    }, [parcelas]);

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
                setDataPorHora(porHoraData.slice(0, 10));

                const porDiaResponse = await fetch('http://localhost:8080/sensores-generales/por-dia');
                if (!porDiaResponse.ok) {
                    throw new Error(`Error ${porDiaResponse.status}: No se pudieron obtener los datos "por día".`);
                }
                const porDiaData: SensorData[] = await porDiaResponse.json();
                setDataPorDia(porDiaData.slice(-7));
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
        <>
            <div className="dashboard">
                <Header />
                <Sidebar />
                <main className="main-content">
                    <div className="container-map-cards">
                        <section className="map-and-cards">
                            <div className="map">
                                <div ref={mapContainerRef} className="map-container" />
                            </div>
                            <div className="cards">
                                {sensores ? (
                                    <>
                                        <CardTemp temperatura={sensores.temperatura} />
                                        <CardHum humedad={sensores.humedad} />
                                        <Cardlluvia lluvia={sensores.lluvia} />
                                        <CardSol sol={sensores.sol} />
                                    </>
                                ) : (
                                    <p>Cargando datos de sensores...</p>
                                )}
                            </div>
                        </section>
                    </div>
                    <section className="graficos-section">
                        <div className="grafico-container">
                            <h2>Porcentaje de Humedad</h2>
                            {doughnutData ? (
                                <div className="chart-container" style={{ width: '300px', height: '400px' }}>
                                    <Doughnut data={doughnutData} />
                                </div>
                            ) : (
                                <p>No hay datos disponibles.</p>
                            )}
                        </div>

                        <div className="grafico-container">
                            <h2>Datos de Sensores por Hora</h2>
                            {dataPorHora.length > 0 ? (
                                <div className="chart-container" style={{ width: '700px', height: '400px' }}>
                                    <Line data={lineData} />
                                </div>
                            ) : (
                                <p>No hay datos disponibles.</p>
                            )}
                        </div>

                        <div className="grafico-container">
                            <h2>Datos de Sensores los Últimos 7 Días</h2>
                            {dataPorDia.length > 0 ? (
                                <div className="chart-container" style={{ width: '600px', height: '400px' }}>
                                    <Bar data={barData} />
                                </div>
                            ) : (
                                <p>No hay datos disponibles.</p>
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}

export default Dashboard;