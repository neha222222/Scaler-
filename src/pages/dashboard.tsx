import Head from 'next/head';
import FunnelDashboard from '@/components/FunnelDashboard';

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>Analytics Dashboard - Scaler AI Lead Funnel</title>
        <meta name="description" content="Monitor and optimize your AI-powered lead conversion funnel performance" />
      </Head>
      <FunnelDashboard />
    </>
  );
}