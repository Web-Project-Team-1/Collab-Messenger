import { useState, useContext } from "react";
import { AppContext } from "../../store/app.context";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";
import { createUserHandle, getUserByUsername } from "../../services/users.service";
import "./Register.css";

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
      <h1>Register</h1>
      <label htmlFor="username">Username: </label>
      <input value={user.username} onChange={updateUser('username')} type="text" name="username" id="username" />
      <br /><br />
      <label htmlFor="email">Email: </label>
      <input value={user.email} onChange={updateUser('email')} type="text" name="email" id="email" />
      <br /><br />
      <label htmlFor="password">Password: </label>
      <input value={user.password} onChange={updateUser('password')} type="password" name="password" id="password" />
      <button onClick={register}>Register</button>
    </div>
  );
}
