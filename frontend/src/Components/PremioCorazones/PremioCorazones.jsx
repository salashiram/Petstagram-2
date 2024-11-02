import React from "react";
import juguete from "../Assets/juguete.jpg"; // Importar imagen

import "./PremioCorazones.css"; // Importar CSS

function PremioCorazones() {
  return (
    <section className="premio-corazones">
      <h3 className="premio-titulo">🎁 Premio Especial 🎁</h3>
      <p className="premio-descripcion">
        Los usuarios con más corazones pueden reclamar un{" "}
        <strong>premio especial</strong> esta semana.
      </p>
      <div className="premio-especial">
        <div className="foto-recompensa">
          <img src={juguete} alt="Juguete especial" className="imagen-premio" />
        </div>
        <div className="premio-grande">
          <p>
            ¡Felicidades! Reclama tu <strong>Set de Lujo para Mascotas</strong>{" "}
            aquí.
          </p>
          <button className="boton-reclamar">Reclamar Premio</button>
        </div>
      </div>
    </section>
  );
}

export default PremioCorazones;
