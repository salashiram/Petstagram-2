import React from "react";
import "./Header.css"; // Importar CSS

const Header = () => {
  return (
    <header>
      <nav>
        <div className="logo">🐾 Petstagram</div>
        <ul>
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
      </nav>
    </header>
  );
};

export default Header;
