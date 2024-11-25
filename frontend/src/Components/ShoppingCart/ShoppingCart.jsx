import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ShoppingCart.css";
import { jwtDecode } from "jwt-decode";

const Carrito = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [payMethod, setPayMethod] = useState(""); // Estado para el método de pago
  const [userAddress, setUserAddress] = useState(""); // Estado para la dirección
  const [total, setTotal] = useState(0); // Estado para el total
  const navigate = useNavigate();

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
          setTotal(calcularTotal()); // Establecer el total cuando se cargan los productos
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

  const deleteCart = (idShoppingCart) => {
    const token = localStorage.getItem("token");

    axios
      .put(
        `http://localhost:3001/api/v1/cart/shoppingCart/${idShoppingCart}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Carrito desactivado:", response.data);
        setProductos((prevProductos) =>
          prevProductos.filter(
            (producto) => producto.idShoppingCart !== idShoppingCart
          )
        );
        navigate("/Recompensas");
      })
      .catch((err) => {
        console.error("Error al desactivar el carrito:", err);
        setError("Hubo un problema al desactivar el carrito.");
      });
  };

  const calcularSubtotal = (precio, cantidad) => {
    const precioNum = parseFloat(precio);
    const cantidadNum = parseInt(cantidad, 10);

    if (isNaN(precioNum) || isNaN(cantidadNum)) {
      return 0;
    }

    return precioNum * cantidadNum;
  };

  const calcularTotal = () =>
    productos.reduce(
      (total, producto) =>
        total +
        calcularSubtotal(producto.product.unityPrice, producto.quantity),
      0
    );

  const handleCheckout = () => {
    // Aquí puedes hacer la solicitud para finalizar la compra
    const token = localStorage.getItem("token");
    const idUser = jwtDecode(token).id;

    axios
      .post(
        `http://localhost:3001/api/v1/cart/checkout`,
        {
          payMethod,
          userAddress,
          total,
          idUser,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Compra realizada:", response.data);
        // Redirigir a una página de confirmación
        navigate("/confirmacion");
      })
      .catch((err) => {
        console.error("Error al procesar el pago:", err);
        setError("Hubo un problema al procesar el pago.");
      });
  };

  return (
    <div className="shopping-cart">
      <Header />
      <main className="shopping-cart-main">
        <section className="shopping-cart-cart">
          <h2>Tu Carrito</h2>

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
                      ${parseFloat(producto.product.unityPrice).toFixed(2)}
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
                        onClick={() => deleteCart(producto.idShoppingCart)}
                      >
                        Eliminar artículo
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

            {/* Inputs para la información adicional */}
            <div className="checkout-inputs">
              <div className="payment-inputs">
                <label htmlFor="payMethod">Método de pago</label>
                <select
                  id="payMethod"
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                >
                  <option value="">Selecciona un método de pago</option>
                  <option value="tarjeta">Tarjeta de crédito</option>
                  <option value="paypal">PayPal</option>
                  <option value="transferencia">Transferencia bancaria</option>
                  <option value="efectivo">Efectivo</option>
                </select>
              </div>

              <div>
                <label htmlFor="userAddress">Dirección de envío</label>
                <input
                  type="text"
                  id="userAddress"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  placeholder="Ingresa tu dirección"
                />
              </div>
            </div>

            <div className="cart-buttons">
              <button
                className="shopping-cart-checkout"
                disabled={productos.length === 0 || !payMethod || !userAddress}
                onClick={handleCheckout} // Llamada para proceder con el pago
              >
                Pagar
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Carrito;
