import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./EditarPremios.css";

const EditarProductos = () => {
  const [producto, setProducto] = useState({
    name: "",
    price: "",
    discount: "",
    image: "",
    stock: "",
    category: "",
  });

  const navigate = useNavigate();
  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];

  //   if (file) {
  //     const fileUrl = URL.createObjectURL(file);
  //     setProducto({
  //       ...producto,
  //       image: fileUrl,
  //     });
  //   }
  // };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      console.log(formData);

      axios
        .post("http://localhost:3001/api/v1/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Respuesta del backend:", response);
          const filePath = response.data.filePath;
          setProducto((prevProducto) => ({
            ...prevProducto, // Esto asegura que no se pierdan otros valores
            image: filePath,
          }));
        })
        .catch((error) => {
          // console.log("Respuesta del backend:", response);
          console.error("Error al subir la imagen:", error);
          alert("Hubo un error al subir la imagen");
        });
    } else {
      alert("No se seleccionó una imagen");
    }
  };

  const guardarCambios = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No se encontró el token de autenticación.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const productoData = {
        idUser: userId,
        name: producto.name,
        description: producto.desc,
        unityPrice: parseFloat(producto.unityPrice),
        discount: parseInt(producto.discount),
        stock: parseInt(producto.stock),
        image: producto.image,
        category: producto.category,
      };

      console.log(productoData);

      const response = await axios.post(
        "http://localhost:3001/api/v1/products/product",
        productoData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Respuesta del servidor:", response);
      if (response.status === 201) {
        alert("Producto guardado con éxito.");
        navigate("/UserProfile");
      }
    } catch (error) {
      console.error("Error al guardar el producto", error);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="product-main">
      <Header />
      <main className="product-main-container">
        <section className="formulario-editar">
          <h2 className="titulo-editar">Productos y recompensas</h2>
          <hr />
          <br />
          <h3 className="subtitulo">Nuevo producto</h3>
          <div id="productos">
            <div className="producto">
              <label htmlFor="nombre-producto-1">Nombre:</label>
              <input
                type="text"
                id="product-name"
                name="name"
                value={producto.name}
                onChange={(e) =>
                  setProducto({ ...producto, name: e.target.value })
                }
              />

              <label htmlFor="nombre-desc-1">Descripción:</label>
              <input
                type="text"
                id="product-desc"
                name="desc"
                value={producto.desc}
                onChange={(e) =>
                  setProducto({ ...producto, desc: e.target.value })
                }
              />

              <label htmlFor="category-desc-1">Categoria:</label>
              <input
                type="text"
                id="product-category"
                name="category"
                value={producto.category}
                onChange={(e) =>
                  setProducto({ ...producto, category: e.target.value })
                }
              />

              <label htmlFor="precio-producto-1">Precio:</label>
              <input
                type="text"
                id="product-price"
                name="unityPrice"
                value={producto.unityPrice}
                onChange={(e) =>
                  setProducto({ ...producto, unityPrice: e.target.value })
                }
              />

              <label htmlFor="descuento-producto-1">Descuento (%):</label>
              <input
                type="number"
                id="product-discount"
                name="discount"
                value={producto.discount}
                onChange={(e) =>
                  setProducto({ ...producto, discount: e.target.value })
                }
              />

              <label htmlFor="descuento-producto-1">Cantidad disponible:</label>
              <input
                type="number"
                id="product-stock"
                name="stock"
                value={producto.stock}
                onChange={(e) =>
                  setProducto({ ...producto, stock: e.target.value })
                }
              />

              <label htmlFor="imagen-producto-1">Imagen:</label>
              <input
                type="file"
                id="product-image"
                name="image"
                onChange={handleImageChange}
              />
              {/* <img
                id="preview-producto-1"
                src={producto.image}
                alt="Previsualización"
                className="preview-imagen"
              /> */}
              {/* // http://localhost:3001/uploads/${producto.image} */}
              <img
                id="preview-producto-1"
                src={`http://localhost:3001${producto.image}`} // Usa la ruta devuelta por el backend tal cual
                alt="Previsualización"
                className="preview-imagen"
              />
            </div>
          </div>
          <button
            type="button"
            className="boton-guardar"
            onClick={guardarCambios}
          >
            Guardar Cambios
          </button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EditarProductos;
