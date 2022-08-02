import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <div className="header wrapper">
        <h1 className="logo">
          <Link to="/">
            dconf
          </Link>
        </h1>

        <div className="menu">
        </div>

      </div>

      <div className="main wrapper">
        <hr />
        <Outlet />
      </div>

      <div className="footer wrapper">
        
      </div>
    </>
  );
}
