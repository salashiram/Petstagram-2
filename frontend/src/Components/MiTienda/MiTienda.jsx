import React from "react";
import Contador from "../Contador/Contador";
import ProductoItem from "../ProductoItem/ProductoItem";
import jugueteGato from "../Assets/jugueteGato.jpg"; // Importar imagen
import camaPerro from "../Assets/camaperro.jpg"; // Importar imagen
import plato from "../Assets/plato.jpg"; // Importar imagen
import tijeras from "../Assets/TIJERAS.jpg"; // Importar imagen

import "./MiTienda.css"; // Importar CSS

function MiTienda() {
  return (
    <section className="mi-tienda">
      <h3 className="tienda-titulo">🌟 Mi Tienda - Productos Exclusivos 🌟</h3>
      <p className="tienda-descripcion">
        Cada semana, nuevos productos estarán disponibles en nuestra tienda con{" "}
        <strong>descuentos exclusivos</strong> para los usuarios que acumulen
        más corazones en sus publicaciones.
      </p>
      <p className="tienda-anuncio">
        ¡No olvides volver cada semana para descubrir nuevos productos para tus
        mascotas!
      </p>

      <Contador />

      <div className="productos-semana">
        <h4 className="productos-titulo">🛒 Productos de esta semana:</h4>
        <ul>
          <ProductoItem
            nombre="Juguete Interactivo Para Gatos"
            descuento="20%"
            precio="79.00"
            imgSrc={jugueteGato}
          />
          <ProductoItem
            nombre="Cama Ergonómica Para Perros"
            descuento="30%"
            precio="197.00"
            imgSrc={camaPerro}
          />
          <ProductoItem
            nombre="Plato De Alimentación Lenta Para Perro"
            descuento="15%"
            precio="94.00"
            imgSrc={plato}
          />
          <ProductoItem
            nombre="Kit Cortapelos Para Perros y Gatos"
            descuento="10%"
            precio="189.00"
            imgSrc={tijeras}
          />
        </ul>
      </div>
    </section>
  );
}

export default MiTienda;
