import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './store/app.context';
import Register from './views/Register/Register';
import Login from './views/Login/Login';
import { useState, useEffect } from 'react';
import { auth } from './config/firebase.config';
import { getUserData } from './services/users.service';
import Home from './views/Home/Home';
import Header from './components/Header/Header';
import TeamPageLayout from './views/TeamPage/TeamPageLayout';
import Profile from "./views/Profile/Profile";
import { Spinner, Center } from "@chakra-ui/react";

// Disable warnings in development
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
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getUserData(firebaseUser.uid);
        setAppState({
          user: firebaseUser,
          userData: userData || null,
          loading: false,
        });
      } else {
        setAppState({
          user: null,
          userData: null,
          loading: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const AuthenticatedRoute = ({ children }) => {
    if (appState.loading) {
      return (
        <Center height="100vh">
          <Spinner size="xl" color="teal.500" />
        </Center>
      );
    }

    if (!appState.user) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <AppContext.Provider value={{ ...appState, setAppState }}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/teams"
            element={
              <AuthenticatedRoute>
                <TeamPageLayout />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthenticatedRoute>
                <Profile />
              </AuthenticatedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
