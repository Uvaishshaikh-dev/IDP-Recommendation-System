import { useEffect, useState } from 'react';

import SkillRadarChart from '../components/SkillRadarChart';
import RecommendationCard from '../components/RecommendationCard';
import RoadmapTimeline from '../components/RoadmapTimeline';

import {
    getStudent,
    getDashboard,
    getRecommendations,
    getRoadmap,
    completeResource
} from '../services/api';

import {
    TrendingUp,
    Award,
    Zap,
    CircleAlert,
    CheckCircle2
} from 'lucide-react';

export default function Dashboard() {
    const [student, setStudent] = useState(null);
    const [dashboard, setDashboard] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [roadmap, setRoadmap] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem("idp-user"));
    const studentId = user?.student_id;

    useEffect(() => {
        if (!studentId) {
            setError("No logged-in student found.");
            setLoading(false);
            return;
        }

        async function loadDashboard() {
            try {
                const [
                    studentData,
                    dashboardData,
                    recommendationData,
                    roadmapData
                ] = await Promise.all([
                    getStudent(studentId),
                    getDashboard(studentId),
                    getRecommendations(studentId),
                    getRoadmap(studentId)
                ]);

                setStudent(studentData);
                setDashboard(dashboardData);
                setRecommendations(recommendationData);
                setRoadmap(roadmapData);

                setCompleted(
                    recommendationData
                        .filter(resource => resource.completed)
                        .map(resource => resource.id)
                );
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, [studentId]);

    const toggleRecommendation = async (id) => {
        try {
            const result = await completeResource(id, studentId);

            if (result.completed) {
                setCompleted(current =>
                    current.includes(id)
                        ? current
                        : [...current, id]
                );
            } else {
                setCompleted(current =>
                    current.filter(item => item !== id)
                );
            }
        } catch (error) {
            console.error(error);
            alert('Failed to update progress');
        }
    };

    if (loading) {
        return (
            <div className="animate-fade-in">
                Loading dashboard...
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

    if (!student || !dashboard) {
        return (
            <div className="animate-fade-in">
                No dashboard data found.
            </div>
        );
    }

    const radarData = student.skills.map(skill => {
        const gap = dashboard.skill_gaps.find(
            item => item.skill_id === skill.skill_id
        );

        return {
            subject: skill.skill_name,
            current: skill.level,
            required: gap ? gap.required : skill.level,
            fullMark: 5
        };
    });

    const completionPercentage =
        recommendations.length === 0
            ? 0
            : Math.round(
                (completed.length / recommendations.length) * 100
            );

    return (
        <div className="animate-fade-in">

            <div className="page-header">
                <h1 className="page-title text-gradient">
                    Welcome back, {student.name.split(' ')[0]}
                </h1>

                <p className="text-muted">
                    Here is your personalized development plan to become a {dashboard.career}.
                </p>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px'
                }}
            >

                <div
                    className="glass-panel"
                    style={{
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}
                >
                    <div
                        style={{
                            background: 'rgba(99, 102, 241, 0.2)',
                            padding: '12px',
                            borderRadius: '12px',
                            color: 'var(--primary)'
                        }}
                    >
                        <Award size={24} />
                    </div>

                    <div>
                        <div
                            className="text-muted"
                            style={{ fontSize: '0.875rem' }}
                        >
                            Current Role
                        </div>

                        <div style={{ fontWeight: 600 }}>
                            {student.current_career || 'Not set'}
                        </div>
                    </div>
                </div>

                <div
                    className="glass-panel"
                    style={{
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}
                >
                    <div
                        style={{
                            background: 'rgba(168, 85, 247, 0.2)',
                            padding: '12px',
                            borderRadius: '12px',
                            color: 'var(--secondary)'
                        }}
                    >
                        <TrendingUp size={24} />
                    </div>

                    <div>
                        <div
                            className="text-muted"
                            style={{ fontSize: '0.875rem' }}
                        >
                            Target Role
                        </div>

                        <div style={{ fontWeight: 600 }}>
                            {student.target_career || 'Not set'}
                        </div>
                    </div>
                </div>

                <div
                    className="glass-panel"
                    style={{
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}
                >
                    <div
                        style={{
                            background: 'rgba(20, 184, 166, 0.2)',
                            padding: '12px',
                            borderRadius: '12px',
                            color: 'var(--accent)'
                        }}
                    >
                        <Zap size={24} />
                    </div>

                    <div>
                        <div
                            className="text-muted"
                            style={{ fontSize: '0.875rem' }}
                        >
                            AI Readiness Score
                        </div>

                        <div
                            style={{
                                fontWeight: 600,
                                fontSize: '1.25rem'
                            }}
                        >
                            {dashboard.readiness_score}%
                        </div>
                    </div>
                </div>

                <div
                    className="glass-panel"
                    style={{
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}
                >
                    <div
                        className="progress-circle"
                        style={{
                            background: `conic-gradient(
                                var(--primary) ${completionPercentage * 3.6}deg,
                                rgba(255, 255, 255, 0.08) ${completionPercentage * 3.6}deg
                            )`
                        }}
                    >
                        <span>{completionPercentage}%</span>
                    </div>

                    <div>
                        <div
                            className="text-muted"
                            style={{ fontSize: '0.875rem' }}
                        >
                            Learning Progress
                        </div>

                        <div style={{ fontWeight: 600 }}>
                            {completed.length} of {recommendations.length} completed
                        </div>
                    </div>
                </div>

            </div>

            <div className="dashboard-grid">

                <div className="dashboard-main-col">

                    <div
                        className="glass-panel"
                        style={{ padding: '20px' }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '14px'
                            }}
                        >
                            <CircleAlert
                                size={20}
                                color="var(--secondary)"
                            />

                            <h3>Priority skill gaps</h3>
                        </div>

                        {dashboard.skill_gaps.length ? (
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '10px'
                                }}
                            >
                                {dashboard.skill_gaps
                                    .slice(0, 4)
                                    .map(gap => (
                                        <span
                                            key={gap.skill_id}
                                            style={{
                                                padding: '8px 10px',
                                                borderRadius: '999px',
                                                background: 'rgba(168, 85, 247, 0.14)',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            {gap.skill_name}: level {gap.current} → {gap.required}
                                        </span>
                                    ))}
                            </div>
                        ) : (
                            <p className="text-muted">
                                You meet every requirement for this role.
                            </p>
                        )}
                    </div>

                    <div style={{ marginBottom: '16px' }}>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                marginBottom: '16px'
                            }}
                        >
                            <h2 style={{ fontSize: '1.5rem' }}>
                                Recommended actions
                            </h2>

                            <span className="text-muted">
                                {completed.length} of {recommendations.length} completed
                            </span>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: '20px'
                            }}
                        >
                            {recommendations.map((rec, i) => (
                                <div
                                    key={rec.id}
                                    className={`animate-fade-in animate-delay-${i + 1}`}
                                >
                                    <RecommendationCard
                                        resource={rec}
                                        completed={completed.includes(rec.id)}
                                        onToggle={() =>
                                            toggleRecommendation(rec.id)
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="dashboard-side-col">

                    <SkillRadarChart data={radarData} />

                    <RoadmapTimeline
                        items={roadmap}
                        completedIds={completed}
                    />

                    {completed.length > 0 && (
                        <div
                            className="glass-panel"
                            style={{
                                padding: '16px',
                                display: 'flex',
                                gap: '10px',
                                alignItems: 'center'
                            }}
                        >
                            <CheckCircle2
                                size={20}
                                color="var(--accent)"
                            />

                            <span>
                                {completed.length} action
                                {completed.length === 1 ? '' : 's'}
                                {' '}completed — keep the momentum going.
                            </span>
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}
