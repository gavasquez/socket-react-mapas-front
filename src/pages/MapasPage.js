import { useContext, useEffect } from 'react';
import { useMapBox } from '../hooks/useMapBox';
import { SocketContext } from '../context/SocketContext';
import { useSocketMapBox } from '../hooks/useSocketMapBox';

const puntoInicial = {
    lng: -75.7052,
    lat: 3.3794,
    zoom: 7
}

export const MapasPage = () => {

    const { socket } = useContext(SocketContext);

    const { setRef, coords, nuevoMarcador$, movimientoMarcador$, agregarMarcador, actualizarPosicion } = useMapBox(puntoInicial);

    useSocketMapBox(socket, agregarMarcador, nuevoMarcador$, movimientoMarcador$, actualizarPosicion);

    return (
        <>
            <div className='info'>
                lng: {coords.lng}| lat: {coords.lat} | zoom: {coords.zoom}
            </div>
            <div
                className='mapContainer'
                ref={setRef}
            />
        </>
    )
}
