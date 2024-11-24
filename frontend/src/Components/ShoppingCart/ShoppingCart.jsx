import React, { useState } from "react";
import "./ShoppingCart.css";

const Carrito = () => {
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Producto 1", precio: 20.0, cantidad: 2 },
    { id: 2, nombre: "Producto 2", precio: 15.0, cantidad: 1 },
  ]);

  const actualizarCantidad = (id, nuevaCantidad) => {
    setProductos((prevProductos) =>
      prevProductos.map((producto) =>
        producto.id === id
          ? { ...producto, cantidad: Math.max(1, nuevaCantidad) }
          : producto
      )
    );
  };

  const eliminarProducto = (id) => {
    setProductos((prevProductos) =>
      prevProductos.filter((producto) => producto.id !== id)
    );
  };

  const calcularSubtotal = (precio, cantidad) => precio * cantidad;

  const calcularTotal = () =>
    productos.reduce(
      (total, producto) =>
        total + calcularSubtotal(producto.precio, producto.cantidad),
      0
    );

  return (
    <div>
      <header>
        <h1>Carrito de Compras</h1>
      </header>

      <main>
        <section className="cart">
          <h2>Tu Carrito</h2>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length > 0 ? (
                productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.nombre}</td>
                    <td>${producto.precio.toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        value={producto.cantidad}
                        min="1"
                        onChange={(e) =>
                          actualizarCantidad(
                            producto.id,
                            parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </td>
                    <td>
                      $
                      {calcularSubtotal(
                        producto.precio,
                        producto.cantidad
                      ).toFixed(2)}
                    </td>
                    <td>
                      <button onClick={() => eliminarProducto(producto.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Tu carrito está vacío</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="summary">
            <p>
              Total: $<span>{calcularTotal().toFixed(2)}</span>
            </p>
            <button id="checkout" disabled={productos.length === 0}>
              Proceder al Pago
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Carrito;
