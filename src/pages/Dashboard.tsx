import React, { useEffect, useRef } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../css/Dashboard.css';
import CardHum from '../components/CardHum';
import CardTemp from '../components/CardTemp';
import Cardlluvia from '../components/Cardlluvia';
import CardSol from '../components/CardSol';
import mapboxgl from 'mapbox-gl';


import 'mapbox-gl/dist/mapbox-gl.css';
import '../css/MapBox.css' // Asegúrate de importar el CSS

function Dashboard() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYWRpYXZhbmlhIiwiYSI6ImNtODdkNTM3azBlNTUyanBzeDI4ZWk0MjcifQ.eTmoY78COUVLrNAZWdyPKA';

        if (mapContainerRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v11', // Asegúrate de tener un estilo válido
                center: [-74.5, 40],
                zoom: 9
            });
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);
    return (
        <>
            <div className='dashboard'>
                <Header />
                <Sidebar />
                <main className='main-content'>
                    <section className='map-and-cards'>
                        <div className='map'>
                            <div
                                ref={mapContainerRef}
                                className="map-container"
                            />
                        </div>
                        <div className='cards'>
                            <CardTemp />
                            <CardHum />
                            <Cardlluvia />
                            <CardSol />
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}

export default Dashboard;
