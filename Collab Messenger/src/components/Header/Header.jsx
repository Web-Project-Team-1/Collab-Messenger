import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../../resources/Connecto.png';


function Header() {

    return (
        <header>
            <nav>
                <ul className="nav-links">
                    <li>
                        <NavLink to="/">
                            <img src={logo} alt="Connecto Logo" className="logo" />
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
