import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./UserProfile2.css";

const ProfileInfo = () => {
  const [userData, setUserData] = useState({
    userName: "",
    fullName: "",
    email: "",
    userImage: "",
  });

  //   useEffect(() => {
  //     const fetchUserData = async () => {
  //       const token = localStorage.getItem("token");

  //       if (token) {
  //         const decodedToken = jwtDecode(token);
  //         const userId = decodedToken.id;

  //         try {
  //           const response = await axios.get(
  //             `http://localhost:3001/api/v1/user/${userId}`,
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //               },
  //             }
  //           );

  //           if (response.data.ok) {
  //             let userFullName =
  //               response.data.body.firstName + " " + response.data.body.lastName;

  //             const userImageBlob = response.data.body.userImage;

  //             // Convertir el BLOB a URL
  //             const imageUrl = userImageBlob?.data
  //               ? URL.createObjectURL(
  //                   new Blob([new Uint8Array(userImageBlob.data)])
  //                 )
  //               : null;

  //             console.log(userImageBlob);
  //             console.log("User Image URL:", imageUrl);
  //             setUserData({
  //               userName: response.data.body.userName,
  //               fullName: userFullName,
  //               email: response.data.body.email,
  //               userImage: imageUrl,
  //             });
  //           } else {
  //             console.error("Error fetching user data:", response.data.message);
  //           }
  //         } catch (error) {
  //           console.error("Error fetching user data:", error);
  //         }
  //       } else {
  //         window.location.href = "./Components/LoginForm/LoginForm";
  //       }
  //     };

  //     fetchUserData();
  //     // Limpieza del efecto
  //     return () => {
  //       // Revoca la URL blob cuando el componente se desmonte
  //       if (userData.userImage) {
  //         URL.revokeObjectURL(userData.userImage);
  //       }
  //     };
  //   }, []);

  return (
    <div className="profile-container">
      <Header />
      <section className="profile">
        <h2 className="perfil-titulo">PERFIL USUARIO</h2>
        <div className="profile-info">
          <img
            src={userData.userImage}
            alt="Profile avatar"
            className="profile-avatar"
          />
          <div className="profile-details">
            <p>
              <strong>Nombre de Usuario:</strong> {userData.userName}
            </p>
            <p>
              <strong>Correo electrónico:</strong> {userData.email}
            </p>
            <p>
              <strong>Nombre completo:</strong> {userData.fullName}
            </p>
          </div>
        </div>
        <div className="buttonsContainer">
          <div className="buttonsContent">
            <a href="#">Enviar solicitud de amistad</a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProfileInfo;