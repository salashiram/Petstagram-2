import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./UserProfile2.css";

const ProfileInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    userName: "",
    fullName: "",
    email: "",
    userImage: "",
    about: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Usuario no autenticado.");
          navigate("/login");
          return;
        }

        const decodeToken = jwtDecode(token);
        const idSender = decodeToken.id;

        console.log(decodeToken.id);
        console.log(idSender);

        if (Number(idSender) === Number(id)) {
          navigate("/UserProfile");
          return;
        }

        const response = await axios.get(
          // `http://localhost:3001/api/v1/users/${idUser}`,
          `http://localhost:3001/api/v1/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.ok) {
          let userFullName =
            response.data.body.firstName + " " + response.data.body.lastName;

          setUserData({
            userName: response.data.body.userName,
            fullName: userFullName,
            email: response.data.body.email,
            userImage:
              response.data.body.userImage || "https://via.placeholder.com/150", // Imagen por defecto si no hay una
            about: response.data.body.about,
          });
        } else {
          setError("No se pudo cargar la información del usuario.");
        }
      } catch (err) {
        console.error(err);
        setError("Error al cargar la información del usuario.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleSendFriendRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuario no autenticado.");
        return;
      }

      const decodedToken = jwtDecode(token);
      const idSender = decodedToken.id;

      console.log("idSender", idSender);
      console.log("idReceptor", id);

      if (idSender === id) {
        alert("No puedes enviarte una solicitud a ti mismo.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/api/v1/userFriendRequest/friendRequest",
        {
          idSender,
          idReceptor: id, // Este es el id del perfil visitado
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.ok) {
        alert(response.data.message || "¡Solicitud de amistad enviada!");
        setMessage("¡Solicitud de amistad enviada!");
      } else {
        alert(response.data.message || "No se pudo enviar la solicitud.");
        setMessage("No se pudo enviar la solicitud.");
      }
    } catch (error) {
      const backendMessage =
        error.response?.data?.message ||
        "Hubo un error al enviar la solicitud.";
      alert(backendMessage);
      console.error("Error al enviar la solicitud de amistad:", error);
      setMessage("Hubo un error al enviar la solicitud.");
    }
  };

  if (loading) return <div>Cargando perfil...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-container">
      <Header />
      <section className="profile">
        <h2 className="perfil-titulo">{userData.fullName}</h2>
        <div className="profile-info">
          <img
            src={
              "https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            }
            alt="Profile avatar"
            className="profile-avatar"
          />
          <div className="profile-details">
            <p>
              <strong>{userData.userName}</strong>
            </p>
            <p>
              <strong>{userData.email}</strong>
            </p>
            <p>
              <strong>Acerca de:</strong> <br /> <p>{userData.about}</p>
            </p>
          </div>
        </div>
        <div className="buttonsContainer">
          <div className="buttonsContent">
            {/* <a href="#">Enviar solicitud de amistad</a> */}
            <button className="btn-edit" onClick={handleSendFriendRequest}>
              Enviar solicitud de amistad
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProfileInfo;
