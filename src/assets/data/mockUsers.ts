import { MockUser } from "../../App";

export const mockUsers: MockUser[] = [
  {
    email: 'alex@example.com',
    password: 'password123',
    name: 'Alex Rivera',
    customerName: 'Northstar Clinic Group',
    monthlyBudget: 26000,
    budgetNote: 'Implementation spend is pacing below the launch budget.',
    monthlyExpenses: [
      {
        category: 'Implementation',
        description: 'Care-team intake workflows and dashboard buildout',
        amount: 11200,
        color: '#4267ac',
      },
      {
        category: 'Data migration',
        description: 'Patient record import mapping and validation support',
        amount: 5200,
        color: '#2f7d6d',
      },
      {
        category: 'Training',
        description: 'Admin enablement sessions and support desk materials',
        amount: 3100,
        color: '#d17832',
      },
      {
        category: 'Compliance review',
        description: 'HIPAA workflow checks and access-control review',
        amount: 1800,
        color: '#7a5a9e',
      },
    ],
    projectHours: [
      { name: 'Discovery', hours: 18, color: '#2f7d6d' },
      { name: 'Migration', hours: 42, color: '#d17832' },
      { name: 'Build', hours: 88, color: '#4267ac' },
      { name: 'Training', hours: 24, color: '#7a5a9e' },
    ],
    costForecast: [
      { month: 'May', amount: 21300 },
      { month: 'Jun', amount: 22800 },
      { month: 'Jul', amount: 19600 },
      { month: 'Aug', amount: 14100 },
    ],
  },
  {
    email: 'sam@example.com',
    password: 'support2026',
    name: 'Sam Morgan',
    customerName: 'Harbor Retail Partners',
    monthlyBudget: 19000,
    budgetNote: 'Support costs are elevated while store rollout work finishes.',
    monthlyExpenses: [
      {
        category: 'Store rollout',
        description: 'POS integration, location setup, and launch support',
        amount: 7600,
        color: '#4267ac',
      },
      {
        category: 'Inventory sync',
        description: 'Catalog feed monitoring and mismatch resolution',
        amount: 3900,
        color: '#2f7d6d',
      },
      {
        category: 'Customer support',
        description: 'Priority response coverage for regional managers',
        amount: 4200,
        color: '#7a5a9e',
      },
      {
        category: 'Reporting',
        description: 'Weekly executive snapshots and sales exception review',
        amount: 1400,
        color: '#d17832',
      },
    ],
    projectHours: [
      { name: 'Setup', hours: 27, color: '#2f7d6d' },
      { name: 'Integrations', hours: 55, color: '#4267ac' },
      { name: 'Support', hours: 46, color: '#7a5a9e' },
      { name: 'Reporting', hours: 16, color: '#d17832' },
    ],
    costForecast: [
      { month: 'May', amount: 17100 },
      { month: 'Jun', amount: 18500 },
      { month: 'Jul', amount: 16400 },
      { month: 'Aug', amount: 12800 },
    ],
  },
  {
    email: 'jordan@example.com',
    password: 'dashboard',
    name: 'Jordan Lee',
    customerName: 'Summit Field Operations',
    monthlyBudget: 34000,
    budgetNote: 'Field automation work is trending close to the approved cap.',
    monthlyExpenses: [
      {
        category: 'Workflow automation',
        description: 'Scheduling logic, approvals, and technician dispatch flows',
        amount: 14500,
        color: '#4267ac',
      },
      {
        category: 'Mobile app support',
        description: 'Bug fixes, offline mode testing, and release coordination',
        amount: 6800,
        color: '#7a5a9e',
      },
      {
        category: 'Analytics',
        description: 'Route efficiency, SLA dashboards, and data warehouse work',
        amount: 5900,
        color: '#2f7d6d',
      },
      {
        category: 'Account management',
        description: 'Planning sessions, roadmapping, and stakeholder updates',
        amount: 2800,
        color: '#d17832',
      },
    ],
    projectHours: [
      { name: 'Automation', hours: 104, color: '#4267ac' },
      { name: 'Mobile QA', hours: 39, color: '#7a5a9e' },
      { name: 'Analytics', hours: 44, color: '#2f7d6d' },
      { name: 'Planning', hours: 22, color: '#d17832' },
    ],
    costForecast: [
      { month: 'May', amount: 30000 },
      { month: 'Jun', amount: 31800 },
      { month: 'Jul', amount: 33300 },
      { month: 'Aug', amount: 27100 },
    ],
  },
];