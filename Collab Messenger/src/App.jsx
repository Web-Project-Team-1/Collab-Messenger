import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContext } from './store/app.context';
import Register from './views/Register/Register';
import Login from './views/Login/Login';
import { useState, useEffect } from 'react';
import { auth } from './config/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUserData } from './services/users.service';
import Home from './views/Home/Home';

if (process.env.NODE_ENV === "development") {
  const originalWarn = console.warn;
  console.warn = (msg) => {
    if (
      msg.includes("React Router Future Flag Warning: React Router will begin wrapping state updates") ||
      msg.includes("Relative route resolution within Splat routes is changing in v7")
    ) {
      return;
    }
    originalWarn(msg);
  };
}

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });

  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (appState.user !== user) {
      setAppState((prevState) => ({ ...prevState, user }));
    }
  }, [user, appState.user]);

  useEffect(() => {
    if (!user) return;

    getUserData(user.uid)
      .then((data) => {
        if (data) {
          const userData = data[Object.keys(data)[0]];
          setAppState((prevState) => ({
            ...prevState,
            userData,
          }));
        }
      })
      .catch(console.error);
  }, [user]);

  return (
    <AppContext.Provider value={{ ...appState, setAppState }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <footer>&copy;2024</footer>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
