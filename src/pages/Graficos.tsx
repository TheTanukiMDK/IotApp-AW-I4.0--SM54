import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import CardTemp from '../components/CardTemp';
import CardHum from '../components/CardHum';
import Cardlluvia from '../components/Cardlluvia';
import CardSol from '../components/CardSol';
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
    const [isLoading, setIsLoading] = useState(true); // Nuevo estado para controlar la carga
    const [porcentajeHumedad, setPorcentajeHumedad] = useState<number | null>(null);
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

                    // Obtener el porcentaje de humedad
                    const humedadResponse = await fetch(`http://localhost:8080/sensores/${id_parcela}/porcentaje-humedad`);
                    if (!humedadResponse.ok) {
                        throw new Error(`Error ${humedadResponse.status}: No se pudo obtener el porcentaje de humedad.`);
                    }
                    const humedadData = await humedadResponse.json();
                    setPorcentajeHumedad(humedadData.porcentaje_humedad);

                    // Obtener datos por hora
                    const porHoraResponse = await fetch(`http://localhost:8080/sensores/${id_parcela}/por-hora`);
                    if (!porHoraResponse.ok) {
                        throw new Error(`Error ${porHoraResponse.status}: No se pudieron obtener los datos "por hora".`);
                    }
                    const porHoraData: SensorData[] = await porHoraResponse.json();
                    setDataPorHora(porHoraData.slice(0, 10)); // Todos los datos con limite de 10

                    // Obtener datos por día
                    const porDiaResponse = await fetch(`http://localhost:8080/sensores/${id_parcela}/por-dia`);
                    if (!porDiaResponse.ok) {
                        throw new Error(`Error ${porDiaResponse.status}: No se pudieron obtener los datos "por día".`);
                    }
                    const porDiaData: SensorData[] = await porDiaResponse.json();
                    setDataPorDia(porDiaData.slice(0, 7)); // Últimos 7 días
                }

                setIsLoading(false); // Cambiar el estado de carga a falso cuando los datos estén listos
            } catch (error: any) {
                console.error('Error al sincronizar o obtener los datos:', error);
                setError(error.message);
                setIsLoading(false); // Asegurarse de que el estado de carga se actualice incluso si hay un error
            }
        };

        syncAndFetchData();
        const interval = setInterval(syncAndFetchData, 100000);
        return () => clearInterval(interval);
    }, [id_parcela]);

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
        <div className="graficos">
            <HeaderGrafic></HeaderGrafic>
            <Sidebar></Sidebar>
            <div className="contenido">
                {isLoading ? (
                    <div className="loading-container" style={{ textAlign: 'center', marginTop: '20%' }}>
                        <h2>Cargando datos...</h2>
                    </div>
                ) : (
                    <>
                        <h1 style={{ marginLeft: '52%' }}>{nombreParcela}</h1>
                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        {/* Contenedor de las Cards */}
                        <div className="cards-section">
                            {dataPorHora.length > 0 ? (
                                <>
                                    <CardTemp temperatura={dataPorHora[0].temperatura} />
                                    <CardHum humedad={dataPorHora[0].humedad} />
                                    <Cardlluvia lluvia={dataPorHora[0].lluvia} />
                                    <CardSol sol={dataPorHora[0].sol} />
                                </>
                            ) : (
                                <p>Cargando datos de la parcela...</p>
                            )}
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
                    </>
                )}
            </div>
        </div>
    );
}

export default Graficos;