import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  React.useEffect(() => {
    document.title = 'dconf';
  }, []);

  return (
    <div className="page home-page">

      <div className="intro mb-5">
        
        dconf

      </div>

    </div>
  );
}

export default HomePage;
