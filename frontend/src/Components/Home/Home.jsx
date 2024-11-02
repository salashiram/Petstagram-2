import React from "react";
import Header from "../Header/Header";
import UploadSection from "../UploadSection/UploadSection";
import Post from "../Post/Post";
import Footer from "../Footer/Footer";
import "./Home.css"; // Importar CSS
// import styles from "./Home.module.css";

// import ejemplo1 from "./views/Assets/"; // Importar imagen

const Inicio = () => {
  return (
    <div className="home-container">
      <Header />
      <main>
        <UploadSection />
        <Post
          username="UsuarioMascota"
          imageSrc={null} // Usar la imagen importada
          caption="Gato coqueto :p ."
          initialLikes={0} // Asegúrate de que sea un número aquí
        />
      </main>
      <Footer />
    </div>
  );
};

export default Inicio;
