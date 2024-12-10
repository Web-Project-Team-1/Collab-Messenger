import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './store/app.context';
import Register from './views/Register/Register';
import Login from './views/Login/Login';
import { useState, useEffect } from 'react';
import { auth } from './config/firebase.config';
import { getUserData } from './services/users.service';
import Signup from './views/Signup/Signup';
import Home from './views/Home/Home';
import TeamPageLayout from './views/TeamPage/TeamPageLayout';
import Profile from './views/Profile/Profile';
import { Spinner, Center } from '@chakra-ui/react';
import PersonalChats from './views/PersonalChats/PersonalChats';
import JitsiMeet from './components/JitsiMeet';
import StartMeeting from './views/StartMeeting/StartMeeting';

if (process.env.NODE_ENV !== 'production') {
  const originalWarn = console.warn;
  console.warn = (message, ...args) => {
    if (
      typeof message === 'string' &&
      (message.includes('React Router Future Flag Warning') ||
        message.includes('You can use the `v7_startTransition` future flag') ||
        message.includes('v7_relativeSplatPath future flag'))
    ) {
      return; // Suppress the specific warnings
    }
    originalWarn(message, ...args); // Call the original console.warn for other warnings
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
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
          <Route
            path="/personal-chats"
            element={
              <AuthenticatedRoute>
                <PersonalChats />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/video-call/:roomId"
            element={
              <AuthenticatedRoute>
                <JitsiMeet />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/start-meeting"
            element={
              <AuthenticatedRoute>
                <StartMeeting />
              </AuthenticatedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
