import { Button, Input, Stack, Box, Heading, Text } from "@chakra-ui/react";
import { useState, useContext } from "react";
import { AppContext } from "../../store/app.context";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";
import { createUserHandle, getUserByUsername } from "../../services/users.service";
import "./Register.css";

const Register = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: ''
  });

  const { setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  const register = async () => {
    if (!user.username || !user.email || !user.password) {
      return alert('Please fill out all fields');
    }

    try {
      const userFromDB = await getUserByUsername(user.username);
      if (userFromDB) {
        throw new Error(`User ${user.username} already exists`);
      }

      const credential = await registerUser(user.email, user.password, user.username);
      await createUserHandle(user.username, credential.user.uid, user.email);

      setAppState({
        user: credential.user,
        userData: null
      });
      navigate('/');
    } catch (error) {
      console.error('Register failed', error);
      alert('Registration failed: ' + error.message);
    }
  };

  const updateUser = (prop) => (e) => {
    setUser({
      ...user,
      [prop]: e.target.value
    });
  };

  return (
    <div className="register-page">
      <div className="home-background"></div>
      <div className="content-container">
        <Box maxW="sm" w="full" p={6} borderRadius="md" boxShadow="lg" bg="gray.800" color="white">
          <Heading as="h2" size="xl" textAlign="center" mb={4}>Register</Heading>
          <Text textAlign="center" mb={4}>Fill in the form below to create an account</Text>
          <Stack gap="4" w="full">
            <Input
              placeholder="Username"
              value={user.username}
              onChange={updateUser('username')}
              bg="gray.700"
              _hover={{ bg: "gray.600" }}
              _focus={{ bg: "gray.600" }}
              color="white"
            />
            <Input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={updateUser('email')}
              bg="gray.700"
              _hover={{ bg: "gray.600" }}
              _focus={{ bg: "gray.600" }}
              color="white"
            />
            <Input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={updateUser('password')}
              bg="gray.700"
              _hover={{ bg: "gray.600" }}
              _focus={{ bg: "gray.600" }}
              color="white"
            />
          </Stack>
          <Stack direction="row" spacing={4} justify="flex-end" mt={4}>
            <Button variant="outline" onClick={() => navigate('/')}>Cancel</Button>
            <Button variant="solid" onClick={register}>Register</Button>
          </Stack>
        </Box>
      </div>
    </div>
  );
};

export default Register;