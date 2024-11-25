import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./FriendRequests.css";
import axios from "axios";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleFriendRequest = async (id, friendRequestAccepted) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/v1/userFriendRequest/friendRequest/${id}`,
        { friendRequestAccepted }
      );

      if (response.status === 200) {
        setFriendRequests((prevRequests) =>
          prevRequests.filter((request) => request.friend_request !== id)
        );
      }
    } catch (err) {
      console.log("ID:", id);
      console.log("friendRequestAccepted:", friendRequestAccepted);
      console.error("Error:", err.response?.data || err.message);
      alert("Hubo un error al procesar la solicitud. Inténtalo de nuevo.");
    }
  };

  const acceptFriendRquest = (id) => {
    handleFriendRequest(id, 1);
  };
  const cancelFriendRquest = (id) => {
    handleFriendRequest(id, 0);
  };

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No se encontró el token.");
          setLoading(false);
          return;
        }

        const decodedToken = jwtDecode(token);
        const idReceptor = decodedToken.id;

        const response = await fetch(
          `http://localhost:3001/api/v1/userFriendRequest/friendRequest/${idReceptor}`
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error del servidor: ${errorText}`);
        }

        const data = await response.json();
        console.log(data.data);
        setFriendRequests(data.data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, []);

  if (loading) return <div>Cargando solicitudes de amistad...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container-fr">
      <Header />
      <div className="content-fr">
        <div className="wrapper">
          <section className="users">
            <div className="header-user-fr">
              <div className="content">
                <img
                  src="https://images.pexels.com/photos/1677533/pexels-photo-1677533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Admin Icon"
                />
                <div className="details">
                  <span>Mis solicitudes de amistad</span>
                </div>
              </div>
            </div>

            <div className="users-list">
              {friendRequests.map((user) => (
                <a className="users-details" key={user.friend_request}>
                  <div className="details">
                    <img
                      src={
                        "https://cdn-icons-png.flaticon.com/512/34/34627.png"
                      }
                      alt={`${user.user_profile_image} icon`}
                    />
                    <span className="nickname">{user.username}</span>
                    <div className="buttons">
                      <button
                        className="accept-btn"
                        onClick={() => acceptFriendRquest(user.friend_request)}
                      >
                        Aceptar
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => cancelFriendRquest(user.friend_request)}
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FriendRequests;
