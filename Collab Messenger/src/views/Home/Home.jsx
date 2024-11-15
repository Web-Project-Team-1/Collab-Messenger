import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-background">
        <h1>Welcome to Connecto!</h1>
        <button className='buttons-home' onClick={() => navigate('/register')}>Go to Register</button>
        <button className='buttons-home' onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    </div>
  );
}
