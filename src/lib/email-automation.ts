import { Lead, EmailSequence, EmailTemplate, LeadStatus, ContentEngagement } from '@/types';

export class EmailAutomationEngine {
  private static instance: EmailAutomationEngine;
  
  static getInstance(): EmailAutomationEngine {
    if (!EmailAutomationEngine.instance) {
      EmailAutomationEngine.instance = new EmailAutomationEngine();
    }
    return EmailAutomationEngine.instance;
  }

  private emailSequences: EmailSequence[] = [
    {
      id: 'content-reader-nurture',
      name: 'Content Reader Nurture Sequence',
      trigger: 'content_engagement_without_email',
      active: true,
      emails: [
        {
          subject: 'Thanks for reading! Here\'s your personalized learning path 🚀',
          content: this.generateWelcomeEmail(),
          delay: 0 // Immediate
        },
        {
          subject: 'Quick question: What\'s your biggest career challenge?',
          content: this.generateQualificationEmail(),
          delay: 24 * 60 * 60 * 1000, // 24 hours
          conditions: ['no_qualification_data']
        },
        {
          subject: 'Success story: How {name} landed their dream role in 6 months',
          content: this.generateSocialProofEmail(),
          delay: 3 * 24 * 60 * 60 * 1000, // 3 days
        },
        {
          subject: 'Last chance: Free career consultation (expires tomorrow)',
          content: this.generateUrgencyEmail(),
          delay: 7 * 24 * 60 * 60 * 1000, // 7 days
          conditions: ['status_warm_or_hot']
        }
      ]
    },
    {
      id: 'warm-lead-conversion',
      name: 'Warm Lead Conversion Sequence',
      trigger: 'lead_status_warm',
      active: true,
      emails: [
        {
          subject: 'You\'re in the top 20% - Here\'s what comes next',
          content: this.generateWarmLeadEmail(),
          delay: 0
        },
        {
          subject: 'Free masterclass tomorrow: {relevant_topic}',
          content: this.generateMasterclassInvite(),
          delay: 2 * 24 * 60 * 60 * 1000, // 2 days
        },
        {
          subject: 'Quick 15-min call to accelerate your goals?',
          content: this.generateConsultationOfferEmail(),
          delay: 5 * 24 * 60 * 60 * 1000, // 5 days
        }
      ]
    },
    {
      id: 'hot-lead-immediate',
      name: 'Hot Lead Immediate Action',
      trigger: 'lead_status_hot',
      active: true,
      emails: [
        {
          subject: 'Perfect timing! Your spot is reserved ⏰',
          content: this.generateHotLeadEmail(),
          delay: 0
        },
        {
          subject: 'Reminder: Your consultation link expires in 2 hours',
          content: this.generateExpiringOfferEmail(),
          delay: 4 * 60 * 60 * 1000, // 4 hours
          conditions: ['no_conversion_yet']
        }
      ]
    }
  ];

  selectSequenceForLead(lead: Lead): EmailSequence | null {
    // Priority logic for sequence selection
    if (lead.status === LeadStatus.HOT) {
      return this.emailSequences.find(seq => seq.id === 'hot-lead-immediate') || null;
    }
    
    if (lead.status === LeadStatus.WARM) {
      return this.emailSequences.find(seq => seq.id === 'warm-lead-conversion') || null;
    }
    
    if (lead.engagement.contentViewed.length > 0 && !lead.email) {
      return this.emailSequences.find(seq => seq.id === 'content-reader-nurture') || null;
    }
    
    return null;
  }

  personalizeEmail(template: EmailTemplate, lead: Lead): EmailTemplate {
    const personalized = { ...template };
    
    // Basic personalization
    personalized.subject = this.applyPersonalization(template.subject, lead);
    personalized.content = this.applyPersonalization(template.content, lead);
    
    return personalized;
  }

  private applyPersonalization(text: string, lead: Lead): string {
    let personalized = text;
    
    // Replace placeholders
    personalized = personalized.replace(/{name}/g, lead.name || 'there');
    personalized = personalized.replace(/{email}/g, lead.email || '');
    
    // Content-specific personalization
    if (lead.engagement.contentViewed.length > 0) {
      const latestContent = lead.engagement.contentViewed[0];
      personalized = personalized.replace(/{latest_content}/g, latestContent.title);
      personalized = personalized.replace(/{content_type}/g, latestContent.contentType);
    }
    
    // Interest-based personalization
    if (lead.interests.length > 0) {
      const primaryInterest = lead.interests[0];
      personalized = personalized.replace(/{primary_interest}/g, this.formatInterest(primaryInterest));
      personalized = personalized.replace(/{relevant_topic}/g, this.getTopicForInterest(primaryInterest));
    }
    
    // Goal-based personalization
    if (lead.qualificationData?.goals) {
      const primaryGoal = lead.qualificationData.goals[0];
      personalized = personalized.replace(/{primary_goal}/g, this.formatGoal(primaryGoal));
    }
    
    return personalized;
  }

  private formatInterest(interest: string): string {
    return interest.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private getTopicForInterest(interest: string): string {
    const topics: Record<string, string> = {
      'data-science': 'Breaking into Data Science',
      'machine-learning': 'ML Engineering Career Path',
      'software-engineering': 'Software Engineering Excellence',
      'product-management': 'Product Management Mastery',
      'devops': 'DevOps and Cloud Architecture'
    };
    
    return topics[interest] || 'Tech Career Acceleration';
  }

  private formatGoal(goal: string): string {
    const goals: Record<string, string> = {
      'career-switch': 'career transition',
      'skill-upgrade': 'skill enhancement',
      'promotion': 'career advancement',
      'certification': 'professional certification'
    };
    
    return goals[goal] || goal.replace(/-/g, ' ');
  }

  // Email templates
  private generateWelcomeEmail(): string {
    return `
Hi {name},

Thank you for engaging with our content! I noticed you've been exploring {content_type} about {primary_interest} - that's fantastic!

Based on your interests, I've curated a personalized learning path that could accelerate your journey toward {primary_goal}:

✅ Advanced {primary_interest} masterclass (Free)
✅ Industry insights from top companies
✅ Career roadmap specifically for your background

Would you like me to send you this personalized roadmap?

Just reply "YES" or click here: [Get My Personalized Roadmap]

Looking forward to helping you succeed!

Best regards,
The Scaler Team

P.S. This roadmap has helped 500+ professionals land their dream roles in top tech companies.
    `.trim();
  }

  private generateQualificationEmail(): string {
    return `
Hi {name},

Quick question for you...

I've seen that you're interested in {primary_interest}, but I'd love to understand your specific situation better so I can send you the most relevant resources.

Could you take 30 seconds to answer:

1. What's your current role/background?
2. What's your biggest challenge in reaching your career goals?
3. What's your ideal timeline for making progress?

[Answer These Questions] (2-minute form)

Once I know more about your situation, I can share:
- Success stories from people with similar backgrounds
- Specific action steps that worked for them
- Opportunities that might be perfect for you right now

Talk soon!

Best,
Career Success Team at Scaler
    `.trim();
  }

  private generateSocialProofEmail(): string {
    return `
Hi {name},

I wanted to share an inspiring story with you...

Just last month, one of our students Sarah (similar background to yours) landed a {primary_interest} role at Google with a 40% salary increase.

Here's what she did:

✅ Started with our free masterclass (like you're considering)
✅ Got personalized career guidance
✅ Built the right skills with expert mentorship
✅ Landed interviews at 5 top companies

"I was skeptical about another online course, but the personalized approach made all the difference. Within 6 months, I went from feeling stuck to having multiple offers." - Sarah K.

Ready to write your own success story?

[Book Your Free Career Consultation] 

We have just 3 slots left this week.

Cheering you on!

The Scaler Success Team
    `.trim();
  }

  private generateUrgencyEmail(): string {
    return `
Hi {name},

I don't want you to miss out on this...

You've been exploring {primary_interest} resources, and I can see you're serious about making a career move. 

The free consultation slots I mentioned? We're down to the last 2 spots for this month, and they typically book up completely.

Here's what you'll get in your 15-minute call:
✅ Personalized career roadmap for your background
✅ Hidden job market insights
✅ Salary negotiation strategies
✅ Next steps to fast-track your progress

This expires tomorrow at midnight.

[Claim Your Free Consultation Slot]

Don't let another month go by wondering "what if?"

Talk soon,
Career Success Team

P.S. If you're not ready for a consultation, no worries! Just reply and let me know what resources would be most helpful for your {primary_goal}.
    `.trim();
  }

  private generateWarmLeadEmail(): string {
    return `
Hi {name},

Congratulations! 🎉

Based on your engagement and interests, you're in the top 20% of professionals actively working toward {primary_goal}.

That puts you ahead of most people, but I want to make sure you don't lose momentum.

Here's what successful career changers do at this stage:

1. Get clarity on their exact next steps
2. Connect with others on the same journey  
3. Access insider knowledge from industry experts

I'd like to invite you to a special masterclass happening this week: "{relevant_topic}"

This isn't generic advice - it's specifically designed for ambitious professionals like you who are ready to take action.

[Reserve Your Spot (Free)] 

Only 50 spots available.

Excited to see you there!

Best,
{sender_name}
    `.trim();
  }

  private generateMasterclassInvite(): string {
    return `
Hi {name},

Tomorrow's masterclass on "{relevant_topic}" is going to be incredible!

Here's what we'll cover:
✅ The #1 mistake that keeps talented people stuck
✅ Hidden strategies top companies don't want you to know
✅ Live Q&A with industry experts
✅ Action plan you can start implementing immediately

Time: Tomorrow at 7 PM IST
Duration: 60 minutes + Q&A
Investment: Free (normally $97)

[Join the Masterclass Tomorrow]

Can't make it live? Register anyway and we'll send you the recording.

See you tomorrow!

{sender_name}
Scaler Academy
    `.trim();
  }

  private generateConsultationOfferEmail(): string {
    return `
Hi {name},

How did you find the masterclass on {relevant_topic}?

I've been thinking about your situation, and I believe a quick 15-minute conversation could really accelerate your progress toward {primary_goal}.

In this call, we'll:
✅ Create a personalized roadmap based on your background
✅ Identify the fastest path to your target role
✅ Uncover opportunities you might be missing
✅ Answer any specific questions you have

This isn't a sales call - it's a genuine opportunity to get expert guidance tailored to your situation.

[Book Your 15-Minute Career Call]

Available times this week:
- Wednesday 2 PM IST
- Thursday 4 PM IST  
- Friday 11 AM IST

Looking forward to helping you break through to the next level!

Best regards,
{sender_name}
    `.trim();
  }

  private generateHotLeadEmail(): string {
    return `
Hi {name},

Perfect timing! 🎯

I can see you're highly engaged and serious about {primary_goal}. Based on your activity, I believe you're ready for the next step.

I've reserved a priority consultation slot just for you:

📅 Available: Today & Tomorrow
⏱️ Duration: 15 minutes
💰 Investment: Free
🎁 Bonus: Personalized career roadmap worth $197

This isn't available to everyone - only for our most engaged community members like yourself.

[Claim Your Priority Slot Now]

⚠️ This link expires in 6 hours to maintain exclusivity.

What you'll get:
✅ Clear next steps for your specific situation
✅ Industry insights from our network
✅ Fast-track strategies that work
✅ Direct answers to your questions

Ready to accelerate your journey?

Best,
{sender_name}
Senior Career Advisor, Scaler
    `.trim();
  }

  private generateExpiringOfferEmail(): string {
    return `
Hi {name},

Just a quick reminder...

Your priority consultation slot expires in 2 hours!

I'd hate for you to miss this opportunity, especially since you've shown such strong interest in {primary_interest}.

[Claim Your Spot Before It Expires] ⏰

If the timing doesn't work, just reply to this email and I'll do my best to find another slot for you.

But after tonight, these priority consultations won't be available again until next month.

Don't let this opportunity pass you by!

Quick link: [Book Now - Expires in 2 Hours]

Best,
{sender_name}
    `.trim();
  }

  async triggerSequence(lead: Lead, sequenceId: string): Promise<boolean> {
    const sequence = this.emailSequences.find(seq => seq.id === sequenceId);
    if (!sequence || !sequence.active) {
      return false;
    }

    // In a real implementation, this would integrate with an email service
    console.log(`Triggered email sequence "${sequence.name}" for lead ${lead.id}`);
    
    // Schedule emails based on delays
    sequence.emails.forEach((email, index) => {
      setTimeout(() => {
        const personalizedEmail = this.personalizeEmail(email, lead);
        this.sendEmail(lead, personalizedEmail);
      }, email.delay);
    });

    return true;
  }

  private async sendEmail(lead: Lead, email: EmailTemplate): Promise<boolean> {
    // Mock email sending - in real implementation would use SendGrid, Mailgun, etc.
    console.log(`Sending email to ${lead.email}:`);
    console.log(`Subject: ${email.subject}`);
    console.log(`Content: ${email.content.substring(0, 200)}...`);
    
    return true;
  }

  getSequenceAnalytics(sequenceId: string): {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
  } {
    // Mock analytics - in real implementation would fetch from email service
    return {
      sent: 1247,
      opened: 623,
      clicked: 187,
      converted: 43,
      openRate: 0.499,
      clickRate: 0.15,
      conversionRate: 0.034
    };
  }
}