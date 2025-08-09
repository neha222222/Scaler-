import { Lead, LeadStatus, AIRecommendation, ConversionGoal } from '@/types';
import { AILeadEngine } from './ai-engine';
import { EmailAutomationEngine } from './email-automation';

export interface RoutingRule {
  id: string;
  name: string;
  condition: (lead: Lead) => boolean;
  action: RoutingAction;
  priority: number;
  active: boolean;
}

export interface RoutingAction {
  type: 'email_sequence' | 'sales_notification' | 'chatbot_trigger' | 'content_recommendation' | 'consultation_booking';
  parameters: Record<string, any>;
  delay?: number; // milliseconds
}

export class LeadScoringAndRoutingSystem {
  private static instance: LeadScoringAndRoutingSystem;
  private aiEngine: AILeadEngine;
  private emailEngine: EmailAutomationEngine;
  private routingRules: RoutingRule[];

  private constructor() {
    this.aiEngine = AILeadEngine.getInstance();
    this.emailEngine = EmailAutomationEngine.getInstance();
    this.routingRules = this.initializeRoutingRules();
  }

  static getInstance(): LeadScoringAndRoutingSystem {
    if (!LeadScoringAndRoutingSystem.instance) {
      LeadScoringAndRoutingSystem.instance = new LeadScoringAndRoutingSystem();
    }
    return LeadScoringAndRoutingSystem.instance;
  }

  private initializeRoutingRules(): RoutingRule[] {
    return [
      // High-priority hot lead routing
      {
        id: 'hot_lead_immediate',
        name: 'Hot Lead Immediate Action',
        condition: (lead) => lead.score >= 80 && lead.status === LeadStatus.HOT,
        action: {
          type: 'sales_notification',
          parameters: {
            priority: 'urgent',
            message: 'Hot lead requires immediate attention - high conversion probability'
          }
        },
        priority: 1,
        active: true
      },
      
      // Consultation-ready leads
      {
        id: 'consultation_ready',
        name: 'Consultation Ready Routing',
        condition: (lead) => 
          lead.score >= 70 && 
          !!lead.qualificationData?.timeline && 
          ['immediate', '1-3-months'].includes(lead.qualificationData.timeline) &&
          !!lead.email,
        action: {
          type: 'consultation_booking',
          parameters: {
            booking_type: 'priority',
            consultant_type: 'senior',
            message: 'Priority consultation booking for qualified lead'
          }
        },
        priority: 2,
        active: true
      },

      // High-engagement anonymous visitors
      {
        id: 'anonymous_high_engagement',
        name: 'Anonymous High Engagement',
        condition: (lead) => 
          !lead.email && 
          lead.engagement.sessionCount >= 3 && 
          lead.engagement.timeSpent >= 600, // 10 minutes
        action: {
          type: 'chatbot_trigger',
          parameters: {
            trigger_type: 'engagement_popup',
            message: 'I noticed you\'ve been exploring our content - can I help you find what you\'re looking for?',
            offer_type: 'email_capture'
          },
          delay: 30000 // 30 seconds
        },
        priority: 3,
        active: true
      },

      // Content-specific interest routing
      {
        id: 'data_science_interest',
        name: 'Data Science Interest Routing',
        condition: (lead) => 
          lead.interests.includes('data-science') && 
          lead.score >= 40 &&
          !!lead.email,
        action: {
          type: 'email_sequence',
          parameters: {
            sequence_id: 'data_science_nurture',
            personalization_level: 'high'
          }
        },
        priority: 4,
        active: true
      },

      // Warm lead nurturing
      {
        id: 'warm_lead_nurture',
        name: 'Warm Lead Nurturing',
        condition: (lead) => 
          lead.status === LeadStatus.WARM && 
          !!lead.email &&
          !lead.qualificationData,
        action: {
          type: 'email_sequence',
          parameters: {
            sequence_id: 'warm-lead-conversion',
            include_qualification_survey: true
          }
        },
        priority: 5,
        active: true
      },

      // Re-engagement for inactive leads
      {
        id: 'inactive_reengagement',
        name: 'Inactive Lead Re-engagement',
        condition: (lead) => {
          const daysSinceLastActive = Math.floor(
            (Date.now() - lead.engagement.lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          return lead.score >= 50 && daysSinceLastActive >= 7 && daysSinceLastActive <= 30;
        },
        action: {
          type: 'email_sequence',
          parameters: {
            sequence_id: 'reengagement_campaign',
            include_special_offer: true
          }
        },
        priority: 6,
        active: true
      },

      // Content recommendation for engaged readers
      {
        id: 'content_reader_recommendations',
        name: 'Content Reader Recommendations',
        condition: (lead) => 
          lead.engagement.contentViewed.length >= 2 && 
          lead.score < 60,
        action: {
          type: 'content_recommendation',
          parameters: {
            recommendation_type: 'personalized',
            content_count: 3,
            include_cta: true
          }
        },
        priority: 7,
        active: true
      },

      // Low-engagement email capture
      {
        id: 'low_engagement_capture',
        name: 'Low Engagement Email Capture',
        condition: (lead) => 
          !lead.email && 
          lead.engagement.sessionCount >= 2 && 
          lead.engagement.timeSpent >= 180, // 3 minutes
        action: {
          type: 'chatbot_trigger',
          parameters: {
            trigger_type: 'exit_intent',
            message: 'Before you go, want me to send you our free career guide?',
            offer_type: 'lead_magnet'
          }
        },
        priority: 8,
        active: true
      }
    ];
  }

  async processLead(lead: Lead): Promise<{
    updatedLead: Lead;
    actionsTriggered: RoutingAction[];
    recommendations: AIRecommendation[];
  }> {
    // First, update lead scoring
    const intelligence = await this.aiEngine.processLeadIntelligence(lead);
    
    const updatedLead: Lead = {
      ...lead,
      score: intelligence.updatedScore,
      status: intelligence.newStatus,
      updatedAt: new Date()
    };

    // Find applicable routing rules
    const applicableRules = this.routingRules
      .filter(rule => rule.active && rule.condition(updatedLead))
      .sort((a, b) => a.priority - b.priority);

    // Execute routing actions
    const actionsTriggered: RoutingAction[] = [];
    
    for (const rule of applicableRules) {
      try {
        await this.executeRoutingAction(rule.action, updatedLead);
        actionsTriggered.push(rule.action);
        
        // Log the action for analytics
        this.logRoutingAction(rule.id, updatedLead.id, rule.action);
        
        // Some rules are mutually exclusive (e.g., don't trigger multiple email sequences)
        if (this.isExclusiveAction(rule.action.type)) {
          break;
        }
      } catch (error) {
        console.error(`Failed to execute routing action for rule ${rule.id}:`, error);
      }
    }

    return {
      updatedLead,
      actionsTriggered,
      recommendations: intelligence.recommendations
    };
  }

  private async executeRoutingAction(action: RoutingAction, lead: Lead): Promise<void> {
    const delay = action.delay || 0;
    
    setTimeout(async () => {
      switch (action.type) {
        case 'email_sequence':
          await this.emailEngine.triggerSequence(lead, action.parameters.sequence_id);
          break;
          
        case 'sales_notification':
          await this.notifySalesTeam(lead, action.parameters);
          break;
          
        case 'chatbot_trigger':
          await this.triggerChatbot(lead, action.parameters);
          break;
          
        case 'content_recommendation':
          await this.sendContentRecommendations(lead, action.parameters);
          break;
          
        case 'consultation_booking':
          await this.triggerConsultationBooking(lead, action.parameters);
          break;
          
        default:
          console.warn(`Unknown routing action type: ${action.type}`);
      }
    }, delay);
  }

  private async notifySalesTeam(lead: Lead, parameters: Record<string, any>): Promise<void> {
    // In real implementation, this would integrate with CRM/sales tools
    const notification = {
      leadId: lead.id,
      priority: parameters.priority || 'normal',
      message: parameters.message,
      leadScore: lead.score,
      leadData: {
        email: lead.email,
        interests: lead.interests,
        qualificationData: lead.qualificationData,
        engagementSummary: {
          sessions: lead.engagement.sessionCount,
          timeSpent: lead.engagement.timeSpent,
          contentViewed: lead.engagement.contentViewed.length
        }
      },
      timestamp: new Date()
    };
    
    console.log('Sales Team Notification:', notification);
    
    // Mock integration calls
    // await slackAPI.sendMessage('#sales', formatSalesNotification(notification));
    // await crmAPI.createTask(notification);
  }

  private async triggerChatbot(lead: Lead, parameters: Record<string, any>): Promise<void> {
    // In real implementation, this would trigger chatbot display
    console.log(`Triggering chatbot for lead ${lead.id}:`, {
      triggerType: parameters.trigger_type,
      message: parameters.message,
      offerType: parameters.offer_type
    });
    
    // Mock chatbot trigger
    // await chatbotAPI.trigger({
    //   leadId: lead.id,
    //   trigger: parameters.trigger_type,
    //   message: parameters.message,
    //   context: { leadScore: lead.score, interests: lead.interests }
    // });
  }

  private async sendContentRecommendations(lead: Lead, parameters: Record<string, any>): Promise<void> {
    const recommendations = this.generateContentRecommendations(lead, parameters.content_count || 3);
    
    console.log(`Sending content recommendations to ${lead.email}:`, recommendations);
    
    // Mock content recommendation delivery
    // await emailAPI.sendContentRecommendations(lead.email, recommendations);
  }

  private generateContentRecommendations(lead: Lead, count: number): Array<{title: string, url: string, type: string}> {
    const baseRecommendations = [
      { title: 'Complete Data Science Career Guide', url: '/guide/data-science-career', type: 'guide' },
      { title: 'Machine Learning Interview Prep', url: '/course/ml-interview-prep', type: 'course' },
      { title: 'Salary Negotiation Masterclass', url: '/masterclass/salary-negotiation', type: 'masterclass' },
      { title: 'Tech Career Transition Stories', url: '/success-stories', type: 'case-study' },
      { title: 'Free Coding Assessment', url: '/assessment/coding-skills', type: 'assessment' }
    ];
    
    // Filter based on lead interests and engagement history
    const viewedContent = new Set(lead.engagement.contentViewed.map(c => c.contentId));
    const availableContent = baseRecommendations.filter(rec => !viewedContent.has(rec.url));
    
    return availableContent.slice(0, count);
  }

  private async triggerConsultationBooking(lead: Lead, parameters: Record<string, any>): Promise<void> {
    console.log(`Triggering consultation booking for lead ${lead.id}:`, parameters);
    
    // Mock consultation booking trigger
    // await calendlyAPI.createPriorityBookingLink({
    //   leadId: lead.id,
    //   consultantType: parameters.consultant_type,
    //   priority: parameters.booking_type === 'priority'
    // });
  }

  private isExclusiveAction(actionType: string): boolean {
    return ['email_sequence'].includes(actionType);
  }

  private logRoutingAction(ruleId: string, leadId: string, action: RoutingAction): void {
    const logEntry = {
      timestamp: new Date(),
      ruleId,
      leadId,
      actionType: action.type,
      parameters: action.parameters
    };
    
    // In real implementation, send to analytics service
    console.log('Routing Action Log:', logEntry);
  }

  // Analytics and monitoring
  getRulePerformance(): Record<string, {
    triggered: number;
    successful: number;
    conversionRate: number;
    avgTimeToConversion: number;
  }> {
    // Mock analytics - in real implementation, fetch from analytics service
    return {
      'hot_lead_immediate': {
        triggered: 147,
        successful: 89,
        conversionRate: 0.605,
        avgTimeToConversion: 2.3 // hours
      },
      'consultation_ready': {
        triggered: 234,
        successful: 167,
        conversionRate: 0.713,
        avgTimeToConversion: 4.7 // hours
      },
      'warm_lead_nurture': {
        triggered: 892,
        successful: 234,
        conversionRate: 0.262,
        avgTimeToConversion: 72.5 // hours
      }
    };
  }

  optimizeRules(): void {
    const performance = this.getRulePerformance();
    
    // Auto-optimize rules based on performance
    this.routingRules.forEach(rule => {
      const perf = performance[rule.id];
      if (perf && perf.conversionRate < 0.1) {
        console.log(`Rule ${rule.name} has low performance - consider optimization`);
        // In real implementation, might adjust conditions or disable rule
      }
    });
  }

  // Manual rule management
  addRule(rule: RoutingRule): void {
    this.routingRules.push(rule);
  }

  updateRule(ruleId: string, updates: Partial<RoutingRule>): boolean {
    const ruleIndex = this.routingRules.findIndex(r => r.id === ruleId);
    if (ruleIndex >= 0) {
      this.routingRules[ruleIndex] = { ...this.routingRules[ruleIndex], ...updates };
      return true;
    }
    return false;
  }

  deactivateRule(ruleId: string): boolean {
    return this.updateRule(ruleId, { active: false });
  }

  getActiveRules(): RoutingRule[] {
    return this.routingRules.filter(rule => rule.active);
  }
}