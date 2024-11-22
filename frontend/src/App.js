import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./Components/LoginForm/LoginForm";
import ProfileInfo from "./Components/UserProfile/UserProfile";
import Recompensas from "./Components/Recompensas/Recompensas";
import Home from "./Components/Home/Home";
import TopMascotas from "./Components/TopMascotas/TopMascotas";
import EditProfile from "./Components/EditarPerfil/EditarPerfil";
import FriendRequests from "./Components/SolicitudesAmistad/FriendRequests";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/UserProfile" element={<ProfileInfo />} />
        <Route path="/Recompensas" element={<Recompensas />} />
        <Route path="/TopMascotas" element={<TopMascotas />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/FriendRequests" element={<FriendRequests />} />
        {/* Otras rutas */}
      </Routes>
    </Router>
  );
};

export default App;
