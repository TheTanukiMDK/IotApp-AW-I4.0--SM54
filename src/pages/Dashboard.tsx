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

import 'mapbox-gl/dist/mapbox-gl.css';
import '../css/MapBox.css';

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

function Dashboard() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);

    const [parcelas, setParcelas] = useState<Parcela[]>([]);
    const [parcelaSeleccionada, setParcelaSeleccionada] = useState<Parcela | null>(null);
    const [sensores, setSensores] = useState<Sensores | null>(null); // Estado para los datos de sensores

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
        // Consumir la API para obtener parcelas y sensores
        fetch('https://moriahmkt.com/iotapp/test/')
            .then((response) => response.json())
            .then((data) => {
                setParcelas(data.parcelas); // Asume que la API devuelve un array de parcelas
                setParcelaSeleccionada(data.parcelas[0]); // Seleccionar la primera parcela por defecto
                setSensores(data.sensores); // Asume que la API devuelve un objeto con los datos de sensores
            })
            .catch((error) => console.error('Error al obtener los datos:', error));
    }, []);

    const markersRef = useRef<mapboxgl.Marker[]>([]); // Array para almacenar los marcadores

    useEffect(() => {
        if (mapRef.current && parcelas.length > 0) {
            // Limpiar marcadores existentes
            markersRef.current.forEach((marker) => marker.remove());
            markersRef.current = []; // Vaciar el array de marcadores
    
            // Crear un array de coordenadas [longitud, latitud] para todas las parcelas
            const bounds = new mapboxgl.LngLatBounds();
    
            parcelas.forEach((parcela) => {
                const { latitud, longitud, nombre, responsable, tipo_cultivo } = parcela;
    
                // Agregar cada coordenada al límite del mapa
                bounds.extend([longitud, latitud]);
    
                // Crear un popup con la información de la parcela
                const popup = new mapboxgl.Popup({ offset: 25 }) // Offset para que no cubra el marcador
                    .setHTML(`
                        <div style="font-size: 12px; line-height: 1.4;">
                            <strong>${nombre}</strong><br />
                            Responsable: ${responsable}<br />
                            Cultivo: ${tipo_cultivo}
                        </div>
                    `);
    
                const marker = new mapboxgl.Marker()
                    .setLngLat([longitud, latitud])
                    .setPopup(popup) // Asociar el popup al marcador
                    .addTo(mapRef.current!);
    
                // Guardar el marcador en el array
                markersRef.current.push(marker);
    
                // Asociar evento de clic para mostrar información de la parcela
                marker.getElement().addEventListener('click', () => {
                    setParcelaSeleccionada(parcela);
                });
            });
    
            // Ajustar el mapa para que muestre todas las parcelas
            mapRef.current.fitBounds(bounds, { padding: 50 });
        }
    }, [parcelas, mapRef.current]);

    const navigate = useNavigate();

    const handleVerGraficos = () => {
        if (parcelaSeleccionada) {
            navigate(`/graficos/${parcelaSeleccionada.id}`); // Redirige a la página de gráficos con el ID de la parcela
        }
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
                    <section className="select-and-parcel">
                        <div className="select-info">
                            
                        </div>
                        {parcelaSeleccionada && (
                            <div className="parcel-info">
                                <div className="card-parcel">
                                    <h3>Información de la Parcela</h3>
                                    <p>Nombre: {parcelaSeleccionada.nombre}</p>
                                    <p>Responsable: {parcelaSeleccionada.responsable}</p>
                                    <p>Tipo de cultivo: {parcelaSeleccionada.tipo_cultivo}</p>
                                    <button className="graf-btn" onClick={handleVerGraficos}>
                                        Ver Historico
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </>
    );
}

export default Dashboard;