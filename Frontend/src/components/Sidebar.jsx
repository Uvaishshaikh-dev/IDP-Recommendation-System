import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Layers3,
  LogOut
} from 'lucide-react';

import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/'
    },
    {
      name: 'Assessment',
      icon: <CheckSquare size={20} />,
      path: '/assessment'
    },
    {
      name: 'Flashcards',
      icon: <Layers3 size={20} />,
      path: '/flashcards'
    },
    {
      name: 'Career Goals',
      icon: <Target size={20} />,
      path: '/goals'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('idp-user');
    navigate('/login');
  };

  return (
    <aside
      className="glass-panel"
      style={{
        width: '260px',
        height: 'calc(100vh - 32px)',
        margin: '16px',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        boxSizing: 'border-box'
      }}
    >

      <div
        style={{
          padding: '0 24px',
          marginBottom: '40px'
        }}
      >
        <h2
          className="text-gradient"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Target size={28} />
          IDP
        </h2>
      </div>

      <nav style={{ flex: 1 }}>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}
        >

          {menuItems.map((item) => (
            <li
              key={item.name}
              style={{
                marginBottom: '8px'
              }}
            >

              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 24px',
                  color: isActive
                    ? 'white'
                    : 'var(--text-muted)',
                  textDecoration: 'none',
                  gap: '12px',
                  borderRight: isActive
                    ? '3px solid var(--primary)'
                    : '3px solid transparent',
                  background: isActive
                    ? 'rgba(99, 102, 241, 0.1)'
                    : 'transparent',
                  transition: 'var(--transition)'
                })}
              >
                {item.icon}

                <span
                  style={{
                    fontWeight: 500
                  }}
                >
                  {item.name}
                </span>

              </NavLink>

            </li>
          ))}

        </ul>
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="sidebar-link"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          padding: '12px 24px',
          border: 'none',
          borderTop: '1px solid var(--glass-border)',
          background: 'transparent',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          fontSize: '0.95rem',
          textAlign: 'left'
        }}
      >
        <LogOut size={20} />

        <span
          style={{
            fontWeight: 500
          }}
        >
          Logout
        </span>

      </button>

    </aside>
  );
}