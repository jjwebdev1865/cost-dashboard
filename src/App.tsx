import React from 'react';
import './App.css';

type Expense = {
  category: string;
  description: string;
  amount: number;
  color: string;
};

type ProjectPhase = {
  name: string;
  hours: number;
  color: string;
};

const monthlyExpenses: Expense[] = [
  {
    category: 'Strategy',
    description: 'Planning, discovery, and project coordination',
    amount: 2850,
    color: '#2f7d6d',
  },
  {
    category: 'Design',
    description: 'Wireframes, interface polish, and review cycles',
    amount: 3200,
    color: '#d17832',
  },
  {
    category: 'Development',
    description: 'Application features, integrations, and fixes',
    amount: 7400,
    color: '#4267ac',
  },
  {
    category: 'Support',
    description: 'QA, launch help, and monthly maintenance',
    amount: 1550,
    color: '#7a5a9e',
  },
];

const projectHours: ProjectPhase[] = [
  { name: 'Planning', hours: 22, color: '#2f7d6d' },
  { name: 'Design', hours: 34, color: '#d17832' },
  { name: 'Build', hours: 76, color: '#4267ac' },
  { name: 'QA', hours: 18, color: '#7a5a9e' },
];

const costForecast = [
  { month: 'May', amount: 12800 },
  { month: 'Jun', amount: 15000 },
  { month: 'Jul', amount: 13850 },
  { month: 'Aug', amount: 12100 },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function App() {
  const totalExpenses = monthlyExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  const totalHours = projectHours.reduce((total, phase) => total + phase.hours, 0);
  const highestMonthlyCost = Math.max(...costForecast.map((item) => item.amount));
  const highestPhaseHours = Math.max(...projectHours.map((phase) => phase.hours));

  return (
    <main className="dashboard-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Client cost preview</p>
          <h1>Know what this month is going to cost before the invoice arrives.</h1>
          <p className="hero-summary">
            A clear monthly view of project spend, where the money is going, and
            how many hours have been worked across the project.
          </p>
        </div>

        <div className="total-card" aria-label="Projected monthly total">
          <span>Projected this month</span>
          <strong>{currencyFormatter.format(totalExpenses)}</strong>
          <p>Mock estimate based on active work categories</p>
        </div>
      </section>

      <section className="metrics-grid" aria-label="Monthly cost summary">
        <article className="summary-card">
          <span className="summary-label">Monthly budget used</span>
          <strong>72%</strong>
          <p>Tracking under the planned monthly project budget.</p>
        </article>
        <article className="summary-card">
          <span className="summary-label">Hours worked</span>
          <strong>{totalHours}</strong>
          <p>Logged against current project milestones.</p>
        </article>
        <article className="summary-card">
          <span className="summary-label">Average hourly cost</span>
          <strong>{currencyFormatter.format(totalExpenses / totalHours)}</strong>
          <p>Blended rate across all mock work categories.</p>
        </article>
      </section>

      <section className="content-grid">
        <div className="expenses-panel">
          <div className="section-heading">
            <p className="eyebrow">Monthly expenses</p>
            <h2>Expense breakdown</h2>
          </div>

          <div className="expense-list">
            {monthlyExpenses.map((expense) => {
              const percentage = Math.round((expense.amount / totalExpenses) * 100);

              return (
                <article className="expense-row" key={expense.category}>
                  <div
                    className="expense-marker"
                    style={{ backgroundColor: expense.color }}
                    aria-hidden="true"
                  />
                  <div>
                    <h3>{expense.category}</h3>
                    <p>{expense.description}</p>
                  </div>
                  <div className="expense-amount">
                    <strong>{currencyFormatter.format(expense.amount)}</strong>
                    <span>{percentage}%</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="forecast-panel" aria-label="Projected cost trend">
          <div className="section-heading">
            <p className="eyebrow">Cost outlook</p>
            <h2>Projected monthly cost</h2>
          </div>
          <div className="forecast-chart">
            {costForecast.map((item) => (
              <div className="forecast-bar-group" key={item.month}>
                <div className="forecast-value">
                  {currencyFormatter.format(item.amount)}
                </div>
                <div className="forecast-track">
                  <div
                    className="forecast-bar"
                    style={{ height: `${(item.amount / highestMonthlyCost) * 100}%` }}
                  />
                </div>
                <span>{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hours-panel" aria-label="Hours worked by project phase">
        <div className="section-heading">
          <p className="eyebrow">Project activity</p>
          <h2>Hours worked by phase</h2>
        </div>

        <div className="hours-chart">
          {projectHours.map((phase) => (
            <div className="hours-row" key={phase.name}>
              <div className="hours-label">
                <strong>{phase.name}</strong>
                <span>{phase.hours} hours</span>
              </div>
              <div className="hours-track">
                <div
                  className="hours-bar"
                  style={{
                    width: `${(phase.hours / highestPhaseHours) * 100}%`,
                    backgroundColor: phase.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
