import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import EditarPremios from "../EditarPremios/EditarPremios";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./UserProfile.css";

const ProfileInfo = () => {
  const [userData, setUserData] = useState({
    userName: "",
    fullName: "",
    email: "",
    userImage: "",
    about: "",
  });

  function _arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

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

          console.log("Response data:", response.data);

          if (response.data.ok) {
            const userFullName =
              response.data.body.firstName + " " + response.data.body.lastName;

            const profileImageBuffer = response.data.body.profileImage;

            // Generar Blob y URL temporal
            const imageUrl = profileImageBuffer?.data
              ? URL.createObjectURL(
                  new Blob([new Uint8Array(profileImageBuffer.data)], {
                    type: "image/jpeg",
                  })
                )
              : null;

            let imgTest = _arrayBufferToBase64(profileImageBuffer.data);

            console.log("Generated Blob URL:", imageUrl);

            setUserData({
              userName: response.data.body.userName,
              fullName: userFullName,
              email: response.data.body.email,
              userImage: imageUrl, // Usar la URL del Blob
              about: response.data.body.about,
            });
          } else {
            console.log(response.data.body);
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

    return () => {
      // Limpieza del efecto
      if (userData.userImage) {
        URL.revokeObjectURL(userData.userImage);
      }
    };
  }, []);

  return (
    <div className="profile-container">
      <Header />
      <section className="profile">
        <h2 className="perfil-titulo">{userData.fullName}</h2>
        <div className="profile-info">
          {/* <div className="img-container">
            <img
              src={
                "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              }
              alt="Profile avatar"
              className="profile-avatar"
            />
          </div> */}
          <div className="img-container">
            <img
              src={
                userData.userImage ||
                "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              }
              alt="Profile avatar"
              className="profile-avatar"
            />
          </div>

          <div className="profile-details">
            <p>
              <strong>{userData.userName}</strong>
            </p>
            <p>
              <strong>{userData.email}</strong>
            </p>
            <p>
              <strong>Acerca de:</strong> <br />{" "}
              <p>
                <strong>{userData.about}</strong>
              </p>
            </p>
          </div>
        </div>
        <div className="buttonsContainer">
          <div className="buttonsContent">
            <a href="/EditProfile">Editar perfil</a>
            <a href="/EditarPremios">Productos</a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProfileInfo;
