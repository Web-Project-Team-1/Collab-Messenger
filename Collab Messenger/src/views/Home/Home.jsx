import { useNavigate } from "react-router-dom";
import "./Home.css";
import { Button } from "@chakra-ui/react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-background"></div>
      <div className="content-container">
        <h1>Welcome to Connecto!</h1>
        <div className="buttons-home">
          <Button variant={'surface'} onClick={() => navigate('/register')}>Go to Register</Button>
          <Button variant={'surface'} onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    </div>
  );
}
