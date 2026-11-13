import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Briefcase,
  Code2,
  BookOpen,
  TrendingUp,
  UserRound,
  LogOut
} from 'lucide-react';

import { getAdminDashboard } from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const result = await getAdminDashboard();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('idp-user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        Loading admin dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        Error: {error}
      </div>
    );
  }

  return (
    <div
      className="animate-fade-in"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '20px',
          marginBottom: '30px'
        }}
      >

        <div
          className="page-header"
          style={{
            margin: 0,
            textAlign: 'center',
            flex: 1
          }}
        >
          <h1 className="page-title text-gradient">
            Admin Dashboard
          </h1>

          <p className="text-muted">
            Monitor students, careers, skills and learning resources.
          </p>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <LogOut size={17} />
          Logout
        </button>

      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '18px',
          marginBottom: '32px'
        }}
      >

        <StatCard
          icon={<Users size={24} />}
          title="Total Students"
          value={data.total_students}
        />

        <StatCard
          icon={<Briefcase size={24} />}
          title="Career Paths"
          value={data.total_careers}
        />

        <StatCard
          icon={<Code2 size={24} />}
          title="Skills"
          value={data.total_skills}
        />

        <StatCard
          icon={<BookOpen size={24} />}
          title="Learning Resources"
          value={data.total_resources}
        />

        <StatCard
          icon={<TrendingUp size={24} />}
          title="Average Readiness"
          value={`${data.average_readiness}%`}
        />

      </div>

      <div
        className="glass-panel"
        style={{
          padding: '24px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '22px'
          }}
        >
          <UserRound
            size={22}
            color="var(--primary)"
          />

          <h2 style={{ margin: 0 }}>
            Students Overview
          </h2>
        </div>

        {data.students.length === 0 ? (

          <p className="text-muted">
            No students found.
          </p>

        ) : (

          <div
            style={{
              display: 'grid',
              gap: '12px'
            }}
          >

            {data.students.map(student => (

              <div
                key={student.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '2fr 1.5fr 1.5fr 110px',
                  gap: '20px',
                  alignItems: 'center',
                  padding: '18px 20px',
                  borderRadius: '14px',
                  background:
                    'rgba(255,255,255,0.04)',
                  border:
                    '1px solid var(--glass-border)',
                  boxSizing: 'border-box'
                }}
              >

                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  >
                    {student.name}
                  </div>

                  <div
                    className="text-muted"
                    style={{
                      fontSize: '0.8rem',
                      marginTop: '3px'
                    }}
                  >
                    {student.email}
                  </div>
                </div>

                <InfoBlock
                  label="Current Role"
                  value={
                    student.current_career ||
                    'Not set'
                  }
                />

                <InfoBlock
                  label="Target Role"
                  value={
                    student.target_career ||
                    'Not set'
                  }
                />

                <div>
                  <div
                    className="text-muted"
                    style={{
                      fontSize: '0.75rem',
                      marginBottom: '4px'
                    }}
                  >
                    Readiness
                  </div>

                  <div
                    style={{
                      fontWeight: 700,
                      color: 'var(--accent)',
                      fontSize: '1rem'
                    }}
                  >
                    {student.readiness_score !== null
                      ? `${student.readiness_score}%`
                      : 'N/A'}
                  </div>
                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '20px',
        minHeight: '110px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxSizing: 'border-box'
      }}
    >

      <div
        style={{
          flexShrink: 0,
          background:
            'rgba(99, 102, 241, 0.2)',
          padding: '12px',
          borderRadius: '12px',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon}
      </div>

      <div style={{ minWidth: 0 }}>

        <div
          className="text-muted"
          style={{
            fontSize: '0.875rem'
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontWeight: 700,
            fontSize: '1.3rem',
            marginTop: '2px'
          }}
        >
          {value}
        </div>

      </div>

    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div style={{ minWidth: 0 }}>

      <div
        className="text-muted"
        style={{
          fontSize: '0.75rem',
          marginBottom: '4px'
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: '0.95rem',
          fontWeight: 500,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {value}
      </div>

    </div>
  );
}