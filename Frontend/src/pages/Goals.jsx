import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roles } from '../data/mockData';
import { useProfile } from '../context/ProfileContext';
import { ArrowRight, Target } from 'lucide-react';
import { getCareers, getStudent, setCareerGoal } from '../services/api';

export default function Goals() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();

  const [careers, setCareers] = useState([]);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const careersData = await getCareers();
        const studentData = await getStudent(1);

        setCareers(careersData);
        setStudent(studentData);
      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, []);

  const chooseGoal = async (role) => {
    const targetCareer = careers.find(
      career => career.name === role.name
    );

    const currentCareer = careers.find(
      career => career.name === student?.current_career
    );

    if (!targetCareer || !currentCareer) {
      alert('Career information not found');
      return;
    }

    try {
      await setCareerGoal({
        student_id: 1,
        current_career_id: currentCareer.id,
        target_career_id: targetCareer.id
      });

      updateProfile({
        targetRole: role.name,
        completedRecommendationIds: []
      });

      navigate('/assessment');
    } catch (error) {
      console.error(error);
      alert('Failed to save career goal');
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{ maxWidth: '960px', margin: '0 auto' }}
    >
      <div className="page-header">
        <h1 className="page-title text-gradient">
          Choose your career goal
        </h1>

        <p className="text-muted">
          Select a direction, then calibrate your skills to generate a focused development plan.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '18px'
        }}
      >
        {roles.map((role) => {
          const active = profile.targetRole === role.name;

          return (
            <article
              className="glass-panel"
              key={role.id}
              style={{
                padding: '22px',
                borderColor: active
                  ? 'var(--primary)'
                  : undefined
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  gap: '12px'
                }}
              >
                <div>
                  <Target
                    size={22}
                    color={
                      active
                        ? 'var(--primary)'
                        : 'var(--text-muted)'
                    }
                  />

                  <h3
                    style={{
                      marginTop: '14px',
                      marginBottom: '8px'
                    }}
                  >
                    {role.name}
                  </h3>
                </div>

                {active && (
                  <span
                    style={{
                      color: 'var(--accent)',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    CURRENT GOAL
                  </span>
                )}
              </div>

              <p
                className="text-muted"
                style={{
                  minHeight: '44px',
                  fontSize: '0.9rem',
                  lineHeight: 1.5
                }}
              >
                Get a role-specific gap analysis, curated actions,
                and an ordered learning roadmap.
              </p>

              <button
                type="button"
                className={
                  active ? 'btn-secondary' : 'btn-primary'
                }
                onClick={() => chooseGoal(role)}
                style={{
                  marginTop: '18px',
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                {active ? 'Refine assessment' : 'Set as goal'}
                <ArrowRight size={16} />
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}