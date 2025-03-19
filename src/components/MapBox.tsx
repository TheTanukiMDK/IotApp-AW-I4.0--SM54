import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import '../css/MapBox.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWRpYXZhbmlhIiwiYSI6ImNtODdkNTM3azBlNTUyanBzeDI4ZWk0MjcifQ.eTmoY78COUVLrNAZWdyPKA';

function MapBox() {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (map.current || !mapContainer.current) return; // Si ya existe el mapa o el contenedor no está listo, salir

        map.current = new mapboxgl.Map({
            container: mapContainer.current as HTMLElement, // Asegurando el tipo
            style: 'mapbox://styles/mapbox/streets-v11', // Estilo del mapa
            center: [-99.1332, 19.4326], // Coordenadas de Ciudad de México
            zoom: 10, // Nivel de zoom
        });

        return () => {
            map.current?.remove(); // Eliminar el mapa al desmontar el componente
        };
    }, []);

    return (
        <div ref={mapContainer} className="mapbox-container"></div>
    );
}

export default MapBox;
