export type AdminNavItem = {
  title: string;
  href: string;
  description: string;
};

export type AdminJob = {
  id: number;
  title: string;
  location: string;
  type: string;
  priority: 'High' | 'Medium' | 'Low';
  applicants: number;
  status: 'Open' | 'Review' | 'Closed';
};

export type AdminApplication = {
  id: number;
  candidate: string;
  role: string;
  stage: string;
  score: number;
  submitted: string;
};

export type AdminPayment = {
  id: number;
  client: string;
  amount: string;
  method: string;
  date: string;
  status: 'Paid' | 'Pending' | 'Refunded';
};

export type AdminInterview = {
  id: number;
  candidate: string;
  role: string;
  time: string;
  interviewer: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
};
