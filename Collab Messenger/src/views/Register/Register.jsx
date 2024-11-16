import { useState, useContext } from "react";
import { AppContext } from "../../store/app.context";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";
import { createUserHandle, getUserByUsername } from "../../services/users.service";
import "./Register.css";
import { Card, Input, Stack } from "@chakra-ui/react"
import { Field } from "../../components/ui/field"
import { Button } from "@chakra-ui/react";

export default function Register() {
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
      <Card.Root maxW="sm">
        <Card.Header>
          <Card.Title>Register</Card.Title>
          <Card.Description>
            Fill in the form below to create an account
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Stack gap="4" w="full">
            <Field label="First Name">
              <Input />
            </Field>
            <Field label="Last Name">
              <Input />
            </Field>
          </Stack>
        </Card.Body>
        <Card.Footer justifyContent="flex-end">
          <Button variant="outline">Cancel</Button>
          <Button variant="ghost">Register</Button>
        </Card.Footer>
      </Card.Root>
    </div>
  );
}
