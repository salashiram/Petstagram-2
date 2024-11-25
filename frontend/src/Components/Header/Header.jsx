import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  // TODO: borrar token desde backend tambien, solo lo hace desde el frontend,
  // aun se podran hacer peticiones con el mismo token desde el endpoint
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/LoginForm");
  };
  return (
    <header>
      <nav>
        <div className="logo">🐾 Petstagram</div>
        <ul className="menu-left">
          <li>
            <a href="/Home">Inicio</a>
          </li>
          <li>
            <a href="/Recompensas">Recompensas</a>
          </li>
          <li>
            <a href="/topMascotas">TOP Mascotas</a>
          </li>
          <li>
            <a href="/UserProfile">Perfil</a>
          </li>
          <li>
            <a href="/FriendRequests">Solicitudes de amistad</a>
          </li>
        </ul>
        <ul className="menu-right">
          <li>
            <a href="/Explorar">Explorar</a>
          </li>
          <li>
            <a href="/ShoppingCart">
              <img
                src="https://cdn-icons-png.flaticon.com/512/34/34627.png"
                alt="Carrito"
                className="cart-icon"
              />
            </a>
          </li>
          <li>
            <a
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              href="#"
            >
              Logout
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
