import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../../resources/Connecto.png';
import { Button } from '@chakra-ui/react';
import { signOut } from 'firebase/auth'; 
import { auth } from '../../config/firebase.config'; 

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setIsLoggedIn(!!user); 
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth); 
            setIsLoggedIn(false);
            navigate('/login'); 
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    return (
        <header>
            <nav>
                <ul className="nav-links">
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) => (isActive ? 'active-link' : '')}
                        >
                            <img src={logo} alt="Connecto Logo" className="logo" />
                        </NavLink>
                    </li>
                    {isLoggedIn && (
                        <li className="logout-btn">
                            <Button variant={"outline"} border="2px solid rgb(134, 134, 250);" borderRadius={20} onClick={handleLogout}>Logout</Button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
