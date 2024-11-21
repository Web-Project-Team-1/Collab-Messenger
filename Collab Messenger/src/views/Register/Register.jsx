import { Button, Input, Stack, Box, Heading, Text, Flex, Center } from "@chakra-ui/react";
import { useState, useContext } from "react";
import {
  PasswordInput,
  PasswordStrengthMeter,
} from "../../components/ui/password-input";
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

      // Redirect to the login page after successful registration
      navigate('/login');
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
        <Box
          maxW="sm"
          w="full"
          p={6}
          borderRadius="md"
          boxShadow="lg"
          bg="gray.800"
          color="white"
          mt={-20} // Adjust this to move it closer to the top
        >
          <Heading as="h2" size="xl" textAlign="center" mb={4}>Register</Heading>
          <Text textAlign="center" mb={4}>Fill in the form below to create an account</Text>
          <Stack gap="4" w="full">
            {/* Username Field */}
            <Stack>
              <label htmlFor="username" className="form-label">
                Username <span className="required">*</span>
              </label>
              <Input
                id="username"
                placeholder="Username"
                value={user.username}
                onChange={updateUser('username')}
                bg="gray.700"
                _hover={{ bg: "gray.600" }}
                _focus={{ bg: "gray.600" }}
                color="white"
              />
            </Stack>

            {/* Email Field */}
            <Stack>
              <label htmlFor="email" className="form-label">
                Email <span className="required">*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={user.email}
                onChange={updateUser('email')}
                bg="gray.700"
                _hover={{ bg: "gray.600" }}
                _focus={{ bg: "gray.600" }}
                color="white"
              />
            </Stack>

            {/* Password Field with Password Strength Meter */}
            <Stack>
              <label htmlFor="password" className="form-label">
                Password <span className="required">*</span>
              </label>
              <PasswordInput
                id="password"
                placeholder="Password"
                value={user.password}
                onChange={updateUser('password')}
                bg="gray.700"
                _hover={{ bg: "gray.600" }}
                _focus={{ bg: "gray.600" }}
                color="white"
              />
              <PasswordStrengthMeter value={2} /> {/* Adjust `value` based on logic */}
            </Stack>
          </Stack>

          {/* Buttons */}
          <Stack direction="row" spacing={4} justify="flex-end" mt={4}>
            {/* Cancel Button */}
            <Button className="cancel-register-button" variant="solid" onClick={() => navigate('/')}>Cancel</Button>
            {/* Register Button */}
            <Button className="register-button" variant="solid" onClick={register}>Register</Button>
          </Stack>

          {/* "Already have an account?" link below the buttons */}
          <Text textAlign="center" mt={4}>
            Already have an account?{" "}
            <Button
              variant="link"
              color="blue.500"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Text>
        </Box>
      </div>
    </div>
  );
};

export default Register;
