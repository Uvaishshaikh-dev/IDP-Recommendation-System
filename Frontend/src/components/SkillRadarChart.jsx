import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function SkillRadarChart({ data }) {
  return (
    <div className="glass-panel" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '16px' }}>Skill Gap Analysis</h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
            <Radar name="Current Skills" dataKey="current" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.5} />
            <Radar name="Required for Target Role" dataKey="required" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.3} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-darker)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-main)' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px', fontSize: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)', opacity: 0.8 }}></div>
          <span>Current Skills</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent)', opacity: 0.8 }}></div>
          <span>Target Role</span>
        </div>
      </div>
    </div>
  );
}
