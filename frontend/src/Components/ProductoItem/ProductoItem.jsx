import React from "react";
import "./ProductoItem.css"; // Importar CSS

function ProductoItem({ nombre, descuento, precio, imgSrc, onAddToCart }) {
  return (
    <li className="producto-item">
      <h5>{nombre}</h5>
      <p className="descuento-producto">Descuento: {descuento}</p>
      <img src={imgSrc} alt={nombre} className="producto-imagen" />
      <p className="precio-producto">Precio: ${precio}</p>
      <button
        className="boton-comprar"
        onClick={onAddToCart} // Ejecuta la función pasada como prop al hacer clic
      >
        Agregar al carrito
      </button>
    </li>
  );
}

export default ProductoItem;
