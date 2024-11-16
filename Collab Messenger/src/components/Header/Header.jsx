import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import logo from '../../resources/headerlogo.png';

function Header() {
    return (
        <header>
            <nav>
                <ul>
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
