import React from "react";

import "./ProductoItem.css"; // Importar CSS

function ProductoItem({ nombre, descuento, precio, imgSrc }) {
  return (
    <li className="producto-item">
      <h5>{nombre}</h5>
      <p className="descuento-producto">Descuento: {descuento}</p>{" "}
      {/* Aplica la nueva clase aquí */}
      <img src={imgSrc} alt={nombre} className="producto-imagen" />
      <p className="precio-producto">Precio: ${precio}</p>{" "}
      {/* Asegúrate de usar la clase aquí */}
      <button className="boton-comprar">Agregar al carrito</button>
    </li>
  );
}

export default ProductoItem;
