import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to the Contacto!!</h1>
      <button onClick={() => navigate('/register')}>Go to Register</button>
      <button onClick={() => navigate('/login')}>Go to Login</button>
    </div>
  );
}
