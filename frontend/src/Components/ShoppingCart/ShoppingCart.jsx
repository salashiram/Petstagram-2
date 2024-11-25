import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import axios from "axios";
import "./ShoppingCart.css";
import { jwtDecode } from "jwt-decode";

const Carrito = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const idUser = jwtDecode(token).id;

    if (token) {
      axios
        .get(
          `http://localhost:3001/api/v1/cart/shoppingCart/details/${idUser}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setProductos(response.data.body);
        })
        .catch((err) => {
          console.error("Error al obtener el carrito:", err);
          setError("Hubo un problema al obtener los detalles del carrito.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const actualizarCantidad = (id, nuevaCantidad) => {
    setProductos((prevProductos) =>
      prevProductos.map((producto) =>
        producto.idProduct === id
          ? { ...producto, quantity: Math.max(1, nuevaCantidad) }
          : producto
      )
    );
  };

  const eliminarProducto = (id) => {
    setProductos((prevProductos) =>
      prevProductos.filter((producto) => producto.idProduct !== id)
    );
  };

  // Función para calcular el subtotal con verificación de tipo de datos
  const calcularSubtotal = (precio, cantidad) => {
    const precioNum = parseFloat(precio);
    const cantidadNum = parseInt(cantidad, 10);

    if (isNaN(precioNum) || isNaN(cantidadNum)) {
      return 0; // Devolver 0 si el precio o cantidad no son números válidos
    }

    return precioNum * cantidadNum;
  };

  const calcularTotal = () =>
    productos.reduce(
      (total, producto) =>
        total +
        calcularSubtotal(
          producto.product.unityPrice, // UnityPrice puede ser string, convertirlo a número
          producto.quantity
        ),
      0
    );

  return (
    <div className="shopping-cart">
      <Header />
      <main className="shopping-cart-main">
        <section className="shopping-cart-cart">
          <h2>Tu Carrito</h2>

          {/* Muestra el mensaje de carga o error */}
          {loading && <p>Cargando tu carrito...</p>}
          {error && <p className="error">{error}</p>}

          <table className="shopping-cart-table">
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
                  <tr key={producto.idProduct}>
                    <td>{producto.product.name}</td>
                    <td>
                      ${parseFloat(producto.product.unityPrice).toFixed(2)}{" "}
                      {/* Convertir a número */}
                    </td>
                    <td>
                      <input
                        type="number"
                        value={producto.quantity}
                        min="1"
                        onChange={(e) =>
                          actualizarCantidad(
                            producto.idProduct,
                            parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </td>
                    <td>
                      $
                      {calcularSubtotal(
                        producto.product.unityPrice,
                        producto.quantity
                      ).toFixed(2)}
                    </td>
                    <td>
                      <button
                        onClick={() => eliminarProducto(producto.idProduct)}
                      >
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

          <div className="shopping-cart-summary">
            <p>
              Total: $<span>{calcularTotal().toFixed(2)}</span>
            </p>
            <button
              className="shopping-cart-checkout"
              disabled={productos.length === 0}
            >
              Proceder al Pago
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Carrito;
