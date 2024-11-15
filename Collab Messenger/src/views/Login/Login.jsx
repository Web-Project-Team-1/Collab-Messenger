import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../store/app.context";
import { loginUser } from "../../services/auth.service";
import "./Login.css";

export default function Login() {
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
            setAppState({ user: userCredential.user, userData: null });
            navigate('/');
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
            <h1>Login</h1>
            <label htmlFor="email">Email: </label>
            <input value={credentials.email} onChange={updateCredentials('email')} type="text" name="email" id="email" />
            <br /><br />
            <label htmlFor="password">Password: </label>
            <input value={credentials.password} onChange={updateCredentials('password')} type="password" name="password" id="password" />
            <button onClick={login}>Login</button>
        </div>
    );
}
