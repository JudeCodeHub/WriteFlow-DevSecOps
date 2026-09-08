import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiPlus } from 'react-icons/hi';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2';

function getInitialTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}

function Navbar() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('writeflow-theme', theme);
    } catch (e) {
      // ignore write failures (private browsing, storage disabled)
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          Writeflow
        </Link>
        <div className="navbar-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title="Toggle theme"
          >
            {theme === 'dark' ? <HiOutlineSun size={18} /> : <HiOutlineMoon size={18} />}
          </button>
          <Link to="/create" className="btn btn-primary">
            <HiPlus size={18} />
            <span>New Post</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
