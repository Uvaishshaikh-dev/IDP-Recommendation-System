import { roleRequirements, learningResources, allSkills } from '../data/mockData';

export const calculateSkillGaps = (currentSkills, targetRoleId) => {
  const requirements = roleRequirements[targetRoleId];
  if (!requirements) return [];

  const gaps = [];
  
  for (const [skillId, requiredLevel] of Object.entries(requirements)) {
    const currentLevel = currentSkills[skillId] || 0;
    if (currentLevel < requiredLevel) {
      gaps.push({
        skillId,
        skillName: allSkills.find(s => s.id === skillId)?.name || skillId,
        current: currentLevel,
        required: requiredLevel,
        gap: requiredLevel - currentLevel
      });
    }
  }

  // Sort by largest gap first
  return gaps.sort((a, b) => b.gap - a.gap);
};

export const getRecommendations = (gaps) => {
  const recommendations = [];
  
  // For each gap, find up to 2 resources
  gaps.forEach(gap => {
    const resourcesForSkill = learningResources.filter(res => res.targetSkill === gap.skillId);
    if (resourcesForSkill.length > 0) {
      recommendations.push(...resourcesForSkill.slice(0, 2));
    }
  });

  // Remove duplicates and limit to top 4 recommendations to avoid overwhelming
  const uniqueRecs = Array.from(new Set(recommendations.map(r => r.id)))
    .map(id => recommendations.find(r => r.id === id))
    .slice(0, 4);
    
  return uniqueRecs.map((resource, index) => ({ ...resource, priority: index + 1 }));
};

export const calculateReadiness = (currentSkills, targetRoleId) => {
  const requirements = roleRequirements[targetRoleId];
  if (!requirements) return 0;

  const achieved = Object.entries(requirements).reduce((total, [skillId, required]) =>
    total + Math.min(currentSkills[skillId] || 0, required), 0);
  const possible = Object.values(requirements).reduce((total, required) => total + required, 0);
  return Math.round((achieved / possible) * 100);
};

export const formatRadarData = (currentSkills, targetRoleId) => {
  const requirements = roleRequirements[targetRoleId] || {};
  
  return allSkills.map(skill => {
    return {
      subject: skill.name,
      current: currentSkills[skill.id] || 0,
      required: requirements[skill.id] || 0,
      fullMark: 5
    };
  });
};
