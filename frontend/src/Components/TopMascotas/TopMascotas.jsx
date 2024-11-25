import React from "react";
import Header from "../Header/Header";
import Announcement from "../Announcement/Announcement.jsx";
import Post from "../Post/Post.jsx";
import Footer from "../Footer/Footer";
import ejemplo2 from "../Assets/ejemplo2.jpg"; // Importar imagen
import ejemplo4 from "../Assets/ejemplo4.jpg"; // Importar imagen
import "./TopMascotas.css"; // Importar CSS

const TopMascotas = () => {
  return (
    <div className="TopMascotas-container">
      <Header />
      <Announcement />
      <main className="Main_Top_Macotas">
        <h2 className="perfil-titulo">LOS REYES DEL HOGAR</h2>
        <Post
          username="MascotaUno"
          imageSrc={ejemplo2} // Usar la imagen importada
          caption="Gato coqueto :p."
          ranking={1}
        />
      </main>
      <Footer />
    </div>
  );
};

export default TopMascotas;
