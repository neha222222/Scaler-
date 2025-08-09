'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { ChatMessage, Lead, QualificationData } from '@/types';

interface AIChatbotProps {
  lead?: Lead;
  onLeadUpdate?: (leadData: Partial<Lead>) => void;
  onConversionGoal?: (goal: string) => void;
}

export default function AIChatbot({ lead, onLeadUpdate, onConversionGoal }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<'qualification' | 'consultation' | 'general'>('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessage: ChatMessage = {
    id: '1',
    role: 'assistant',
    content: `Hi! I'm Alex, your AI career advisor. I noticed you've been exploring our content - that's awesome! 

I'm here to help you find the perfect learning path based on your goals. What brings you here today?`,
    timestamp: new Date(),
    metadata: { type: 'greeting' }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([initialMessage]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing delay
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    setIsTyping(false);

    const lowerMessage = userMessage.toLowerCase();

    // Qualification flow responses
    if (currentFlow === 'qualification') {
      return generateQualificationResponse(userMessage);
    }

    // Intent detection and routing
    if (lowerMessage.includes('consultation') || lowerMessage.includes('call') || lowerMessage.includes('talk')) {
      setCurrentFlow('consultation');
      return `Great! I'd love to set up a consultation for you. 

Before we proceed, could you tell me:
1. What's your current role or background?
2. What career goal are you working toward?
3. What's your biggest challenge right now?

This helps me match you with the right expert and make the most of your time.`;
    }

    if (lowerMessage.includes('course') || lowerMessage.includes('learning') || lowerMessage.includes('skills')) {
      return `Perfect! We have several programs that might be ideal for you.

To recommend the best fit, I need to understand your situation better:

🎯 What specific skills are you looking to develop?
📈 What's your current experience level?
⏰ How much time can you dedicate to learning per week?

Based on your answers, I can show you personalized course recommendations with real outcomes from students with similar backgrounds.`;
    }

    if (lowerMessage.includes('career change') || lowerMessage.includes('switch') || lowerMessage.includes('transition')) {
      setCurrentFlow('qualification');
      return `Career transitions are exciting! I've helped hundreds of professionals make successful switches.

Let me understand your situation:

• What field are you currently in?
• What industry/role are you targeting?
• What's prompting this change?
• What's your timeline?

I'll create a personalized roadmap based on your answers!`;
    }

    if (lowerMessage.includes('salary') || lowerMessage.includes('promotion') || lowerMessage.includes('advance')) {
      return `Excellent goal! Career advancement is definitely achievable with the right strategy.

Here's what I typically see work best:

✅ Skill gap analysis (where you are vs where you need to be)
✅ Strategic networking within your target companies
✅ Demonstrating impact through high-visibility projects

Want me to walk you through a personalized advancement plan? I can show you exactly what professionals in your situation have done to land 20-40% salary increases.

What's your current role, and what level are you targeting?`;
    }

    // General helpful responses
    if (lowerMessage.includes('help') || lowerMessage.includes('confused') || lowerMessage.includes('not sure')) {
      return `No worries! Let me help you figure out the best next step.

Here are the most common goals I help with:

🚀 **Career Switch** - Transition to a new field/role
📚 **Skill Building** - Level up in your current domain  
💰 **Career Growth** - Promotion/salary increase
🎯 **Job Search** - Land your dream role
💡 **Exploration** - Discover new career possibilities

Which of these resonates most with your situation? Or is there something else you're working toward?`;
    }

    // Default response with value
    return `That's interesting! Based on what you've shared and your engagement with our content, I think I can help you make real progress.

Here's what I'd recommend:

1. **Free Career Assessment** - Quick 5-minute quiz to identify your strengths and opportunities
2. **Personalized Learning Path** - Curated resources based on your goals
3. **Expert Consultation** - 15-minute call with a career advisor

Would you like to start with the assessment, or do you have specific questions about your career goals?

What's the #1 thing you'd like to achieve in the next 6 months?`;
  };

  const generateQualificationResponse = (userMessage: string): string => {
    // Simple qualification flow - in real implementation would be more sophisticated
    return `Thank you for sharing that! Based on what you've told me, I can see a clear path forward.

Here's what I'd recommend as your next steps:

📞 **Free Career Strategy Call** - 15 minutes with a senior advisor
📋 **Personalized Learning Plan** - Tailored to your background  
🎯 **Success Framework** - Proven system used by 500+ professionals

The strategy call is especially valuable because:
• You'll get expert advice specific to your situation
• We'll identify hidden opportunities in your target market
• You'll leave with a clear 90-day action plan

Sound good? I can check availability right now - we have a few slots left this week.

[Book Your Free Strategy Call]

Or feel free to ask me any other questions!`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Generate AI response
    const aiResponse = await generateAIResponse(inputValue);
    
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant', 
      content: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);

    // Update lead data based on conversation
    if (onLeadUpdate) {
      const interests = extractInterests(inputValue);
      const goals = extractGoals(inputValue);
      
      if (interests.length > 0 || goals.length > 0) {
        onLeadUpdate({
          interests: [...(lead?.interests || []), ...interests],
          qualificationData: {
            ...(lead?.qualificationData || {} as QualificationData),
            goals: [...(lead?.qualificationData?.goals || []), ...goals]
          }
        });
      }
    }
  };

  const extractInterests = (message: string): string[] => {
    const interests = [];
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('data science') || lowerMessage.includes('data analyst')) {
      interests.push('data-science');
    }
    if (lowerMessage.includes('machine learning') || lowerMessage.includes('ai')) {
      interests.push('machine-learning');
    }
    if (lowerMessage.includes('software engineer') || lowerMessage.includes('developer')) {
      interests.push('software-engineering');
    }
    if (lowerMessage.includes('product manager')) {
      interests.push('product-management');
    }
    
    return interests;
  };

  const extractGoals = (message: string): string[] => {
    const goals = [];
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('switch') || lowerMessage.includes('change career')) {
      goals.push('career-switch');
    }
    if (lowerMessage.includes('promotion') || lowerMessage.includes('advance')) {
      goals.push('promotion');
    }
    if (lowerMessage.includes('skills') || lowerMessage.includes('learn')) {
      goals.push('skill-upgrade');
    }
    
    return goals;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-scaler-primary to-scaler-secondary text-white shadow-lg hover:shadow-xl transition-all duration-200 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <MessageCircle className="w-8 h-8 mx-auto" />
        
        {/* Notification Badge */}
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 3 }}
        >
          1
        </motion.div>
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-scaler-primary to-scaler-secondary p-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Alex - AI Career Advisor</h3>
                  <p className="text-sm opacity-90">Usually replies instantly</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`flex max-w-[80%] space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-scaler-primary text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    
                    <div className={`rounded-2xl p-3 ${
                      message.role === 'user'
                        ? 'bg-scaler-primary text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-scaler-primary"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="w-10 h-10 bg-scaler-primary text-white rounded-full flex items-center justify-center hover:bg-scaler-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => setInputValue("I'm interested in a career consultation")}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  Book Consultation
                </button>
                <button
                  onClick={() => setInputValue("Tell me about your courses")}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  View Courses
                </button>
                <button
                  onClick={() => setInputValue("I want to switch careers")}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  Career Switch
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}