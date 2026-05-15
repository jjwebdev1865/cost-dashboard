import React, { FormEvent, useState } from 'react';
import './App.css';
import { mockUsers } from './assets/data';

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

type CostForecast = {
  month: string;
  amount: number;
};

type CustomerCostProfile = {
  customerName: string;
  monthlyBudget: number;
  budgetNote: string;
  monthlyExpenses: Expense[];
  projectHours: ProjectPhase[];
  costForecast: CostForecast[];
};

export type MockUser = CustomerCostProfile & {
  email: string;
  password: string;
  name: string;
};

type Page = 'dashboard' | 'login';

const defaultCostProfile: CustomerCostProfile = {
  customerName: 'Acme Services',
  monthlyBudget: 20800,
  budgetNote: 'Tracking under the planned monthly project budget.',
  monthlyExpenses: [
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
  ],
  projectHours: [
    { name: 'Planning', hours: 22, color: '#2f7d6d' },
    { name: 'Design', hours: 34, color: '#d17832' },
    { name: 'Build', hours: 76, color: '#4267ac' },
    { name: 'QA', hours: 18, color: '#7a5a9e' },
  ],
  costForecast: [
    { month: 'May', amount: 12800 },
    { month: 'Jun', amount: 15000 },
    { month: 'Jul', amount: 13850 },
    { month: 'Aug', amount: 12100 },
  ],
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const activeCostProfile = currentUser ?? defaultCostProfile;
  const { monthlyExpenses, projectHours, costForecast } = activeCostProfile;
  const totalExpenses = monthlyExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  const totalHours = projectHours.reduce((total, phase) => total + phase.hours, 0);
  const highestMonthlyCost = Math.max(...costForecast.map((item) => item.amount));
  const highestPhaseHours = Math.max(...projectHours.map((phase) => phase.hours));
  const budgetUsed = Math.round(
    (totalExpenses / activeCostProfile.monthlyBudget) * 100
  );

  const handleAuthButtonClick = () => {
    if (currentUser) {
      setCurrentUser(null);
      setCurrentPage('dashboard');
      return;
    }

    setLoginError('');
    setCurrentPage('login');
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const matchedUser = mockUsers.find(
      (user) =>
        user.email.toLowerCase() === email.trim().toLowerCase() &&
        user.password === password
    );

    if (!matchedUser) {
      setLoginError('Enter a valid mock email and password.');
      return;
    }

    setCurrentUser(matchedUser);
    setEmail('');
    setPassword('');
    setLoginError('');
    setCurrentPage('dashboard');
  };

  const renderLoginPage = () => (
    <section className="login-page" aria-labelledby="login-heading">
      <form className="login-panel" onSubmit={handleLogin}>
        <p className="eyebrow">Mock login</p>
        <h1 id="login-heading">Sign in to the customer dashboard</h1>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />

        {loginError && (
          <p className="login-error" role="alert">
            {loginError}
          </p>
        )}

        <button className="continue-button" type="submit">
          Continue
        </button>
      </form>
    </section>
  );

  return (
    <main className="dashboard-shell">
      <header className="top-bar">
        <button className="auth-button" type="button" onClick={handleAuthButtonClick}>
          {currentUser ? 'Logout' : 'Login'}
        </button>
      </header>

      {currentPage === 'login' ? (
        renderLoginPage()
      ) : (
        <>
          <section className="hero-panel">
            <div className="hero-copy">
              <p className="eyebrow">Client cost preview</p>
              <h1>Know what this month is going to cost before the invoice arrives.</h1>
              <p className="hero-summary">
                A clear monthly view for {activeCostProfile.customerName}, showing
                where the money is going and how many hours have been worked.
              </p>
              {currentUser && (
                <p className="welcome-message">
                  Welcome back, {currentUser.name}. You are viewing{' '}
                  {currentUser.customerName}.
                </p>
              )}
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
              <strong>{budgetUsed}%</strong>
              <p>{activeCostProfile.budgetNote}</p>
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
        </>
      )}
    </main>
  );
}

export default App;
