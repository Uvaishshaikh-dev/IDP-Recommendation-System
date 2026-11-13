import { BookOpen, Video, Users, ArrowRight, Check, Wrench } from 'lucide-react';

export default function RecommendationCard({ resource, completed, onToggle }) {

  const getIcon = (type) => {
    switch (type) {
      case 'Course':
        return <Video size={20} className="text-muted" />;
      case 'Book':
        return <BookOpen size={20} className="text-muted" />;
      case 'Mentorship':
        return <Users size={20} className="text-muted" />;
      case 'Workshop':
        return <Wrench size={20} className="text-muted" />;
      default:
        return <BookOpen size={20} className="text-muted" />;
    }
  };

  const handleClick = () => {
    if (!completed && resource.url) {
      window.open(resource.url, '_blank');
    }

    onToggle();
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '20px',
        transition: 'transform 0.3s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '12px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.05)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.75rem'
          }}
        >
          {getIcon(resource.type)}
          <span>{resource.type}</span>
        </div>

        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--accent)',
            fontWeight: 600
          }}
        >
          {resource.difficulty}
        </span>
      </div>

      <h4
        style={{
          marginBottom: '8px',
          fontSize: '1.1rem'
        }}
      >
        {resource.title}
      </h4>

      <p
        className="text-muted"
        style={{
          fontSize: '0.875rem',
          marginBottom: '16px',
          lineHeight: 1.5
        }}
      >
        {resource.description}
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '16px'
        }}
      >
        <div
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>By {resource.provider}</div>
          <div>{resource.duration}</div>
        </div>

        <button
          type="button"
          className={completed ? 'btn-primary' : 'btn-secondary'}
          onClick={handleClick}
          style={{
            padding: '6px 12px',
            fontSize: '0.875rem'
          }}
        >
          {completed ? (
            <>
              Done <Check size={16} />
            </>
          ) : (
            <>
              Start <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}