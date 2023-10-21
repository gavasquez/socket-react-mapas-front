import { useEffect } from "react";

export const useSocketMapBox = (socket, agregarMarcador, nuevoMarcador$, movimientoMarcador$, actualizarPosicion) => {

    //* Escuchar los marcadores existentes
    useEffect(() => {
        socket.on('marcador-activos', (marcadores) => {
            for (const key of Object.keys(marcadores)) {
                agregarMarcador(marcadores[key], key);
            }
        });
    }, [socket, agregarMarcador]);

    //* Nuevo Marcador
    useEffect(() => {
        nuevoMarcador$.subscribe((marcador) => {
            //TODO: Nuevo marcador a emitir
            socket.emit('marcador-nuevo', marcador);
        });
    }, [nuevoMarcador$, socket]);

    //* Movimiento Marcador
    useEffect(() => {
        movimientoMarcador$.subscribe((marcador) => {
            socket.emit('marcador-actualizado', marcador);
        });
    }, [movimientoMarcador$]);

    // Mover marcador mediante socket
    useEffect(() => {
        socket.on('marcador-actualizado', (marcador) => {
            actualizarPosicion(marcador);
        });
    }, [socket]);


    //* Escuchar nuevos marcadores
    useEffect(() => {
        socket.on('marcador-nuevo', (marcador) => {
            agregarMarcador(marcador, marcador.id);
        });
    }, [socket]);
}
