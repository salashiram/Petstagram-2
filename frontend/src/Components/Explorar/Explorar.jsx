import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Explorar.css";

const RegisteredUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No se encontró el token de autenticación.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:3001/api/v1/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.body);
    } catch (error) {
      console.error("Error al obtener usuarios", error);
      alert("Hubo un error al cargar los usuarios.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="explorer-main-container">
      <Header />
      <div className="body_container_users_registered">
        <div className="container_users_registered">
          <h1>Tal vez te pueda interesar: </h1>
          <div className="users_registered_list">
            {users.map((user) => (
              <div className="users_registered_card" key={user.idUser}>
                <img
                  src={
                    "https://images.pexels.com/photos/1677533/pexels-photo-1677533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" ||
                    "../Assets/usericon.jpg"
                  }
                  alt="Avatar"
                  className="avatar"
                />
                <div className="users_registered_info">
                  {/* <Link to={`/UserProfile2/${user.idUser}`} className="">
                    {user.userName}
                  </Link> */}
                  {/* <h2>{user.userName}</h2> <p>{user.firstName}</p>{" "} */}
                  <h2>
                    {" "}
                    <Link to={`/UserProfile2/${user.idUser}`} className="">
                      {user.userName}
                    </Link>
                  </h2>
                  <p>{user.firstName + " " + user.lastName}</p>
                </div>
                {/* <button className="users_registered_btn">Agregar</button> */}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisteredUsers;
