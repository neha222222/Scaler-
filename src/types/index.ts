export interface User {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead extends User {
  score: number;
  status: LeadStatus;
  source: string;
  interests: string[];
  engagement: EngagementData;
  qualificationData: QualificationData;
}

export enum LeadStatus {
  COLD = 'cold',
  WARM = 'warm',
  HOT = 'hot',
  QUALIFIED = 'qualified',
  CONVERTED = 'converted',
  LOST = 'lost'
}

export interface EngagementData {
  contentViewed: ContentEngagement[];
  timeSpent: number;
  actions: UserAction[];
  sessionCount: number;
  lastActiveDate: Date;
}

export interface ContentEngagement {
  contentId: string;
  contentType: 'blog' | 'video' | 'course' | 'webinar';
  title: string;
  timeSpent: number;
  completion: number;
  engagementScore: number;
  viewDate: Date;
}

export interface UserAction {
  type: 'view' | 'click' | 'download' | 'share' | 'comment' | 'like';
  target: string;
  timestamp: Date;
  value?: string;
}

export interface QualificationData {
  experience: string;
  currentRole: string;
  goals: string[];
  timeline: string;
  budget: string;
  challenges: string[];
  aiGenerated: boolean;
}

export interface ConversionGoal {
  type: 'consultation' | 'masterclass' | 'course' | 'community';
  title: string;
  description: string;
  value: number;
  priority: number;
}

export interface AIRecommendation {
  type: 'content' | 'offer' | 'action';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  targetConversion: ConversionGoal;
}

export interface EmailSequence {
  id: string;
  name: string;
  trigger: string;
  emails: EmailTemplate[];
  active: boolean;
}

export interface EmailTemplate {
  subject: string;
  content: string;
  delay: number;
  conditions?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface FunnelMetrics {
  totalVisitors: number;
  leadsGenerated: number;
  conversionRate: number;
  averageScore: number;
  stageConversions: Record<LeadStatus, number>;
  topContent: ContentEngagement[];
}