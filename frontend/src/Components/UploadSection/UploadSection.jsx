import React, { useEffect, useState } from "react";
import Post from "../Post/Post";
import "./UploadSection.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const UploadSection = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState([]);
  // const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("Nombre del archivo:", selectedFile.name);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        try {
          const response = await axios.get(
            `http://localhost:3001/api/v1/posts/userPost`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.ok) {
            // Aquí cambiamos de response.data.posts a response.data.data
            setPosts(response.data.data); // Acceder a los posts con response.data.data
          } else {
            setError("No se pudieron cargar los posts.");
          }
        } catch (err) {
          setError("Hubo un error al cargar los posts.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPosts();
  }, []);

  const handleUpload = async () => {
    if (file) {
      const token = localStorage.getItem("token");

      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const userName = decodedToken.firstName; // Suponiendo que el 'firstName' está en el token

        const postPayload = {
          idUser: userId,
          title: "untitled",
          content: description,
          postImage: file.name,
          postLevel: document.getElementById("postLevel").value,
        };

        try {
          const response = await axios.post(
            "http://localhost:3001/api/v1/posts/userPost",
            postPayload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.ok) {
            // Agregar el 'user_name' al nuevo post antes de añadirlo al estado
            const newPost = { ...response.data.post, user_name: userName };
            setPosts([newPost, ...posts]); // Agregar el nuevo post al inicio de la lista
          } else {
            console.error("Error al crear el post:", response.data.message);
          }
        } catch (err) {
          console.error("Error al subir el post:", err);
        }
      }
    }
  };

  if (loading) return <div>Cargando posts...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="upload-section">
      <label htmlFor="file-upload" className="upload-button">
        +
      </label>
      <select name="postLevel" id="postLevel">
        <option value="0">Seleccione una opción</option>
        <option value="1">Solo yo</option>
        <option value="2">Amigos</option>
        <option value="3">Todos</option>
      </select>
      <input
        type="file"
        id="file-upload"
        accept="image/*"
        name="postImage"
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

      {/* Renderizar los posts */}
      <div className="posts-container">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post.post_id}
              username={post.user_name} // Aquí usas el 'user_name' que ya has añadido
              imageSrc={post.user_profile_picture}
              caption={post.post_content}
              initialLikes={null}
            />
          ))
        ) : (
          <div>No hay posts disponibles</div>
        )}
      </div>
    </section>
  );
};

export default UploadSection;
