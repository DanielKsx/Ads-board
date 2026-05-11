import { Routes, Route } from 'react-router-dom';
import AddAd from './pages/AddAd';
import AdPage from './pages/AdPage';
import EditAd from './pages/EditAd';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Header from './components/Header';
import { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/user`, {
      credentials: 'include'
    })
      .then(res => {
        if (res.status === 401) {
          return null;
        }
        return res.json();
      })
      .then(data => {
        setUser(data);
      });
  }, []);

  return (
    <>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ad/:id" element={<AdPage user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ad/add" element={<AddAd user={user} />} />
        <Route path="/ad/edit/:id" element={<EditAd user={user} />} />
        <Route path="/search/:phrase" element={<Search />} />
      </Routes>
    </>
  )
}

export default App;
