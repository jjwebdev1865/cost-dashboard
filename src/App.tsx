import React, { FormEvent, MouseEvent, useEffect, useState } from 'react';
import './App.css';
import { mockUsers } from './assets/data';
import { useAuthStore } from './stores/authStore';
import { CustomerCostProfile, MockUser } from './types';

type RoutePath =
  | '/'
  | '/login'
  | '/signup'
  | '/support'
  | '/my-expenses'
  | '/settings'
  | '/profile';

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

function SettingsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M19.4 13.5c.1-.5.1-1 .1-1.5s0-1-.1-1.5l2-1.5-2-3.5-2.4 1a8 8 0 0 0-2.6-1.5L14 2h-4l-.4 3a8 8 0 0 0-2.6 1.5l-2.4-1-2 3.5 2 1.5A8.8 8.8 0 0 0 4.5 12c0 .5 0 1 .1 1.5l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 2.6 1.5l.4 3h4l.4-3a8 8 0 0 0 2.6-1.5l2.4 1 2-3.5-2-1.5ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5v-2H5V5h5V3Zm7.6 5.4L16.2 10l1 1H9v2h8.2l-1 1 1.4 1.6L21.5 12l-3.9-3.6Z" />
    </svg>
  );
}

const routePaths: RoutePath[] = [
  '/',
  '/login',
  '/signup',
  '/support',
  '/my-expenses',
  '/settings',
  '/profile',
];

const getCurrentRoute = (): RoutePath => {
  const path = window.location.pathname;

  return routePaths.includes(path as RoutePath) ? (path as RoutePath) : '/';
};

function App() {
  const { currentUser, isLoggedIn, loginUser, logoutUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RoutePath>(getCurrentRoute);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getCurrentRoute());
      setIsSettingsOpen(false);
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: RoutePath) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path);
    setIsSettingsOpen(false);
  };

  const handleNavigationClick = (
    event: MouseEvent<HTMLAnchorElement>,
    path: RoutePath
  ) => {
    event.preventDefault();
    navigate(path);
  };

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
    if (isLoggedIn) {
      logoutUser();
      navigate('/');
      return;
    }

    setLoginError('');
    navigate('/login');
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

    loginUser(matchedUser);
    setEmail('');
    setPassword('');
    setLoginError('');
    navigate('/');
  };

  const renderWelcomePage = () => (
    <section className="welcome-page" aria-labelledby="welcome-heading">
      <div className="welcome-copy">
        <p className="eyebrow">Customer service portal</p>
        <h1 id="welcome-heading">Welcome to the site</h1>
        <p>
          Track customer support activity, review project expenses, and keep account
          details close at hand from one simple dashboard.
        </p>
        <button
          className="continue-button welcome-login-button"
          type="button"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      </div>
    </section>
  );

  const renderDashboard = () => (
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
  );

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
        <p className="auth-switch">
          Need an account?{' '}
          <a
            href="/signup"
            onClick={(event) => handleNavigationClick(event, '/signup')}
          >
            Create an account
          </a>
        </p>
      </form>
    </section>
  );

  const renderSignupPage = () => (
    <section className="login-page" aria-labelledby="signup-heading">
      <form className="login-panel" onSubmit={(event) => event.preventDefault()}>
        <p className="eyebrow">Create account</p>
        <h1 id="signup-heading">Sign up for the customer dashboard</h1>
        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />

        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />

        <label htmlFor="confirm-password">Confirm password</label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />

        <button className="continue-button" type="submit">
          Create account
        </button>
      </form>
    </section>
  );

  return (
    <>
      {isLoggedIn && (
        <header className="site-nav">
          <nav className="site-nav-inner" aria-label="Primary navigation">
            <div className="nav-left">
              <a
                className="home-link"
                href="/"
                onClick={(event) => handleNavigationClick(event, '/')}
              >
                Home
              </a>
              <a
                className={`nav-link${currentRoute === '/support' ? ' active' : ''}`}
                href="/support"
                onClick={(event) => handleNavigationClick(event, '/support')}
              >
                Support
              </a>
              <a
                className={`nav-link${
                  currentRoute === '/my-expenses' ? ' active' : ''
                }`}
                href="/my-expenses"
                onClick={(event) => handleNavigationClick(event, '/my-expenses')}
              >
                My Expenses
              </a>
            </div>

            <div className="nav-actions">
              <div className="settings-menu">
                <button
                  className="icon-button"
                  type="button"
                  aria-label="Open settings menu"
                  aria-expanded={isSettingsOpen}
                  aria-haspopup="menu"
                  onClick={() => setIsSettingsOpen((isOpen) => !isOpen)}
                >
                  <SettingsIcon />
                </button>
                {isSettingsOpen && (
                  <div className="settings-dropdown" role="menu">
                    <a
                      className="settings-option"
                      href="/settings"
                      role="menuitem"
                      onClick={(event) => handleNavigationClick(event, '/settings')}
                    >
                      Settings
                    </a>
                    <a
                      className="settings-option"
                      href="/profile"
                      role="menuitem"
                      onClick={(event) => handleNavigationClick(event, '/profile')}
                    >
                      Profile
                    </a>
                  </div>
                )}
              </div>

              <button
                className="icon-button auth-icon-button"
                type="button"
                aria-label="Logout"
                title="Logout"
                onClick={handleAuthButtonClick}
              >
                <LogoutIcon />
              </button>
            </div>
          </nav>
        </header>
      )}

      <main className="dashboard-shell">
        {currentRoute === '/' && (isLoggedIn ? renderDashboard() : renderWelcomePage())}
        {currentRoute === '/login' && renderLoginPage()}
        {currentRoute === '/signup' && renderSignupPage()}
        {currentRoute === '/support' && <PlaceholderPage title="Support" />}
        {currentRoute === '/my-expenses' && <PlaceholderPage title="My Expenses" />}
        {currentRoute === '/settings' && <PlaceholderPage title="Settings" />}
        {currentRoute === '/profile' && <ProfilePage currentUser={currentUser} />}
      </main>
    </>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="placeholder-page" aria-labelledby="placeholder-heading">
      <p className="eyebrow">{title}</p>
      <h1 id="placeholder-heading">Hello world</h1>
    </section>
  );
}

function ProfilePage({ currentUser }: { currentUser: MockUser | null }) {
  return (
    <section className="profile-page" aria-labelledby="profile-heading">
      <div className="profile-card">
        <div className="profile-avatar" aria-hidden="true">
          <span>{currentUser?.name.charAt(0) ?? '?'}</span>
        </div>
        <div>
          <p className="eyebrow">Profile</p>
          <h1 id="profile-heading">{currentUser?.name ?? 'Guest user'}</h1>
          <dl className="profile-details">
            <div>
              <dt>Email</dt>
              <dd>{currentUser?.email ?? 'No email selected'}</dd>
            </div>
            <div>
              <dt>Client company</dt>
              <dd>{currentUser?.company ?? 'No company selected'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export default App;
