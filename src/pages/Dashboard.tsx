import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../css/Dashboard.css';
import CardHum from '../components/CardHum';
import CardTemp from '../components/CardTemp';
import Cardlluvia from '../components/Cardlluvia';
import CardSol from '../components/CardSol';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import '../css/MapBox.css';

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

    const [parcelas, setParcelas] = useState<Parcela[]>([]);
    const [parcelaSeleccionada, setParcelaSeleccionada] = useState<Parcela | null>(null);

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
        // Consumir la API
        fetch('https://moriahmkt.com/iotapp/')
            .then((response) => response.json())
            .then((data) => {
                setParcelas(data.parcelas); // Asume que la API devuelve un array de parcelas
                setParcelaSeleccionada(data.parcelas[0]); // Seleccionar la primera parcela por defecto
            })
            .catch((error) => console.error('Error al obtener los datos:', error));
    }, []);

    const handleParcelaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const parcelaId = parseInt(event.target.value, 10);
        const parcela = parcelas.find((p) => p.id === parcelaId) || null;
        setParcelaSeleccionada(parcela);
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
                                {parcelaSeleccionada ? (
                                    <>
                                        <CardTemp temperatura={parcelaSeleccionada.sensor.temperatura} />
                                        <CardHum humedad={parcelaSeleccionada.sensor.humedad} />
                                        <Cardlluvia lluvia={parcelaSeleccionada.sensor.lluvia} />
                                        <CardSol sol={parcelaSeleccionada.sensor.sol} />
                                    </>
                                ) : (
                                    <p>Seleccione una parcela para ver los datos.</p>
                                )}
                            </div>
                        </section>
                    </div>
                    <section className="select-and-parcel">
                        <div className="select-info">
                            <select className="select" onChange={handleParcelaChange}>
                                <option value="">Seleccione un cultivo</option>
                                {parcelas.map((parcela) => (
                                    <option key={parcela.id} value={parcela.id}>
                                        {parcela.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {parcelaSeleccionada && (
                            <div className="parcel-info">
                                <div className="card-parcel">
                                    <h3>Información de la Parcela</h3>
                                    <p>Nombre: {parcelaSeleccionada.nombre}</p>
                                    <p>Responsable: {parcelaSeleccionada.responsable}</p>
                                    <p>Tipo de cultivo: {parcelaSeleccionada.tipo_cultivo}</p>
                                    <button className='graf-btn'>Ver Graficos</button>
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