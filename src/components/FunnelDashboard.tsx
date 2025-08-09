'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList
} from 'recharts';
import {
  TrendingUp, Users, Target, Mail, MessageSquare, Calendar,
  ArrowUpRight, ArrowDownRight, Eye, MousePointer, UserPlus, DollarSign
} from 'lucide-react';
import { FunnelMetrics, LeadStatus } from '@/types';

interface DashboardProps {
  timeRange?: '24h' | '7d' | '30d' | '90d';
}

export default function FunnelDashboard({ timeRange = '30d' }: DashboardProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>('conversion_rate');

  // Mock data - in real implementation would come from analytics API
  const mockMetrics: FunnelMetrics = {
    totalVisitors: 15420,
    leadsGenerated: 2847,
    conversionRate: 0.185,
    averageScore: 42.3,
    stageConversions: {
      [LeadStatus.COLD]: 12573,
      [LeadStatus.WARM]: 2847,
      [LeadStatus.HOT]: 1205,
      [LeadStatus.QUALIFIED]: 623,
      [LeadStatus.CONVERTED]: 187,
      [LeadStatus.LOST]: 456
    },
    topContent: [
      {
        contentId: 'data-science-guide',
        contentType: 'blog',
        title: 'Complete Data Science Career Guide',
        timeSpent: 425,
        completion: 78,
        engagementScore: 85,
        viewDate: new Date()
      }
    ]
  };

  const funnelData = [
    { name: 'Visitors', value: mockMetrics.totalVisitors, fill: '#E5E7EB' },
    { name: 'Leads', value: mockMetrics.leadsGenerated, fill: '#9CA3AF' },
    { name: 'Warm', value: mockMetrics.stageConversions[LeadStatus.WARM], fill: '#6B7280' },
    { name: 'Hot', value: mockMetrics.stageConversions[LeadStatus.HOT], fill: '#4F46E5' },
    { name: 'Qualified', value: mockMetrics.stageConversions[LeadStatus.QUALIFIED], fill: '#7C3AED' },
    { name: 'Converted', value: mockMetrics.stageConversions[LeadStatus.CONVERTED], fill: '#059669' }
  ];

  const conversionTrendData = [
    { date: '2024-01-01', visitors: 450, leads: 67, conversions: 12 },
    { date: '2024-01-02', visitors: 520, leads: 89, conversions: 18 },
    { date: '2024-01-03', visitors: 480, leads: 72, conversions: 15 },
    { date: '2024-01-04', visitors: 610, leads: 105, conversions: 23 },
    { date: '2024-01-05', visitors: 580, leads: 98, conversions: 21 },
    { date: '2024-01-06', visitors: 720, leads: 134, conversions: 28 },
    { date: '2024-01-07', visitors: 690, leads: 127, conversions: 25 }
  ];

  const channelPerformanceData = [
    { channel: 'Organic Search', leads: 1247, conversion: 0.22, cost: 0 },
    { channel: 'Social Media', leads: 856, conversion: 0.18, cost: 45000 },
    { channel: 'Email Marketing', leads: 423, conversion: 0.31, cost: 12000 },
    { channel: 'Paid Ads', leads: 321, conversion: 0.15, cost: 89000 }
  ];

  const emailSequenceData = [
    { sequence: 'Content Reader Nurture', sent: 1247, opened: 623, clicked: 187, converted: 43 },
    { sequence: 'Warm Lead Conversion', sent: 892, opened: 534, clicked: 156, converted: 67 },
    { sequence: 'Hot Lead Immediate', sent: 234, opened: 201, clicked: 123, converted: 89 }
  ];

  const kpiCards = [
    {
      title: 'Total Visitors',
      value: mockMetrics.totalVisitors.toLocaleString(),
      change: '+12.3%',
      changeType: 'increase' as const,
      icon: Eye,
      color: 'blue'
    },
    {
      title: 'Leads Generated',
      value: mockMetrics.leadsGenerated.toLocaleString(),
      change: '+18.7%',
      changeType: 'increase' as const,
      icon: UserPlus,
      color: 'purple'
    },
    {
      title: 'Conversion Rate',
      value: `${(mockMetrics.conversionRate * 100).toFixed(1)}%`,
      change: '+2.4%',
      changeType: 'increase' as const,
      icon: Target,
      color: 'green'
    },
    {
      title: 'Average Lead Score',
      value: mockMetrics.averageScore.toFixed(1),
      change: '+5.2%',
      changeType: 'increase' as const,
      icon: TrendingUp,
      color: 'indigo'
    }
  ];

  const getColorClass = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50',
      purple: 'text-purple-600 bg-purple-50', 
      green: 'text-green-600 bg-green-50',
      indigo: 'text-indigo-600 bg-indigo-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Lead Conversion Funnel Analytics</h1>
            
            <div className="flex space-x-2">
              {(['24h', '7d', '30d', '90d'] as const).map((period) => (
                <button
                  key={period}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === period
                      ? 'bg-scaler-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          <p className="text-gray-600">
            Monitor your AI-powered lead conversion funnel performance and optimize for better results.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{kpi.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                  
                  <div className={`flex items-center mt-2 text-sm ${
                    kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.changeType === 'increase' ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    <span>{kpi.change} vs last period</span>
                  </div>
                </div>
                
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClass(kpi.color)}`}>
                  <kpi.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Conversion Funnel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversion Funnel</h3>
            
            <ResponsiveContainer width="100%" height={400}>
              <FunnelChart>
                <Tooltip 
                  formatter={(value, name) => [`${value.toLocaleString()}`, name]}
                  labelStyle={{ color: '#374151' }}
                />
                <Funnel
                  dataKey="value"
                  data={funnelData}
                  isAnimationActive={true}
                >
                  <LabelList position="center" fill="#fff" stroke="none" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              {funnelData.map((item, index) => (
                <div key={item.name} className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-gray-900">{item.value.toLocaleString()}</span>
                    {index > 0 && (
                      <span className="text-gray-500 ml-2">
                        ({((item.value / funnelData[index - 1].value) * 100).toFixed(1)}%)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Conversion Trends */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversion Trends</h3>
            
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={conversionTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#9CA3AF" 
                  strokeWidth={2} 
                  name="Visitors"
                  dot={{ fill: '#9CA3AF', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#4F46E5" 
                  strokeWidth={2} 
                  name="Leads"
                  dot={{ fill: '#4F46E5', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#059669" 
                  strokeWidth={2} 
                  name="Conversions"
                  dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Channel Performance and Email Sequences */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Channel Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Channel Performance</h3>
            
            <div className="space-y-4">
              {channelPerformanceData.map((channel, index) => (
                <div key={channel.channel} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{channel.channel}</h4>
                    <p className="text-sm text-gray-600">
                      {channel.leads} leads • {(channel.conversion * 100).toFixed(1)}% conversion
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      ₹{channel.cost.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      ₹{channel.cost > 0 ? Math.round(channel.cost / channel.leads) : 0}/lead
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email Sequence Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Email Sequence Performance</h3>
            
            <div className="space-y-4">
              {emailSequenceData.map((sequence, index) => (
                <div key={sequence.sequence} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">{sequence.sequence}</h4>
                  
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{sequence.sent}</div>
                      <div className="text-sm text-gray-600">Sent</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{sequence.opened}</div>
                      <div className="text-sm text-gray-600">
                        Opened ({((sequence.opened / sequence.sent) * 100).toFixed(1)}%)
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{sequence.clicked}</div>
                      <div className="text-sm text-gray-600">
                        Clicked ({((sequence.clicked / sequence.opened) * 100).toFixed(1)}%)
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{sequence.converted}</div>
                      <div className="text-sm text-gray-600">
                        Converted ({((sequence.converted / sequence.sent) * 100).toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-scaler-primary to-scaler-secondary rounded-xl p-6 text-white"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            AI-Powered Insights & Recommendations
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-medium mb-2">🎯 Optimization Opportunity</h4>
              <p className="text-sm opacity-90">
                Your email open rates are 23% above industry average. 
                Consider A/B testing subject lines to push conversion rates higher.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-medium mb-2">📈 Peak Performance Time</h4>
              <p className="text-sm opacity-90">
                Tuesday 2-4 PM shows highest conversion rates. 
                Schedule your high-priority campaigns during this window.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-medium mb-2">🔥 Hot Lead Alert</h4>
              <p className="text-sm opacity-90">
                47 leads scored 80+ in the last 24 hours. 
                Sales team has been notified for immediate follow-up.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}