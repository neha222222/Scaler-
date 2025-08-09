import { Lead, EngagementData, QualificationData, AIRecommendation, ConversionGoal, LeadStatus } from '@/types';

export class AILeadEngine {
  private static instance: AILeadEngine;
  
  static getInstance(): AILeadEngine {
    if (!AILeadEngine.instance) {
      AILeadEngine.instance = new AILeadEngine();
    }
    return AILeadEngine.instance;
  }

  calculateLeadScore(engagement: EngagementData, qualification?: QualificationData): number {
    let score = 0;
    
    // Content engagement scoring (40% weight)
    const contentScore = this.calculateContentEngagementScore(engagement);
    score += contentScore * 0.4;
    
    // Behavioral scoring (30% weight)
    const behaviorScore = this.calculateBehaviorScore(engagement);
    score += behaviorScore * 0.3;
    
    // Qualification scoring (30% weight)
    if (qualification) {
      const qualScore = this.calculateQualificationScore(qualification);
      score += qualScore * 0.3;
    }
    
    return Math.min(Math.max(score, 0), 100);
  }

  private calculateContentEngagementScore(engagement: EngagementData): number {
    if (engagement.contentViewed.length === 0) return 0;
    
    let score = 0;
    let totalWeight = 0;
    
    engagement.contentViewed.forEach(content => {
      const weight = this.getContentWeight(content.contentType);
      const engagementFactor = Math.min(content.completion / 100, 1);
      const timeFactor = Math.min(content.timeSpent / 300, 1); // 5 minutes max
      
      score += (engagementFactor * 50 + timeFactor * 30 + content.engagementScore * 20) * weight;
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? score / totalWeight : 0;
  }

  private calculateBehaviorScore(engagement: EngagementData): number {
    let score = 0;
    
    // Session frequency
    score += Math.min(engagement.sessionCount * 5, 30);
    
    // Recent activity
    const daysSinceLastActive = Math.floor(
      (Date.now() - engagement.lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    score += Math.max(20 - daysSinceLastActive * 2, 0);
    
    // Action diversity
    const actionTypes = new Set(engagement.actions.map(a => a.type));
    score += actionTypes.size * 5;
    
    // Total time spent
    score += Math.min(engagement.timeSpent / 60, 25); // Minutes to score
    
    return Math.min(score, 100);
  }

  private calculateQualificationScore(qualification: QualificationData): number {
    let score = 0;
    
    // Experience level
    const expScore = this.getExperienceScore(qualification.experience);
    score += expScore * 0.25;
    
    // Goal alignment
    const goalScore = this.getGoalAlignmentScore(qualification.goals);
    score += goalScore * 0.3;
    
    // Timeline urgency
    const timelineScore = this.getTimelineScore(qualification.timeline);
    score += timelineScore * 0.25;
    
    // Budget fit
    const budgetScore = this.getBudgetScore(qualification.budget);
    score += budgetScore * 0.2;
    
    return score;
  }

  private getContentWeight(type: string): number {
    const weights = {
      'course': 1.0,
      'webinar': 0.9,
      'video': 0.7,
      'blog': 0.5
    };
    return weights[type as keyof typeof weights] || 0.5;
  }

  private getExperienceScore(experience: string): number {
    const scores = {
      'beginner': 60,
      'intermediate': 80,
      'advanced': 90,
      'expert': 70 // May be overqualified
    };
    return scores[experience as keyof typeof scores] || 50;
  }

  private getGoalAlignmentScore(goals: string[]): number {
    const highValueGoals = ['career-switch', 'skill-upgrade', 'certification', 'promotion'];
    const matches = goals.filter(goal => highValueGoals.includes(goal));
    return Math.min(matches.length * 25, 100);
  }

  private getTimelineScore(timeline: string): number {
    const scores = {
      'immediate': 100,
      '1-3-months': 90,
      '3-6-months': 70,
      '6-12-months': 50,
      'no-timeline': 20
    };
    return scores[timeline as keyof typeof scores] || 30;
  }

  private getBudgetScore(budget: string): number {
    const scores = {
      'premium': 100,
      'standard': 80,
      'budget': 60,
      'free-only': 20,
      'undecided': 40
    };
    return scores[budget as keyof typeof scores] || 30;
  }

  determineLeadStatus(score: number): LeadStatus {
    if (score >= 80) return LeadStatus.HOT;
    if (score >= 60) return LeadStatus.WARM;
    if (score >= 40) return LeadStatus.QUALIFIED;
    return LeadStatus.COLD;
  }

  generateRecommendations(lead: Lead): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    
    // Content recommendations
    if (lead.score < 40) {
      recommendations.push({
        type: 'content',
        title: 'Nurture with Educational Content',
        description: 'Send beginner-friendly resources to build engagement',
        confidence: 0.8,
        reasoning: 'Low engagement score indicates need for foundational content',
        targetConversion: this.getRelevantConversionGoal(lead.interests)
      });
    }
    
    // Direct offer recommendations
    if (lead.score >= 70) {
      recommendations.push({
        type: 'offer',
        title: 'Schedule Career Consultation',
        description: 'High-intent lead ready for direct consultation booking',
        confidence: 0.9,
        reasoning: 'High engagement and qualification scores indicate readiness',
        targetConversion: {
          type: 'consultation',
          title: 'Free Career Consultation',
          description: '30-minute one-on-one career guidance session',
          value: 500,
          priority: 1
        }
      });
    }
    
    // Action recommendations
    if (lead.engagement.sessionCount > 5 && !lead.email) {
      recommendations.push({
        type: 'action',
        title: 'Email Capture Priority',
        description: 'Highly engaged visitor without contact info - prioritize email capture',
        confidence: 0.85,
        reasoning: 'Multiple sessions without lead capture indicates missed opportunity',
        targetConversion: this.getRelevantConversionGoal(lead.interests)
      });
    }
    
    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  private getRelevantConversionGoal(interests: string[]): ConversionGoal {
    // Simple logic to match interests to conversion goals
    if (interests.includes('data-science') || interests.includes('machine-learning')) {
      return {
        type: 'masterclass',
        title: 'Data Science Career Roadmap',
        description: 'Free masterclass on transitioning to data science',
        value: 300,
        priority: 2
      };
    }
    
    return {
      type: 'consultation',
      title: 'Career Consultation',
      description: 'Free consultation call with career expert',
      value: 500,
      priority: 1
    };
  }

  async processLeadIntelligence(lead: Lead): Promise<{
    updatedScore: number;
    newStatus: LeadStatus;
    recommendations: AIRecommendation[];
    nextActions: string[];
  }> {
    const updatedScore = this.calculateLeadScore(lead.engagement, lead.qualificationData);
    const newStatus = this.determineLeadStatus(updatedScore);
    const recommendations = this.generateRecommendations({...lead, score: updatedScore});
    
    const nextActions = this.generateNextActions(lead, updatedScore, newStatus);
    
    return {
      updatedScore,
      newStatus,
      recommendations,
      nextActions
    };
  }

  private generateNextActions(lead: Lead, score: number, status: LeadStatus): string[] {
    const actions: string[] = [];
    
    if (!lead.email && lead.engagement.sessionCount > 2) {
      actions.push('Trigger email capture popup');
    }
    
    if (status === LeadStatus.HOT && lead.qualificationData) {
      actions.push('Send consultation booking link');
      actions.push('Notify sales team');
    }
    
    if (status === LeadStatus.WARM) {
      actions.push('Add to nurture email sequence');
      actions.push('Show relevant masterclass promotion');
    }
    
    if (lead.engagement.contentViewed.length > 0) {
      actions.push('Send personalized content recommendations');
    }
    
    return actions;
  }
}