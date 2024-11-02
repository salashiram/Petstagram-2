import React from "react";
import Header from "../Header/Header";
import PremioCorazones from "../PremioCorazones/PremioCorazones";
import MiTienda from "../MiTienda/MiTienda";
import Footer from "../Footer/Footer";

import "./Recompensas.css"; // Importar CSS

function Recompensas() {
  return (
    <div className="Recompensas-container">
      <Header />
      <main>
        <PremioCorazones />
        <MiTienda />
      </main>
      <Footer />
    </div>
  );
}

export default Recompensas;
