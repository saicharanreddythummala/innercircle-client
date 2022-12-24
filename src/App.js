import { Routes, Route } from 'react-router-dom';
import Meta from './utils/Meta';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './pages/register/Register';
import Main from './pages/main/Main';
import Login from './pages/login/Login';
import SetAvatar from './components/setAvatar/SetAvatar';



function App() {
  return (
    <>
      <Meta title="Home" />
      <Routes>
        <Route path="/*" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
      </Routes>
    </>
  );
}

export default App;
