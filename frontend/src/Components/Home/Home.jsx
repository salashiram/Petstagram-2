import React from "react";
import Header from "../Header/Header";
import UploadSection from "../UploadSection/UploadSection";
import Post from "../Post/Post";
import Footer from "../Footer/Footer";
import "./Home.css"; // Importar CSS

const Inicio = () => {
  return (
    <div className="home-container">
      <Header />
      <main>
        <UploadSection />
      </main>
      <Footer />
    </div>
  );
};

export default Inicio;
