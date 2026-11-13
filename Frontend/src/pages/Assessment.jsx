import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

import {
    submitAssessment,
    getSkills,
    getCareers,
    setCareerGoal
} from '../services/api';

export default function Assessment() {

    const navigate = useNavigate();
    const { profile, updateProfile } = useProfile();

    const [careers, setCareers] = useState([]);
    const [skills, setSkills] = useState({});
    const [backendSkills, setBackendSkills] = useState([]);
    const [targetRole, setTargetRole] = useState(
        profile.targetRole || ''
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadData() {

            try {

                const [skillsData, careersData] =
                    await Promise.all([
                        getSkills(),
                        getCareers()
                    ]);

                setBackendSkills(skillsData);
                setCareers(careersData);

                const initialSkills = {};

                skillsData.forEach(skill => {
                    initialSkills[skill.id] = 0;
                });

                setSkills(initialSkills);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);
            }
        }

        loadData();

    }, []);


    const handleSkillChange = (skillId, value) => {

        setSkills(prev => ({
            ...prev,
            [skillId]: parseInt(value)
        }));
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const savedUser =
                localStorage.getItem('idp-user');

            if (!savedUser) {

                alert('Please login again');

                navigate('/login');

                return;
            }

            const user = JSON.parse(savedUser);
            const studentId = user.student_id;


            if (!studentId) {

                alert('Student account not found');

                return;
            }


            const targetCareer = careers.find(
                career => career.name === targetRole
            );


            if (!targetCareer) {

                alert('Please select a target career');

                return;
            }


            await setCareerGoal({
                student_id: studentId,
                current_career_id: targetCareer.id,
                target_career_id: targetCareer.id
            });


            const assessmentItems =
                backendSkills.map(skill => ({
                    skill_id: skill.id,
                    level: skills[skill.id] || 0
                }));


            await submitAssessment({
                student_id: studentId,
                assessments: assessmentItems
            });


            updateProfile({
                targetRole
            });


            navigate('/');

        } catch (error) {

            console.error(error);

            alert('Failed to save assessment');
        }
    };


    if (loading) {

        return (
            <div className="animate-fade-in">
                Loading assessment...
            </div>
        );
    }


    return (

        <div
            className="animate-fade-in"
            style={{
                maxWidth: '800px',
                margin: '0 auto'
            }}
        >

            <div
                className="page-header"
                style={{
                    textAlign: 'center'
                }}
            >

                <h1 className="page-title text-gradient">
                    Skill Assessment
                </h1>

                <p className="text-muted">
                    Update your skills and career goals to get personalized recommendations.
                </p>

            </div>


            <form
                onSubmit={handleSubmit}
                className="glass-panel"
                style={{
                    padding: '32px'
                }}
            >

                <div
                    style={{
                        marginBottom: '32px'
                    }}
                >

                    <h3
                        style={{
                            marginBottom: '16px'
                        }}
                    >
                        Career Goal
                    </h3>


                    <label
                        className="text-muted"
                        style={{
                            fontSize: '0.875rem'
                        }}
                    >
                        Select Target Role
                    </label>


                    <select
                        className="input-glass"
                        value={targetRole}
                        onChange={e =>
                            setTargetRole(e.target.value)
                        }
                        style={{
                            appearance: 'none',
                            marginTop: '8px'
                        }}
                    >

                        <option value="">
                            Select a role
                        </option>


                        {careers.map(career => (

                            <option
                                key={career.id}
                                value={career.name}
                                style={{
                                    background: 'var(--bg-dark)',
                                    color: 'white'
                                }}
                            >
                                {career.name}
                            </option>

                        ))}

                    </select>

                </div>


                <h3
                    style={{
                        marginBottom: '24px'
                    }}
                >
                    Self Assessment (0: Beginner, 5: Expert)
                </h3>


                <div
                    style={{
                        display: 'grid',
                        gap: '20px'
                    }}
                >

                    {backendSkills.map(skill => (

                        <div
                            key={skill.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingBottom: '16px',
                                borderBottom:
                                    '1px solid var(--glass-border)'
                            }}
                        >

                            <div>

                                <div
                                    style={{
                                        fontWeight: 500
                                    }}
                                >
                                    {skill.name}
                                </div>

                                <div
                                    className="text-muted"
                                    style={{
                                        fontSize: '0.75rem'
                                    }}
                                >
                                    {skill.category}
                                </div>

                            </div>


                            <div
                                style={{
                                    display: 'flex',
                                    gap: '8px',
                                    alignItems: 'center'
                                }}
                            >

                                <input
                                    type="range"
                                    min="0"
                                    max="5"
                                    value={
                                        skills[skill.id] || 0
                                    }
                                    onChange={e =>
                                        handleSkillChange(
                                            skill.id,
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        width: '150px'
                                    }}
                                />

                                <span
                                    style={{
                                        width: '20px',
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        color: 'var(--primary)'
                                    }}
                                >
                                    {skills[skill.id] || 0}
                                </span>

                            </div>

                        </div>

                    ))}

                </div>


                <div
                    style={{
                        marginTop: '32px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '16px'
                    }}
                >

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => navigate('/')}
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        Save & Generate Plan
                        <ArrowRight size={18} />
                    </button>

                </div>

            </form>

        </div>
    );
}