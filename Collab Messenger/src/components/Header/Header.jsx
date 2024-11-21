import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import logo from '../../resources/Connecto.png';
import { Button } from '@chakra-ui/react';

function Header() {
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
                </ul>
            </nav>
        </header>
    );
}

export default Header;
