import { CheckCircle2, Circle } from 'lucide-react';

export default function RoadmapTimeline({ items, completedIds = [] }) {
  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <h3 style={{ marginBottom: '24px' }}>Your Learning Roadmap</h3>
      <div style={{ position: 'relative', paddingLeft: '16px' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: '23px',
          top: '24px',
          bottom: '24px',
          width: '2px',
          background: 'var(--glass-border)'
        }}></div>

        {items.map((item, index) => (
          <div key={item.id} style={{ display: 'flex', gap: '16px', marginBottom: index === items.length - 1 ? '0' : '24px', position: 'relative' }}>
            <div style={{ background: 'var(--bg-dark)', borderRadius: '50%', padding: '4px', zIndex: 1 }}>
              {completedIds.includes(item.id) ? 
                <CheckCircle2 size={24} color="var(--accent)" /> : 
                <Circle size={24} color="var(--text-muted)" />
              }
            </div>
            <div style={{ flex: 1, paddingTop: '2px' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '4px' }}>{item.duration}</div>
              <h4 style={{ marginBottom: '4px' }}>{item.title}</h4>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>Focus: {item.targetSkill}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
