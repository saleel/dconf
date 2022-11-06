import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { IdentityContext } from '../contexts/identity-context';

export default function Layout() {
  const { identity, login, logout } = React.useContext(IdentityContext);

  return (
    <>
      <div className="header wrapper">
        <h1 className="logo">
          <Link to="/">
            dconf
          </Link>
        </h1>

        {identity ? (
          <div>
            <div className="menu">
              <button type="button" className="button" onClick={logout}>Logout</button>
            </div>
          </div>
        ) : (
          <div className="menu">
            <button type="button" className="button" onClick={login}>Login</button>
          </div>
        )}

      </div>

      <div className="main wrapper">
        <hr />

        <Outlet />
      </div>

      <div className="footer wrapper">
        API Docs
      </div>
    </>
  );
}
