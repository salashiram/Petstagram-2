import React, { useState, useEffect } from "react";

import "./Contador.css"; // Importar CSS

function Contador() {
  const [tiempoRestante, setTiempoRestante] = useState("");

  useEffect(() => {
    function actualizarContador() {
      const ahora = new Date();
      const diaActual = ahora.getDay();

      const proximoCambio = new Date();
      if (diaActual === 0 && ahora.getHours() >= 7) {
        proximoCambio.setDate(ahora.getDate() + 7);
      } else if (diaActual === 0) {
        proximoCambio.setDate(ahora.getDate());
      } else {
        proximoCambio.setDate(ahora.getDate() + (7 - diaActual));
      }
      proximoCambio.setHours(7, 0, 0, 0);

      const diferencia = proximoCambio - ahora;
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor(
        (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

      setTiempoRestante(`${dias}d ${horas}h ${minutos}m ${segundos}s`);
    }

    const interval = setInterval(actualizarContador, 1000);
    actualizarContador();

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="contador-tienda">
      Tiempo restante para el próximo cambio en la tienda: {tiempoRestante}
    </div>
  );
}

export default Contador;
