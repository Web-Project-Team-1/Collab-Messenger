import { useState, useContext } from "react";
import { AppContext } from "../../store/app.context";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";
import { createUserHandle, getUserByHandle } from "../../services/users.service";

export default function Register() {
  const [user, setUser] = useState({
    handle: '',
    email: '',
    password: ''
  });
  const { setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  const register = async () => {
    if (!user.handle || !user.email || !user.password) {
      return alert('Please fill out all fields');
    }

    try {
      const userFromDB = await getUserByHandle(user.handle);
      if (userFromDB) {
        throw new Error(`User ${user.handle} already exists`);
      }

      const credential = await registerUser(user.email, user.password, user.handle);
      await createUserHandle(user.handle, credential.user.uid, user.email);

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
    <div>
      <h1>Register</h1>
      <label htmlFor="handle">Username: </label>
      <input value={user.handle} onChange={updateUser('handle')} type="text" name="handle" id="handle" />
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
