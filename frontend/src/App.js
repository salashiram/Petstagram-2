import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./Components/LoginForm/LoginForm";
import ProfileInfo from "./Components/UserProfile/UserProfile";
import Recompensas from "./Components/Recompensas/Recompensas";
import Home from "./Components/Home/Home";
import TopMascotas from "./Components/TopMascotas/TopMascotas";
import EditProfile from "./Components/EditarPerfil/EditarPerfil";
import FriendRequests from "./Components/SolicitudesAmistad/FriendRequests";
import UserProfile2 from "./Components/UserProfile2/UserProfile2";
import ShoppingCart from "./Components/ShoppingCart/ShoppingCart";
import EditarPremios from "./Components/EditarPremios/EditarPremios";
import Explorar from "./Components/Explorar/Explorar";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/LoginForm" element={<LoginForm />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/UserProfile" element={<ProfileInfo />} />
        <Route path="/Recompensas" element={<Recompensas />} />
        <Route path="/TopMascotas" element={<TopMascotas />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/FriendRequests" element={<FriendRequests />} />
        <Route path="/UserProfile2/:id" element={<UserProfile2 />} />
        <Route path="/ShoppingCart" element={<ShoppingCart />} />
        <Route path="/EditarPremios" element={<EditarPremios />} />
        <Route path="/Explorar" element={<Explorar />} />
      </Routes>
    </Router>
  );
};

export default App;
