
import { useEffect } from 'react';
import { useMapBox } from '../hooks/useMapBox';

const puntoInicial = {
    lng: -75.7052,
    lat: 3.3794,
    zoom: 7
}

export const MapasPage = () => {
    const { setRef, coords, nuevoMarcador$, movimientoMarcador$ } = useMapBox(puntoInicial);

    //* Nuevo Marcador
    useEffect(() => {
        nuevoMarcador$.subscribe((marcador) => {
            //TODO: Nuevo marcador a emitir
        });
    }, [nuevoMarcador$]);

    //* Movimiento Marcador
    useEffect(() => {
        movimientoMarcador$.subscribe((marcador) => {
            console.log(marcador);
        });
    }, [movimientoMarcador$]);

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
