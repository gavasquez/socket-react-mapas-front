import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { v4 } from "uuid";
import mapboxgl from 'mapbox-gl'
import { Subject } from "rxjs";

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2F2YXNxdWV6IiwiYSI6ImNsbnlxZ3l6ODByZWcyc3FiOHBzMjNjbjYifQ.Jub-W41k2Lrc2kxVyEGC0g';

export const useMapBox = (puntoInicial) => {

    // Referencia al Div del Mapa
    const mapaDiv = useRef();
    const setRef = useCallback((node) => {
        mapaDiv.current = node;
    }, []);

    //* Referencia a los marcador
    const marcadores = useRef({});

    // Observable de Rxjs
    //* Subject Sirve para crear Observable en Rxjs
    const movimientoMarcador = useRef(new Subject());
    const nuevoMarcador = useRef(new Subject());

    //* MAPA
    const mapa = useRef();
    //* Coordernadas
    const [coords, setCoords] = useState(puntoInicial);

    //* Funcion para agregar marcadores
    const agregarMarcador = useCallback((ev) => {
        const { lng, lat } = ev.lngLat;
        //* Crear el Marcador
        const marker = new mapboxgl.Marker();
        //* Crear un id al marcador con uuid
        marker.id = v4(); //TODO: Si el marcador ya tiene id
        //* Asignamos la lng y lat, despues agregamos al mapa con addTo y ponemos el setDraggable en true para que se puede mover el marcador
        marker.setLngLat([lng, lat]).addTo(mapa.current).setDraggable(true);
        marcadores.current[marker.id] = marker;
        // TODO Si el marcador tiene id no se tiene que emitir
        //* next para enviar el siguiente valor
        nuevoMarcador.current.next(
            {
                id: marker.id,
                lng,
                lat
            }
        );
        // Escuchar movimientos del Marcador drag
        marker.on('drag', (ev) => {
            const { id } = ev.target;
            const { lng, lat } = ev.target.getLngLat();
            //TODO: Emitir los cambios del Marcador
            //* next para enviar el siguiente valor
            movimientoMarcador.current.next({
                id,
                lng,
                lat
            });
        });
    }, []);


    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapaDiv.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [puntoInicial.lng, puntoInicial.lat],
            zoom: puntoInicial.zoom
        });
        mapa.current = map;
    }, []);

    //* Cuando se mueve el Mapa
    useEffect(() => {
        mapa.current?.on('move', () => {
            const { lng, lat } = mapa.current.getCenter();
            setCoords({
                lng: lng.toFixed(4),
                lat: lat.toFixed(4),
                zoom: mapa.current.getZoom().toFixed(2)
            });
        });
    }, []);

    //* Agregar Marcadores cuando se hace Clic
    useEffect(() => {
        mapa.current?.on('click', (ev) => agregarMarcador(ev));
    }, [agregarMarcador]);


    return {
        setRef,
        coords,
        marcadores,
        //
        agregarMarcador,
        nuevoMarcador$: nuevoMarcador.current,
        movimientoMarcador$: movimientoMarcador.current,
    }
}
