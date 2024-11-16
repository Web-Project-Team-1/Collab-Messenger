import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

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
                            Home
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
