/* TODO: BORRAR //TEST */
import React, { useEffect, useState } from "react";
import "./LoginForm.css";
import axios from "axios";

const LoginForm = () => {
  const [loginData, setLoginData] = useState({
    LogUsuario: "",
    LogContrasena: "",
  });

  const [registerData, setRegisterData] = useState({
    RegUsuario: "",
    RegNombre: "",
    RegApellido: "",
    RegCorreo: "",
    RegContrasena: "",
    Genero: "1",
  });

  useEffect(() => {
    const btnIniciarSesion = document.getElementById("btn__iniciar-sesion");
    const btnRegistrarse = document.getElementById("btn__registrarse");
    const formularioLogin = document.querySelector(".formulario__login");
    const formularioRegister = document.querySelector(".formulario__register");
    const contenedorLoginRegister = document.querySelector(
      ".contenedor__login-register"
    );
    const cajaTraseraLogin = document.querySelector(".caja__trasera-login");
    const cajaTraseraRegister = document.querySelector(
      ".caja__trasera-register"
    );

    const anchoPage = () => {
      if (window.innerWidth > 850) {
        cajaTraseraRegister.style.display = "block";
        cajaTraseraLogin.style.display = "block";
      } else {
        cajaTraseraRegister.style.display = "block";
        cajaTraseraRegister.style.opacity = "1";
        cajaTraseraLogin.style.display = "none";
        formularioLogin.style.display = "block";
        contenedorLoginRegister.style.left = "0px";
        formularioRegister.style.display = "none";
      }
    };

    const iniciarSesion = () => {
      if (window.innerWidth > 850) {
        formularioLogin.style.display = "block";
        contenedorLoginRegister.style.left = "10px";
        formularioRegister.style.display = "none";
        cajaTraseraRegister.style.opacity = "1";
        cajaTraseraLogin.style.opacity = "0";
      } else {
        formularioLogin.style.display = "block";
        contenedorLoginRegister.style.left = "0px";
        formularioRegister.style.display = "none";
        cajaTraseraRegister.style.display = "block";
        cajaTraseraLogin.style.display = "none";
      }
    };

    const register = () => {
      if (window.innerWidth > 850) {
        formularioRegister.style.display = "block";
        contenedorLoginRegister.style.left = "410px";
        formularioLogin.style.display = "none";
        cajaTraseraRegister.style.opacity = "0";
        cajaTraseraLogin.style.opacity = "1";
      } else {
        formularioRegister.style.display = "block";
        contenedorLoginRegister.style.left = "0px";
        formularioLogin.style.display = "none";
        cajaTraseraRegister.style.display = "none";
        cajaTraseraLogin.style.display = "block";
        cajaTraseraLogin.style.opacity = "1";
      }
    };

    // Añadir los event listeners
    if (btnIniciarSesion && btnRegistrarse) {
      btnIniciarSesion.addEventListener("click", iniciarSesion);
      btnRegistrarse.addEventListener("click", register);
    }

    window.addEventListener("resize", anchoPage);
    anchoPage(); // Ejecuta una vez al cargar

    // Limpiar event listeners al desmontar el componente
    return () => {
      if (btnIniciarSesion && btnRegistrarse) {
        btnIniciarSesion.removeEventListener("click", iniciarSesion);
        btnRegistrarse.removeEventListener("click", register);
      }
      window.removeEventListener("resize", anchoPage);
    };
  }, []);

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const loginValidate = async (e) => {
    e.preventDefault();
    try {
      //TEST
      console.log("Datos enviados", {
        email: loginData.LogUsuario,
        password: loginData.LogContrasena,
      });
      //TEST

      const response = await axios.post("http://localhost:3001/api/v1/login", {
        email: loginData.LogUsuario,
        password: loginData.LogContrasena,
      });

      console.log(response.data);
      alert("Inicio de sesion exitoso");
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      alert("Error al iniciar sesión, verifica tus credenciales");
    }
  };

  const registerValidate = async (e) => {
    e.preventDefault();
    try {
      //TEST
      console.log("Datos enviados", {
        userName: registerData.RegUsuario,
        fullName: registerData.RegNombre + " " + registerData.RegApellido,
        email: registerData.RegCorreo,
        pass: registerData.RegContrasena,
        gender: registerData.Genero,
        userImage: null,
      });
      //TEST
      const response = await axios.post("http://localhost:3001/api/v1/user", {
        userName: registerData.RegUsuario,
        fullName: `${registerData.RegNombre} ${registerData.RegApellido}`,
        email: registerData.RegCorreo,
        pass: registerData.RegContrasena,
        gender: registerData.Genero,
        userImage: null,
      });
      console.log(response.data);
      alert("Usuario registrado con exito");
    } catch (error) {
      console.error("Error al registrar el usuario", error);
      alert("Error al registrar, intenta de nuevo");
    }
  };

  return (
    <main>
      <div className="contenedor__todo">
        <div className="caja__trasera">
          <div className="caja__trasera-login">
            <h3>¿Ya tienes una cuenta? ¡Inicia sesión!</h3>
            <p>Inicia sesión para entrar</p>
            <button id="btn__iniciar-sesion">Iniciar Sesión</button>
          </div>

          <div className="caja__trasera-register">
            <h3>¿No tienes una cuenta? ¡Regístrate gratis ahora!</h3>
            <p>Regístrate</p>
            <button id="btn__registrarse">Registrarse</button>
          </div>
        </div>

        <div className="contenedor__login-register">
          {/* Formulario de login */}
          <form className="formulario__login" onSubmit={loginValidate}>
            <h2>Iniciar Sesión</h2>
            <input
              type="text"
              required
              placeholder="Nombre de usuario"
              name="LogUsuario"
              value={loginData.LogUsuario}
              onChange={handleLoginChange}
            />
            <input
              type="password"
              required
              placeholder="Contraseña"
              name="LogContrasena"
              value={loginData.LogContrasena}
              onChange={handleLoginChange}
            />
            <button type="submit" className="btn btn-primary">
              Iniciar sesión
            </button>
          </form>

          {/* Formulario de registro */}
          <form className="formulario__register" onSubmit={registerValidate}>
            <h2>Registrarse</h2>
            <input
              type="text"
              required
              placeholder="Nombre de Usuario"
              name="RegUsuario"
              value={registerData.RegUsuario}
              onChange={handleRegisterChange}
            />
            <input
              type="text"
              required
              placeholder="Nombres"
              name="RegNombre"
              value={registerData.RegNombre}
              onChange={handleRegisterChange}
            />
            <input
              type="text"
              required
              placeholder="Apellidos"
              name="RegApellido"
              value={registerData.RegApellido}
              onChange={handleRegisterChange}
            />
            <input
              type="text"
              required
              placeholder="Correo Electronico"
              name="RegCorreo"
              value={registerData.RegCorreo}
              onChange={handleRegisterChange}
            />
            <input
              type="password"
              required
              placeholder="Contraseña mínimo 8 caracteres"
              name="RegContrasena"
              value={registerData.RegContrasena}
              onChange={handleRegisterChange}
            />
            <select
              name="Genero"
              value={registerData.Genero}
              onChange={handleRegisterChange}
            >
              <option value="1">Femenino</option>
              <option value="2">Masculino</option>
            </select>

            <button type="submit" className="btn btn-primary">
              Registrarse ahora
            </button>
          </form>

          {/* Formulario de subir imagen */}
          <form
            className="formulario__register"
            onSubmit={(e) => e.preventDefault()}
          >
            <h2>Selecciona tu imagen</h2>
            <input type="file" name="foto" id="foto" />
            <button type="submit" className="btn btn-primary">
              Subir imagen
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default LoginForm;
