import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-background"></div>
      <div className="content-container">
        <h1>Welcome to Connecto!</h1>
        <div className="buttons-home">
          <button onClick={() => navigate('/register')}>Go to Register</button>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    </div>
  );
}
