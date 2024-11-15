import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css'; // Optional for styling

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
