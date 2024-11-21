import { Button, Input, Stack, Box, Heading, Text } from "@chakra-ui/react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../store/app.context";
import { loginUser } from "../../services/auth.service";
import { getUserData } from "../../services/users.service";
import "./Login.css";

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const { setAppState } = useContext(AppContext);
    const navigate = useNavigate();

    const login = async () => {
        if (!credentials.email || !credentials.password) {
            return alert('Please enter both email and password');
        }

        try {
            const userCredential = await loginUser(credentials.email, credentials.password);
            const firebaseUser = userCredential.user;

            const userData = await getUserData(firebaseUser.uid);
            setAppState({ user: firebaseUser, userData });

            navigate('/teams');
        } catch (error) {
            console.error('Login failed', error);
            alert('Login failed: ' + error.message);
        }
    };

    const updateCredentials = (prop) => (e) => {
        setCredentials({
            ...credentials,
            [prop]: e.target.value
        });
    };

    return (
        <div className="login-page">
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
                    mt={-40} // Adjust this to move it closer to the top
                >
                    <Heading as="h2" size="xl" textAlign="center" mb={4}>Login</Heading>
                    <Text textAlign="center" mb={4}>Enter your credentials to log in</Text>
                    <Stack gap="4" w="full">
                        <Input
                            placeholder="Email"
                            value={credentials.email}
                            onChange={updateCredentials('email')}
                            bg="gray.700"
                            _hover={{ bg: "gray.600" }}
                            _focus={{ bg: "gray.600" }}
                            color="white"
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={updateCredentials('password')}
                            bg="gray.700"
                            _hover={{ bg: "gray.600" }}
                            _focus={{ bg: "gray.600" }}
                            color="white"
                        />
                    </Stack>

                    {/* Buttons */}
                    <Stack direction="row" spacing={4} justify="flex-end" mt={4}>
                        <Button variant="outline" onClick={() => navigate('/')}>Cancel</Button>
                        <Button variant="solid" onClick={login}>Login</Button>
                    </Stack>

                    {/* "Don't have an account?" link below the buttons */}
                    <Text textAlign="center" mt={4}>
                        Don't have an account?{" "}
                        <Button
                            variant="link"
                            color="blue.500"
                            onClick={() => navigate('/register')}
                        >
                            Register
                        </Button>
                    </Text>
                </Box>
            </div>
        </div>
    );
};

export default Login;
