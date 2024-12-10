import { Button, Input, Stack, Box, Heading, Text } from "@chakra-ui/react";
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
import { USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH } from "../../common/constants";

const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  const register = async () => {
    if (!user.username || !user.email || !user.password) {
      return alert("Please fill out all fields");
    }

    if (user.username.length < USERNAME_MIN_LENGTH || user.username.length > USERNAME_MAX_LENGTH) {
      return alert(`Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters`);
    }

    try {
      const userFromDB = await getUserByUsername(user.username);
      if (userFromDB) {
        throw new Error(`User ${user.username} already exists`);
      }

      const credential = await registerUser(
        user.email,
        user.password,
        user.username
      );
      await createUserHandle(user.username, credential.user.uid, user.email);

      setAppState({
        user: credential.user,
        userData: null,
      });

      navigate("/login");
    } catch (error) {
      console.error("Register failed", error);
      alert("Registration failed: " + error.message);
    }
  };

  const updateUser = (prop) => (e) => {
    const value = e.target.value;
    setUser({
      ...user,
      [prop]: value,
    });

    if (prop === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
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
          mt={-20}
        >
          <Heading as="h2" size="xl" textAlign="center" mb={4}>
            Register
          </Heading>
          <Text textAlign="center" mb={4}>
            Fill in the form below to create an account
          </Text>
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
                onChange={updateUser("username")}
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
                onChange={updateUser("email")}
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
                onChange={updateUser("password")}
                bg="gray.700"
                _hover={{ bg: "gray.600" }}
                _focus={{ bg: "gray.600" }}
                color="white"
              />
              <PasswordStrengthMeter value={passwordStrength} />
            </Stack>
          </Stack>

          {/* Buttons */}
          <Stack direction="row" spacing={4} justify="flex-end" mt={4}>
            {/* Cancel Button */}
            <Button
              className="cancel-register-button"
              variant="solid"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            {/* Register Button */}
            <Button
              className="register-button"
              variant="solid"
              onClick={register}
            >
              Register
            </Button>
          </Stack>

          {/* "Already have an account?" link below the buttons */}
          <Text textAlign="center" mt={4}>
            Already have an account?{" "}
            <Button
              variant="link"
              bg={"transparent"}
              color="blue.500"
              onClick={() => navigate("/login")}
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
