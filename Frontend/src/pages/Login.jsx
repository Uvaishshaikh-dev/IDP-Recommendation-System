import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LogIn,
    ShieldCheck,
    UserRound,
    UserPlus
} from 'lucide-react';

import { loginUser, registerUser } from '../services/api';


export default function Login() {
    const navigate = useNavigate();

    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            if (isRegistering) {

                const result = await registerUser(
                    name,
                    email,
                    password
                );

                if (!result.success) {
                    setError(
                        result.message || 'Registration failed.'
                    );
                    return;
                }

                localStorage.setItem(
                    'idp-user',
                    JSON.stringify(result.user)
                );

                navigate('/');

            } else {

                const result = await loginUser(
                    email,
                    password
                );

                if (!result.role) {
                    setError(
                        result.message || 'Invalid email or password.'
                    );
                    return;
                }

                const user = {
                    id: result.id,
                    email: result.email,
                    role: result.role,
                    student_id: result.student_id
                };

                localStorage.setItem(
                    'idp-user',
                    JSON.stringify(user)
                );

                if (user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }

        } catch (error) {

            console.error(error);

            setError('Unable to connect to the server.');

        } finally {

            setLoading(false);

        }
    };


    const switchMode = () => {
        setIsRegistering(!isRegistering);
        setError('');
    };


    return (
        <div
            className="animate-fade-in"
            style={{
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                boxSizing: 'border-box'
            }}
        >
            <div
                className="glass-panel"
                style={{
                    width: '100%',
                    maxWidth: '440px',
                    padding: '40px',
                    boxSizing: 'border-box'
                }}
            >
                <div
                    style={{
                        textAlign: 'center',
                        marginBottom: '30px'
                    }}
                >
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '64px',
                            height: '64px',
                            borderRadius: '18px',
                            background:
                                'linear-gradient(135deg, #6366f1, #a855f7)',
                            boxShadow:
                                '0 10px 30px rgba(99, 102, 241, 0.35)',
                            marginBottom: '18px'
                        }}
                    >
                        {isRegistering ? (
                            <UserPlus size={30} color="white" />
                        ) : (
                            <LogIn size={30} color="white" />
                        )}
                    </div>

                    <div
                        style={{
                            fontSize: '0.8rem',
                            letterSpacing: '3px',
                            fontWeight: 600,
                            color: 'var(--primary)',
                            marginBottom: '8px'
                        }}
                    >
                        IDP RECOMMENDATION SYSTEM
                    </div>

                    <h1
                        className="text-gradient"
                        style={{
                            fontSize: '2.2rem',
                            margin: '0 0 8px'
                        }}
                    >
                        {isRegistering
                            ? 'CREATE ACCOUNT'
                            : 'LOGIN'}
                    </h1>

                    <p className="text-muted">
                        {isRegistering
                            ? 'Create your personalized learning journey.'
                            : 'Welcome back! Sign in to continue.'}
                    </p>
                </div>


                <form onSubmit={handleSubmit}>

                    {isRegistering && (
                        <div style={{ marginBottom: '20px' }}>
                            <label
                                className="text-muted"
                                style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '0.875rem'
                                }}
                            >
                                Full Name
                            </label>

                            <input
                                className="input-glass"
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="Enter your name"
                                required
                                style={{
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    )}


                    <div style={{ marginBottom: '20px' }}>
                        <label
                            className="text-muted"
                            style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '0.875rem'
                            }}
                        >
                            Email Address
                        </label>

                        <input
                            className="input-glass"
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                            style={{
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>


                    <div style={{ marginBottom: '22px' }}>
                        <label
                            className="text-muted"
                            style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '0.875rem'
                            }}
                        >
                            Password
                        </label>

                        <input
                            className="input-glass"
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            required
                            style={{
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>


                    {error && (
                        <div
                            style={{
                                padding: '12px 14px',
                                marginBottom: '20px',
                                borderRadius: '10px',
                                background:
                                    'rgba(239, 68, 68, 0.12)',
                                border:
                                    '1px solid rgba(239, 68, 68, 0.2)',
                                color: '#f87171',
                                fontSize: '0.875rem'
                            }}
                        >
                            {error}
                        </div>
                    )}


                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{
                            width: '100%',
                            minHeight: '48px',
                            justifyContent: 'center',
                            fontSize: '0.95rem'
                        }}
                    >
                        {isRegistering ? (
                            <UserPlus size={18} />
                        ) : (
                            <LogIn size={18} />
                        )}

                        {loading
                            ? isRegistering
                                ? 'Creating account...'
                                : 'Signing in...'
                            : isRegistering
                                ? 'Create Account'
                                : 'Sign In'}
                    </button>

                </form>


                <div
                    style={{
                        textAlign: 'center',
                        marginTop: '20px'
                    }}
                >
                    <span className="text-muted">
                        {isRegistering
                            ? 'Already have an account? '
                            : "Don't have an account? "}
                    </span>

                    <button
                        type="button"
                        onClick={switchMode}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            padding: 0
                        }}
                    >
                        {isRegistering
                            ? 'Sign In'
                            : 'Create Account'}
                    </button>
                </div>


                <div
                    style={{
                        marginTop: '30px',
                        paddingTop: '20px',
                        borderTop:
                            '1px solid var(--glass-border)'
                    }}
                >
                    <div
                        style={{
                            textAlign: 'center',
                            marginBottom: '14px'
                        }}
                    >
                        <span
                            className="text-muted"
                            style={{
                                fontSize: '0.75rem'
                            }}
                        >
                            SECURE PORTAL
                        </span>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '10px'
                        }}
                    >
                        <div
                            style={{
                                padding: '12px',
                                borderRadius: '10px',
                                background:
                                    'rgba(255,255,255,0.035)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <UserRound
                                size={16}
                                color="var(--primary)"
                            />

                            <span
                                className="text-muted"
                                style={{
                                    fontSize: '0.78rem'
                                }}
                            >
                                Student
                            </span>
                        </div>

                        <div
                            style={{
                                padding: '12px',
                                borderRadius: '10px',
                                background:
                                    'rgba(255,255,255,0.035)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <ShieldCheck
                                size={16}
                                color="var(--primary)"
                            />

                            <span
                                className="text-muted"
                                style={{
                                    fontSize: '0.78rem'
                                }}
                            >
                                Admin
                            </span>
                        </div>
                    </div>
                </div>


                <p
                    className="text-muted"
                    style={{
                        textAlign: 'center',
                        fontSize: '0.7rem',
                        marginTop: '22px',
                        marginBottom: 0
                    }}
                >
                    Personalized Individual Development Plans
                </p>

            </div>
        </div>
    );
}