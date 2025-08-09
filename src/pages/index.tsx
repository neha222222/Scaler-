import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Award, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  PlayCircle,
  BookOpen,
  Target,
  Zap,
  X
} from 'lucide-react';
import AIChatbot from '@/components/AIchatbot';
import { Lead, LeadStatus, EngagementData, UserAction } from '@/types';

export default function LandingPage() {
  const [lead, setLead] = useState<Lead | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [scrollDepth, setScrollDepth] = useState(0);

  // Track user engagement
  useEffect(() => {
    const startTime = Date.now();
    
    // Track time on page
    const timeInterval = setInterval(() => {
      setTimeOnPage(Date.now() - startTime);
    }, 1000);

    // Track scroll depth
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const depth = Math.round((scrolled / totalHeight) * 100);
      setScrollDepth(Math.max(scrollDepth, depth));
    };

    window.addEventListener('scroll', handleScroll);

    // Initialize anonymous lead tracking
    if (!lead) {
      const anonymousLead: Lead = {
        id: `anon_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        score: 0,
        status: LeadStatus.COLD,
        source: 'landing_page',
        interests: [],
        engagement: {
          contentViewed: [],
          timeSpent: 0,
          actions: [],
          sessionCount: 1,
          lastActiveDate: new Date()
        },
        qualificationData: {
          experience: '',
          currentRole: '',
          goals: [],
          timeline: '',
          budget: '',
          challenges: [],
          aiGenerated: false
        }
      };
      setLead(anonymousLead);
    }

    // Trigger email capture popup based on engagement
    const engagementTimer = setTimeout(() => {
      if (timeOnPage > 60000 && scrollDepth > 50 && !email) { // 1 minute + 50% scroll
        setShowEmailCapture(true);
      }
    }, 60000);

    return () => {
      clearInterval(timeInterval);
      clearTimeout(engagementTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleEmailCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (lead) {
      const updatedLead: Lead = {
        ...lead,
        email,
        name: name || undefined,
        score: lead.score + 25, // Boost score for email capture
        status: LeadStatus.WARM,
        engagement: {
          ...lead.engagement,
          timeSpent: timeOnPage,
          actions: [
            ...lead.engagement.actions,
            {
              type: 'click',
              target: 'email_capture_form',
              timestamp: new Date(),
              value: email
            }
          ]
        }
      };
      
      setLead(updatedLead);
    }

    setIsSubmitting(false);
    setShowEmailCapture(false);
  };

  const trackAction = (action: string, target: string, value?: string) => {
    if (lead) {
      const newAction: UserAction = {
        type: action as any,
        target,
        timestamp: new Date(),
        value
      };
      
      setLead({
        ...lead,
        engagement: {
          ...lead.engagement,
          actions: [...lead.engagement.actions, newAction]
        }
      });
    }
  };

  return (
    <>
      <Head>
        <title>Transform Your Career with AI-Powered Learning | Scaler Academy</title>
        <meta name="description" content="Join 10,000+ professionals who've accelerated their tech careers. Get personalized learning paths, expert mentorship, and guaranteed outcomes." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-scaler-primary to-scaler-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">Scaler</span>
              </div>
              
              <nav className="hidden md:flex space-x-8">
                <a href="#programs" className="text-gray-700 hover:text-scaler-primary transition-colors">Programs</a>
                <a href="#success-stories" className="text-gray-700 hover:text-scaler-primary transition-colors">Success Stories</a>
                <a href="#mentors" className="text-gray-700 hover:text-scaler-primary transition-colors">Mentors</a>
              </nav>

              <button 
                className="btn-primary"
                onClick={() => {
                  setShowEmailCapture(true);
                  trackAction('click', 'header_cta');
                }}
              >
                Get Started Free
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center px-4 py-2 bg-scaler-primary/10 rounded-full text-scaler-primary font-medium text-sm mb-6">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  #1 Tech Career Accelerator in India
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Land Your Dream
                  <span className="text-transparent bg-clip-text gradient-bg"> Tech Job</span> in 6 Months
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Join 10,000+ professionals who've switched to high-paying tech careers. 
                  Get personalized learning paths, 1-on-1 mentorship, and guaranteed job placement.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button 
                    className="btn-primary text-lg px-8 py-4"
                    onClick={() => {
                      setShowEmailCapture(true);
                      trackAction('click', 'hero_primary_cta');
                    }}
                  >
                    Start Free Career Assessment
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                  
                  <button 
                    className="btn-secondary text-lg px-8 py-4 flex items-center justify-center"
                    onClick={() => trackAction('click', 'hero_video_cta')}
                  >
                    <PlayCircle className="mr-2 w-5 h-5" />
                    Watch Success Stories
                  </button>
                </div>

                {/* Social Proof */}
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="flex -space-x-2 mr-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-scaler-primary to-scaler-secondary border-2 border-white" />
                      ))}
                    </div>
                    <span>2,847 got placed this month</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 mr-2">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <span>4.9/5 (12,847 reviews)</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Career Assessment</h3>
                    <p className="text-gray-600">Discover your personalized path to success</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Target className="w-6 h-6 text-scaler-primary" />
                      <span className="text-gray-700">Identify your ideal tech role</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <BookOpen className="w-6 h-6 text-scaler-primary" />
                      <span className="text-gray-700">Get personalized learning roadmap</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Zap className="w-6 h-6 text-scaler-primary" />
                      <span className="text-gray-700">Connect with industry mentors</span>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full btn-primary mt-6 text-lg py-4"
                    onClick={() => {
                      setShowEmailCapture(true);
                      trackAction('click', 'sidebar_assessment_cta');
                    }}
                  >
                    Start Assessment (Free)
                  </button>
                  
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Takes 3 minutes • No credit card required
                  </p>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-scaler-primary/20 rounded-full animate-pulse" />
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-scaler-secondary/20 rounded-full animate-pulse" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: '10,000+', label: 'Career Transitions', icon: Users },
                { number: '150%', label: 'Avg Salary Increase', icon: TrendingUp },
                { number: '95%', label: 'Job Placement Rate', icon: Award },
                { number: '6 months', label: 'Avg Time to Placement', icon: Clock }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-scaler-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-scaler-primary" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section id="programs" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Choose Your Career Path
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Industry-designed programs with guaranteed outcomes. Learn from experts, 
                build real projects, and get placed at top companies.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Data Science & AI',
                  duration: '6-8 months',
                  price: '₹2,99,000',
                  placement: '95%',
                  avgSalary: '₹12-18 LPA',
                  skills: ['Python', 'Machine Learning', 'Deep Learning', 'SQL', 'Statistics'],
                  companies: ['Google', 'Microsoft', 'Amazon', 'Flipkart']
                },
                {
                  title: 'Full Stack Development',
                  duration: '4-6 months', 
                  price: '₹2,49,000',
                  placement: '92%',
                  avgSalary: '₹10-15 LPA',
                  skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'System Design'],
                  companies: ['Zomato', 'Swiggy', 'Paytm', 'BYJU\'S']
                },
                {
                  title: 'Product Management',
                  duration: '5-7 months',
                  price: '₹3,49,000', 
                  placement: '88%',
                  avgSalary: '₹15-25 LPA',
                  skills: ['Strategy', 'Analytics', 'Design Thinking', 'Leadership'],
                  companies: ['Uber', 'Ola', 'PhonePe', 'Razorpay']
                }
              ].map((program, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`card hover:scale-105 transition-transform ${
                    index === 0 ? 'ring-2 ring-scaler-primary bg-scaler-primary/5' : ''
                  }`}
                >
                  {index === 0 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-scaler-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{program.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span>{program.duration}</span>
                      <span className="font-semibold text-scaler-primary">{program.placement} placement</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{program.price}</div>
                    <div className="text-sm text-gray-600">Average salary: {program.avgSalary}</div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {program.skills.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Hiring Partners</h4>
                    <div className="text-sm text-gray-600">
                      {program.companies.join(', ')} + 200 more
                    </div>
                  </div>

                  <button 
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      index === 0 
                        ? 'bg-scaler-primary text-white hover:bg-scaler-primary/90' 
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                    onClick={() => {
                      setShowEmailCapture(true);
                      trackAction('click', `program_cta_${program.title.toLowerCase().replace(/\s+/g, '_')}`);
                    }}
                  >
                    Learn More & Apply
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mentors Section */}
        <section id="mentors" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Learn from Industry Experts
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get 1-on-1 mentorship from professionals working at top tech companies. 
                Our mentors have helped thousands transition to successful tech careers.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {[
                {
                  name: 'Priya Sharma',
                  role: 'Senior Data Scientist at Google',
                  experience: '8+ years',
                  expertise: ['Machine Learning', 'Python', 'Statistics'],
                  image: '/mentors/priya.jpg',
                  mentees: 150,
                  rating: 4.9,
                  story: 'Helped 150+ professionals transition from non-tech backgrounds to data science roles'
                },
                {
                  name: 'Rahul Gupta',
                  role: 'Engineering Manager at Microsoft',
                  experience: '12+ years',
                  expertise: ['System Design', 'Leadership', 'Full Stack'],
                  image: '/mentors/rahul.jpg',
                  mentees: 200,
                  rating: 4.8,
                  story: 'Led teams at startups and big tech, specializes in career progression strategies'
                },
                {
                  name: 'Sneha Patel',
                  role: 'Product Manager at Meta',
                  experience: '10+ years',
                  expertise: ['Product Strategy', 'Analytics', 'Growth'],
                  image: '/mentors/sneha.jpg',
                  mentees: 125,
                  rating: 4.9,
                  story: 'Former consultant turned PM, expert in transitioning to product roles'
                }
              ].map((mentor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card text-center"
                >
                  <div className="w-24 h-24 bg-gradient-to-r from-scaler-primary to-scaler-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {mentor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{mentor.name}</h3>
                  <p className="text-scaler-primary font-medium mb-2">{mentor.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{mentor.experience} experience</p>
                  
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {mentor.expertise.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-scaler-primary/10 text-scaler-primary rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{mentor.mentees} mentees</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                      <span>{mentor.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-6">{mentor.story}</p>
                  
                  <button 
                    className="w-full btn-secondary"
                    onClick={() => {
                      setShowEmailCapture(true);
                      trackAction('click', `mentor_connect_${mentor.name.toLowerCase().replace(/\s+/g, '_')}`);
                    }}
                  >
                    Connect with {mentor.name.split(' ')[0]}
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <div className="bg-scaler-primary/5 rounded-2xl p-8 max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">1-on-1 Mentorship Program</h3>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-scaler-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Personalized Guidance</h4>
                    <p className="text-gray-600 text-sm">Tailored advice based on your background and goals</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-scaler-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Weekly Sessions</h4>
                    <p className="text-gray-600 text-sm">Regular check-ins to track progress and adjust strategy</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-scaler-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Industry Insights</h4>
                    <p className="text-gray-600 text-sm">Real-world advice from professionals in your target field</p>
                  </div>
                </div>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    setShowEmailCapture(true);
                    trackAction('click', 'mentorship_program_cta');
                  }}
                >
                  Start Free Consultation
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section id="success-stories" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Success Stories
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real transformations from our community. See how professionals like you 
                have successfully transitioned to thriving tech careers.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {[
                {
                  name: 'Ankit Kumar',
                  before: 'Marketing Manager',
                  after: 'Data Scientist at Flipkart',
                  salary: '₹12 LPA → ₹28 LPA',
                  duration: '7 months',
                  story: 'I was stuck in marketing with no growth prospects. Scaler\'s mentorship and structured curriculum helped me land my dream role in data science.',
                  skills: ['Python', 'Machine Learning', 'SQL']
                },
                {
                  name: 'Riya Singh',
                  before: 'Fresher (Non-CS)',
                  after: 'Software Engineer at Zomato',
                  salary: '₹0 → ₹18 LPA',
                  duration: '8 months',
                  story: 'As a commerce graduate, I never thought I could code. The personalized learning path and mentor support made the impossible possible.',
                  skills: ['React', 'Node.js', 'System Design']
                },
                {
                  name: 'Vikram Mehta',
                  before: 'Senior Analyst',
                  after: 'Product Manager at PayU',
                  salary: '₹8 LPA → ₹22 LPA',
                  duration: '6 months',
                  story: 'I wanted to move from analysis to strategy. The product management track gave me the frameworks and confidence to make the switch.',
                  skills: ['Product Strategy', 'Analytics', 'User Research']
                },
                {
                  name: 'Prachi Agarwal',
                  before: 'Manual Tester',
                  after: 'DevOps Engineer at Razorpay',
                  salary: '₹6 LPA → ₹20 LPA',
                  duration: '5 months',
                  story: 'Testing felt repetitive. The DevOps program opened up a whole new world of infrastructure and automation that I love.',
                  skills: ['Docker', 'Kubernetes', 'AWS']
                }
              ].map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-scaler-primary to-scaler-secondary rounded-full flex items-center justify-center text-white font-bold">
                      {story.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{story.name}</h3>
                      <p className="text-gray-600">{story.before} → {story.after}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{story.salary.split('→')[1]}</div>
                      <div className="text-sm text-gray-600">New Salary</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{story.duration}</div>
                      <div className="text-sm text-gray-600">Duration</div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 italic">"{story.story}"</p>

                  <div className="flex flex-wrap gap-2">
                    {story.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button 
                className="btn-primary"
                onClick={() => {
                  setShowEmailCapture(true);
                  trackAction('click', 'success_stories_cta');
                }}
              >
                Start Your Success Story
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 gradient-bg">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who've already made the switch. 
                Start with a free assessment and get your personalized roadmap.
              </p>
              
              <button 
                className="bg-white text-scaler-primary font-semibold py-4 px-8 rounded-lg text-lg hover:bg-gray-50 transition-colors shadow-lg"
                onClick={() => {
                  setShowEmailCapture(true);
                  trackAction('click', 'final_cta');
                }}
              >
                Get My Free Career Roadmap
                <ArrowRight className="ml-2 w-5 h-5 inline" />
              </button>
              
              <p className="text-white/80 text-sm mt-4">
                No spam, ever. Unsubscribe at any time.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Email Capture Modal */}
        <AnimatePresence>
          {showEmailCapture && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmailCapture(false)}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Get Your Free Career Roadmap</h3>
                  <button 
                    onClick={() => setShowEmailCapture(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Join 10,000+ professionals who've transformed their careers. 
                  Get personalized guidance based on your background and goals.
                </p>
                
                <form onSubmit={handleEmailCapture} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-scaler-primary"
                  />
                  
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-scaler-primary"
                  />
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-3 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Getting Your Roadmap...' : 'Get Free Roadmap'}
                  </button>
                </form>
                
                <div className="mt-6 flex items-center space-x-4 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Free career assessment included</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Chatbot */}
        <AIChatbot 
          lead={lead || undefined}
          onLeadUpdate={(updates) => {
            if (lead) {
              setLead({ ...lead, ...updates });
            }
          }}
          onConversionGoal={(goal) => {
            trackAction('click', 'chatbot_conversion', goal);
          }}
        />
      </div>
    </>
  );
}