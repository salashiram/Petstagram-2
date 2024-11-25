import React, { useState, useEffect } from "react";
import axios from "axios";
import Contador from "../Contador/Contador";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ProductoItem from "../ProductoItem/ProductoItem";
import "./MiTienda.css";
import exampleImage from "../MiTienda/61KSTdBcfDL.jpg";

function MiTienda() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/products/product"
        );
        setProductos(response.data.body);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError("No se pudieron cargar los productos. Intenta nuevamente.");
      }
    };

    fetchProductos();
  }, []);

  const handleAddToCart = async (idProduct) => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      const idUser = decodedToken.id;

      const cartPayLoad = {
        idUser: idUser,
        idProduct: idProduct,
      };

      try {
        const response = await axios.post(
          "http://localhost:3001/api/v1/cart/shoppingCart",
          cartPayLoad,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.ok) {
          alert("Producto agregado al carrito");
          console.log("Respuesta del servidor:", response.data);
          navigate("/ShoppingCart");
        } else {
          console.error(
            "Error al crear el carrito de compras:",
            response.data.message
          );
        }
      } catch (err) {
        navigate("/ShoppingCart");
        console.log("id usuario", idUser);
        console.log("id producto", idProduct);
        console.error("Error al agregar al carrito:", err);
        const errorMessage =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "Hubo un problema al agregar el producto al carrito.";

        alert(errorMessage); // Muestra el mensaje del servidor o uno genérico
      }
    }
  };

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

      <div className="products-container">
        <div className="productos-semana">
          <h4 className="productos-titulo">🛒 Productos de esta semana:</h4>
          {error ? (
            <p className="error-mensaje">{error}</p>
          ) : (
            <ul>
              {productos.map((producto) => (
                <ProductoItem
                  key={producto.idProduct}
                  nombre={producto.name}
                  descuento={`${producto.discount}%`}
                  precio={producto.unityPrice}
                  imgSrc={exampleImage}
                  onAddToCart={() => handleAddToCart(producto.idProduct)} // Pasa la función con el ID del producto
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default MiTienda;
