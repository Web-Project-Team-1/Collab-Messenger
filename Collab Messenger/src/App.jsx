import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContext } from './store/app.context';
import Register from './views/Register/Register';
import { useState, useEffect } from 'react';
import { auth } from './config/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUserData } from './services/users.service';
import Home from './views/Home/Home';

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null
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
      .then(data => {
        if (data) {
          const userData = data[Object.keys(data)[0]];
          setAppState((prevState) => ({
            ...prevState,
            userData
          }));
        }
      })
      .catch(console.error);
  }, [user]);

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <footer>&copy;2024</footer>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
