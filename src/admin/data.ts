import type { AdminApplication, AdminInterview, AdminJob, AdminPayment } from './types';

export const adminNavItems = [
  { title: 'Dashboard', href: '/admin/dashboard', description: 'Website overview' },
  { title: 'Jobs', href: '/admin/jobs', description: 'Create and manage jobs' },
  { title: 'Applications', href: '/admin/applications', description: 'Review applicants' },
  { title: 'Candidates', href: '/admin/candidates', description: 'Profiles and notes' },
  { title: 'Payments', href: '/admin/payments', description: 'UPI payments and invoices' },
  { title: 'Interviews', href: '/admin/interviews', description: 'Scheduling and updates' },
  { title: 'Career Page', href: '/admin/career-page', description: 'Content and hiring status' },
  { title: 'Locations', href: '/admin/locations', description: 'Company offices' },
  { title: 'Settings', href: '/admin/settings', description: 'Company and system settings' },
  { title: 'Statistics', href: '/admin/statistics', description: 'Traffic and hiring metrics' },
  { title: 'Leads', href: '/admin/leads', description: 'Contact form leads' },
  { title: 'Subscribers', href: '/admin/subscribers', description: 'Newsletter subscribers' },
  { title: 'Email Templates', href: '/admin/email-templates', description: 'Templates and outreach' },
];

export const adminJobs: AdminJob[] = [
  { id: 1, title: 'Senior React Developer', location: 'Remote • UK', type: 'Full-time', priority: 'High', applicants: 24, status: 'Open' },
  { id: 2, title: 'Product Designer', location: 'Hybrid • London', type: 'Contract', priority: 'Medium', applicants: 14, status: 'Review' },
  { id: 3, title: 'Backend Engineer', location: 'Remote • EU', type: 'Full-time', priority: 'Low', applicants: 8, status: 'Closed' },
];

export const adminApplications: AdminApplication[] = [
  { id: 1, candidate: 'Ava Patel', role: 'Senior React Developer', stage: 'Technical Review', score: 91, submitted: '2h ago' },
  { id: 2, candidate: 'Daniel Brooks', role: 'Product Designer', stage: 'Portfolio Review', score: 87, submitted: 'Today' },
  { id: 3, candidate: 'Lina Gomez', role: 'Backend Engineer', stage: 'Interview', score: 83, submitted: 'Yesterday' },
];

export const adminPayments: AdminPayment[] = [
  { id: 1, client: 'Northstar Labs', amount: '$8,400', method: 'Card', date: '2024-07-11', status: 'Paid' },
  { id: 2, client: 'Helio Health', amount: '$3,200', method: 'Bank', date: '2024-07-12', status: 'Pending' },
  { id: 3, client: 'BluePeak', amount: '$1,760', method: 'Card', date: '2024-07-09', status: 'Refunded' },
];

export const adminInterviews: AdminInterview[] = [
  { id: 1, candidate: 'Ava Patel', role: 'Senior React Developer', time: 'Today • 15:00', interviewer: 'Mina', status: 'Scheduled' },
  { id: 2, candidate: 'Daniel Brooks', role: 'Product Designer', time: 'Tomorrow • 11:30', interviewer: 'Seth', status: 'Completed' },
  { id: 3, candidate: 'Lina Gomez', role: 'Backend Engineer', time: 'Fri • 09:00', interviewer: 'Nora', status: 'Cancelled' },
];

