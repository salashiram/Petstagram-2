// UploadSection.jsx
import React, { useState } from "react";
import Post from "../Post/Post";
import "./UploadSection.css";

const UploadSection = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const targetWidth = 600;
          const targetHeight = 400;
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const scale = Math.min(
            targetWidth / img.width,
            targetHeight / img.height
          );
          const x = targetWidth / 2 - (img.width / 2) * scale;
          const y = targetHeight / 2 - (img.height / 2) * scale;

          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          const resizedImageUrl = canvas.toDataURL("image/png");

          setPreview((prev) => [
            ...prev,
            {
              src: resizedImageUrl,
              caption: description || "Nueva publicación de mascota.",
              likes: 0,
            },
          ]);
          setFile(null);
          setDescription("");
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="upload-section">
      <label htmlFor="file-upload" className="upload-button">
        +
      </label>
      <input
        type="file"
        id="file-upload"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <input
        type="text"
        id="description"
        placeholder="Escribe una descripción..."
        value={description}
        onChange={handleDescriptionChange}
      />
      <button onClick={handleUpload}>Subir Foto</button>
      <div className="preview-container">
        {preview.map((post, index) => (
          <Post
            key={index}
            username="UsuarioMascota"
            imageSrc={post.src}
            caption={post.caption}
            initialLikes={post.likes}
          />
        ))}
      </div>
    </section>
  );
};

export default UploadSection;
