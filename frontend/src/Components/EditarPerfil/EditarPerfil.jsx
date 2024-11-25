import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./EditarPerfil.css";

const EditProfile = () => {
  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    profileImage: "",
    gender: "",
    about: "",
  });
  const [originalData, setOriginalData] = useState(userData);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // const saveChanges = () => {};

  const cancelEdit = () => {
    window.location.href = "/UserProfile";
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        try {
          const response = await axios.get(
            `http://localhost:3001/api/v1/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.ok) {
            setUserData({
              userName: response.data.body.userName,
              firstName: response.data.body.firstName,
              lastName: response.data.body.lastName,
              email: response.data.body.email,
              gender: response.data.body.gender,
              profileImage: response.data.body.userImage,
              about: response.data.body.about,
            });
          } else {
            console.error("Error fetching user data:", response.data.message);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        window.location.href = "./Components/LoginForm/LoginForm";
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prevData) => ({
          ...prevData,
          profileImage: reader.result,
        }));
        console.log("Imagen en base64:", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //  UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedData = { ...userData };

    // Asegúrate de enviar los datos binarios (Base64) de la imagen si han cambiado
    if (userData.profileImage === originalData.profileImage) {
      delete updatedData.profileImage; // No enviar si no ha cambiado
    }

    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      try {
        const response = await axios.put(
          `http://localhost:3001/api/v1/user/${userId}`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Datos enviados al backend:", updatedData);
        console.log("Usuario actualizado:", response.data);
        alert("Actualización exitosa");
        navigate("/UserProfile");
      } catch (error) {
        console.error("Error al actualizar usuario", error);
        alert("Ocurrió un error al actualizar los datos");
      }
    } else {
      alert("No estás autenticado");
    }
  };

  return (
    <div className="edit-profile-container">
      <Header />
      <section className="edit-profile" id="editSection">
        <h2 className="perfil-titulo">EDITAR USUARIO</h2>
        <div className="profile-info">
          <div className="profile-details">
            <label htmlFor="editUsername">
              <strong>Nombre de Usuario: </strong>
            </label>
            <input
              type="text"
              id="editUsername"
              name="userName"
              value={userData.userName}
              onChange={handleChange}
            />
            <br />
            <label htmlFor="editFirstName">
              <strong>Nombre: </strong>
            </label>
            <input
              type="text"
              id="editFirstName"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
            />
            <br />
            <label htmlFor="editLastName">
              <strong>Apellido: </strong>
            </label>
            <input
              type="text"
              id="editLastName"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
            />
            <br />
            <label htmlFor="editEmail">
              <strong>Correo Electrónico: </strong>
            </label>
            <input
              type="email"
              id="editEmail"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
            <br />
            <label htmlFor="editAbout">
              <strong>Acerca de </strong>
            </label>
            <input
              type="text"
              id="editAbout"
              name="about"
              value={userData.about}
              onChange={handleChange}
            />
            <br />
            <div className="upload-section">
              <label htmlFor="fileUpload" className="upload-label">
                Seleccionar nueva foto de perfil:
              </label>
              <input
                type="file"
                id="fileUpload"
                name="profileImage"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <br />
            <span id="errorMessage" style={{ color: "red" }}>
              {errorMessage}
            </span>
            <br />
          </div>
        </div>
      </section>
      <div className="button-container">
        <button className="btn-edit" onClick={handleUpdate}>
          Guardar Cambios
        </button>
        <button className="btn-logout" onClick={cancelEdit}>
          Cancelar
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfile;
