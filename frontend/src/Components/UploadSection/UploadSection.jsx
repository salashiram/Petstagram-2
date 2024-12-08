import React, { useEffect, useState } from "react";
import Post from "../Post/Post";
import "./UploadSection.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadSection = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  // const handleFileChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   if (selectedFile) {
  //     setFile(selectedFile);
  //     console.log("Nombre del archivo:", selectedFile.name);
  //   }
  // };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // La imagen convertida a base64 está en reader.result
        setFile(reader.result);
        console.log("Imagen en base64:", reader.result);
      };
      reader.readAsDataURL(selectedFile); // Convierte la imagen a base64
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
            // Procesar cada post para agregar la URL generada
            const processedPosts = response.data.data.map((post) => {
              const postImageBuffer = post.post_image;
              const imageUrl = postImageBuffer?.data
                ? URL.createObjectURL(
                    new Blob([new Uint8Array(postImageBuffer.data)], {
                      type: "image/jpeg",
                    })
                  )
                : null;

              return {
                ...post,
                imageUrl, // Agregar la URL generada al post
              };
            });

            setPosts(processedPosts);
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
        const userName = decodedToken.firstName;

        const postLevel = document.getElementById("postLevel").value;

        const postPayload = {
          idUser: userId,
          title: "untitled",
          content: description,
          postImage: file, // Aquí `file` es la imagen en formato base64
          postLevel,
        };

        console.log("Post Payload enviado al backend:", postPayload);

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
            const newPost = { ...response.data.post, user_name: userName };
            setPosts([newPost, ...posts]);
            // navigate("/Home");
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

      <div className="posts-container">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post.post_id}
              user_id={post.user_id}
              username={post.user_name}
              // imageSrc={
              //   "https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              // }
              imageSrc={post.imageUrl}
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
