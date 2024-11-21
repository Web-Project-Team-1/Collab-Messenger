import { useNavigate } from "react-router-dom";
import { Box, Heading, Button, VStack } from "@chakra-ui/react";
import "./Signup.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box
      className="home-page"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      color="white"
      textAlign="center"
      pt="10vh"
    >
      <Heading as="h1" mb={8} fontSize="4xl">
        Welcome to Connecto!
      </Heading>

      <VStack spacing={4}>
        <Button
          colorScheme="blue"
          width="200px"
          size="lg"
          onClick={() => navigate("/register")}
        >
          Go to Register
        </Button>
        <Button
          colorScheme="blue"
          width="200px"
          size="lg"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </Button>
      </VStack>
    </Box>
  );
}
