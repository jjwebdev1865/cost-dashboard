import Snackbar from '@mui/material/Snackbar';
import React, { FormEvent, MouseEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import './App.css';
import { mockCompanies, mockTeam, mockUsers } from './assets/data';
import { useAuthStore } from './stores/authStore';
import { MockUser, SupportRequestFormValues } from './types';

type RoutePath =
  | '/'
  | '/login'
  | '/signup'
  | '/support'
  | '/my-expenses'
  | '/settings'
  | '/profile'
  | '/companies';

type ThemeMode = 'light' | 'dark';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const getTotalExpenses = (user: MockUser) =>
  user.monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);

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
  '/companies',
];

const isAdminUser = (user: MockUser | null) => user?.role === 'admin';

const customerUsers = mockUsers.filter((user) => user.role === 'customer');

const getCurrentRoute = (): RoutePath => {
  const path = window.location.pathname;

  return routePaths.includes(path as RoutePath) ? (path as RoutePath) : '/';
};

function App() {
  const { currentUser, isLoggedIn, loginUser, logoutUser, updateCurrentUser } =
    useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RoutePath>(getCurrentRoute);
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getCurrentRoute());
      setIsSettingsOpen(false);
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    document.body.dataset.theme = themeMode;
  }, [themeMode]);

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
    <section className="home-dashboard" aria-labelledby="home-dashboard-heading">
      <div className="home-dashboard-copy">
        <p className="eyebrow">Customer service portal</p>
        <h1 id="home-dashboard-heading">Welcome back, {currentUser?.name}.</h1>
        <p>
          Use the navigation to review client spend, open support resources, and
          manage your profile.
        </p>
      </div>
    </section>
  );

  const renderExpensesPage = () => <ExpensesPage currentUser={currentUser} />;

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
                className={`nav-link${
                  currentRoute === '/my-expenses' ? ' active' : ''
                }`}
                href="/my-expenses"
                onClick={(event) => handleNavigationClick(event, '/my-expenses')}
              >
                My Expenses
              </a>
              <a
                className={`nav-link${currentRoute === '/support' ? ' active' : ''}`}
                href="/support"
                onClick={(event) => handleNavigationClick(event, '/support')}
              >
                Support
              </a>
              {isAdminUser(currentUser) && (
                <a
                  className={`nav-link${
                    currentRoute === '/companies' ? ' active' : ''
                  }`}
                  href="/companies"
                  onClick={(event) => handleNavigationClick(event, '/companies')}
                >
                  Companies
                </a>
              )}
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
        {currentRoute === '/support' && <SupportPage />}
        {currentRoute === '/my-expenses' && renderExpensesPage()}
        {currentRoute === '/settings' && (
          <SettingsPage
            currentUser={currentUser}
            themeMode={themeMode}
            onThemeChange={setThemeMode}
            onUpdateCurrentUser={updateCurrentUser}
          />
        )}
        {currentRoute === '/profile' && <ProfilePage currentUser={currentUser} />}
        {currentRoute === '/companies' && isAdminUser(currentUser) && (
          <CompaniesPage />
        )}
      </main>
    </>
  );
}

const supportRequestDefaultValues: SupportRequestFormValues = {
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  issueSubject: '',
  issueDescription: '',
};

function SupportPage() {
  const [isSupportDrawerOpen, setIsSupportDrawerOpen] = useState(false);
  const [isSubmitSnackbarOpen, setIsSubmitSnackbarOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupportRequestFormValues>({
    defaultValues: supportRequestDefaultValues,
  });

  const openSupportDrawer = () => setIsSupportDrawerOpen(true);

  const closeSupportDrawer = () => {
    setIsSupportDrawerOpen(false);
    reset(supportRequestDefaultValues);
  };

  const onSupportSubmit = (data: SupportRequestFormValues) => {
    console.log(data);
    closeSupportDrawer();
    setIsSubmitSnackbarOpen(true);
  };

  return (
    <section className="support-page" aria-labelledby="support-heading">
      <div className="support-hero">
        <div>
          <p className="eyebrow">Support</p>
          <h1 id="support-heading">We are here to help</h1>
          <p>
            Reach out to our customer success team for onboarding help, billing
            questions, and technical support.
          </p>
        </div>
      </div>

      <section className="support-contact-panel" aria-labelledby="support-contact-heading">
        <div>
          <p className="eyebrow">Get Help</p>
          <h2 id="support-contact-heading">Submit a support request</h2>
          <p>
            Open the support form to share your contact details and describe the
            issue you need help with.
          </p>
        </div>
        <button
          className="continue-button support-open-button"
          type="button"
          onClick={openSupportDrawer}
        >
          Open support form
        </button>
      </section>

      <section className="meet-the-team" aria-labelledby="meet-the-team-heading">
        <div className="section-heading">
          <p className="eyebrow">Customer success</p>
          <h2 id="meet-the-team-heading">Meet the Team</h2>
          <p>
            These specialists work with your account and can help with launches,
            integrations, and ongoing care.
          </p>
        </div>

        <ul className="team-list">
          {mockTeam.map((member) => (
            <li key={member.name}>
              <article className="team-card">
                <div className="team-avatar" aria-hidden="true">
                  <span>{member.name.charAt(0)}</span>
                </div>
                <div className="team-card-body">
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {isSupportDrawerOpen && (
        <div className="support-drawer-root">
          <button
            className="support-drawer-backdrop"
            type="button"
            aria-label="Close support form"
            onClick={closeSupportDrawer}
          />
          <aside
            className="support-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="support-drawer-heading"
          >
            <form
              className="support-drawer-form"
              onSubmit={handleSubmit(onSupportSubmit)}
            >
              <div className="support-drawer-body">
                <div className="support-drawer-header">
                  <p className="eyebrow">Support request</p>
                  <h2 id="support-drawer-heading">Tell us what you need</h2>
                </div>

                <label htmlFor="customer-name">Customer name</label>
              <input
                id="customer-name"
                type="text"
                autoComplete="name"
                {...register('customerName', { required: 'Customer name is required.' })}
              />
              {errors.customerName && (
                <p className="support-form-error" role="alert">
                  {errors.customerName.message}
                </p>
              )}

              <label htmlFor="customer-phone">Customer phone number</label>
              <input
                id="customer-phone"
                type="tel"
                autoComplete="tel"
                {...register('customerPhone', {
                  required: 'Customer phone number is required.',
                })}
              />
              {errors.customerPhone && (
                <p className="support-form-error" role="alert">
                  {errors.customerPhone.message}
                </p>
              )}

              <label htmlFor="customer-email">Customer email</label>
              <input
                id="customer-email"
                type="email"
                autoComplete="email"
                {...register('customerEmail', {
                  required: 'Customer email is required.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address.',
                  },
                })}
              />
              {errors.customerEmail && (
                <p className="support-form-error" role="alert">
                  {errors.customerEmail.message}
                </p>
              )}

              <label htmlFor="issue-subject">Issue subject line</label>
              <input
                id="issue-subject"
                type="text"
                {...register('issueSubject', { required: 'Issue subject is required.' })}
              />
              {errors.issueSubject && (
                <p className="support-form-error" role="alert">
                  {errors.issueSubject.message}
                </p>
              )}

              <label htmlFor="issue-description">Issue description</label>
              <textarea
                id="issue-description"
                rows={5}
                {...register('issueDescription', {
                  required: 'Issue description is required.',
                })}
              />
              {errors.issueDescription && (
                <p className="support-form-error" role="alert">
                  {errors.issueDescription.message}
                </p>
              )}
              </div>

              <footer className="support-drawer-footer">
                <button
                  className="support-secondary-button"
                  type="button"
                  onClick={closeSupportDrawer}
                >
                  Cancel
                </button>
                <button className="continue-button" type="submit">
                  Send
                </button>
              </footer>
            </form>
          </aside>
        </div>
      )}

      <Snackbar
        open={isSubmitSnackbarOpen}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={(_, reason) => {
          if (reason === 'clickaway') {
            return;
          }

          setIsSubmitSnackbarOpen(false);
        }}
        message="Your support request has been submitted successfully."
        sx={{
          left: '50%',
          right: 'auto',
          transform: 'translateX(-50%)',
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#2f7d6d',
            color: '#ffffff',
            fontWeight: 700,
          },
          '& .MuiSnackbarContent-message': {
            color: '#ffffff',
          },
        }}
      />
    </section>
  );
}

function SettingsPage({
  currentUser,
  themeMode,
  onThemeChange,
  onUpdateCurrentUser,
}: {
  currentUser: MockUser | null;
  themeMode: ThemeMode;
  onThemeChange: (themeMode: ThemeMode) => void;
  onUpdateCurrentUser: (updates: Partial<Pick<MockUser, 'email' | 'password'>>) => void;
}) {
  const [newEmail, setNewEmail] = useState(currentUser?.email ?? '');
  const [emailMessage, setEmailMessage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    setNewEmail(currentUser?.email ?? '');
  }, [currentUser?.email]);

  const handleEmailSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = newEmail.trim();

    if (!trimmedEmail) {
      setEmailMessage('Enter a valid email address.');
      return;
    }

    onUpdateCurrentUser({ email: trimmedEmail });
    setEmailMessage('Email updated.');
  };

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentPassword !== currentUser?.password) {
      setPasswordMessage('Current password does not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage('New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage('New passwords do not match.');
      return;
    }

    onUpdateCurrentUser({ password: newPassword });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordMessage('Password updated.');
  };

  return (
    <section className="settings-page" aria-labelledby="settings-heading">
      <div className="settings-hero">
        <p className="eyebrow">Settings</p>
        <h1 id="settings-heading">Account settings</h1>
      </div>

      <div className="settings-grid">
        <section className="settings-card theme-card" aria-labelledby="theme-heading">
          <div>
            <p className="eyebrow">Appearance</p>
            <h2 id="theme-heading">Light or dark mode</h2>
            <p>Choose the display mode for this dashboard.</p>
          </div>
          <label className="theme-switch">
            <span>Light</span>
            <input
              type="checkbox"
              role="switch"
              aria-label="Use dark mode"
              checked={themeMode === 'dark'}
              onChange={(event) =>
                onThemeChange(event.target.checked ? 'dark' : 'light')
              }
            />
            <span className="theme-slider" aria-hidden="true" />
            <span>Dark</span>
          </label>
        </section>

        <form
          className="settings-card settings-form"
          aria-labelledby="email-heading"
          onSubmit={handleEmailSubmit}
        >
          <div>
            <p className="eyebrow">Email</p>
            <h2 id="email-heading">Change your email</h2>
          </div>
          <label htmlFor="settings-email">Email address</label>
          <input
            id="settings-email"
            name="settingsEmail"
            type="email"
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            autoComplete="email"
            required
          />
          {emailMessage && <p className="settings-message">{emailMessage}</p>}
          <button className="continue-button" type="submit">
            Save email
          </button>
        </form>

        <form
          className="settings-card settings-form"
          aria-labelledby="password-heading"
          onSubmit={handlePasswordSubmit}
        >
          <div>
            <p className="eyebrow">Password</p>
            <h2 id="password-heading">Change your password</h2>
          </div>
          <label htmlFor="current-password">Current password</label>
          <input
            id="current-password"
            name="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          <label htmlFor="new-password">New password</label>
          <input
            id="new-password"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            autoComplete="new-password"
            required
          />

          <label htmlFor="settings-confirm-password">Confirm new password</label>
          <input
            id="settings-confirm-password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
          {passwordMessage && <p className="settings-message">{passwordMessage}</p>}
          <button className="continue-button" type="submit">
            Save password
          </button>
        </form>
      </div>
    </section>
  );
}

function CompaniesPage() {
  return (
    <section className="companies-page" aria-labelledby="companies-heading">
      <div className="companies-hero">
        <div>
          <p className="eyebrow">Administration</p>
          <h1 id="companies-heading">Subscribing companies</h1>
          <p>
            Companies with an active subscription to the customer service platform.
          </p>
        </div>
      </div>

      <section className="companies-list" aria-label="Subscribing companies">
        {mockCompanies.map((company) => (
          <article className="company-row" key={company.id}>
            <div>
              <h3>{company.name}</h3>
              <p>{company.clientAccount}</p>
            </div>
            <dl className="company-meta">
              <div>
                <dt>Primary contact</dt>
                <dd>{company.primaryContact}</dd>
              </div>
              <div>
                <dt>Plan</dt>
                <dd>{company.subscriptionPlan}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <span className={`company-status company-status-${company.status.toLowerCase()}`}>
                    {company.status}
                  </span>
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </section>
  );
}

function ExpensesPage({ currentUser }: { currentUser: MockUser | null }) {
  const clientSpend = customerUsers.map((user) => ({
    client: user.customerName,
    company: user.company,
    total: getTotalExpenses(user),
    isCurrentUser: user.email === currentUser?.email,
  }));
  const highestSpend = Math.max(...clientSpend.map((client) => client.total));
  const totalClientSpend = clientSpend.reduce((total, client) => total + client.total, 0);
  const averageClientSpend = totalClientSpend / clientSpend.length;

  return (
    <section className="expenses-page" aria-labelledby="expenses-heading">
      <div className="expenses-hero">
        <div>
          <p className="eyebrow">My expenses</p>
          <h1 id="expenses-heading">Client spending overview</h1>
          <p>
            Compare how much each client is spending this month and quickly spot
            accounts that need a closer look.
          </p>
        </div>
      </div>

      <section className="expense-summary-grid" aria-label="Client expense summary">
        <article className="summary-card">
          <span className="summary-label">Total client spend</span>
          <strong>{currencyFormatter.format(totalClientSpend)}</strong>
          <p>Combined monthly spend across all mock clients.</p>
        </article>
        <article className="summary-card">
          <span className="summary-label">Average client spend</span>
          <strong>{currencyFormatter.format(averageClientSpend)}</strong>
          <p>Useful baseline for comparing active accounts.</p>
        </article>
        <article className="summary-card">
          <span className="summary-label">Highest spender</span>
          <strong>{currencyFormatter.format(highestSpend)}</strong>
          <p>
            {clientSpend.find((client) => client.total === highestSpend)?.client}
          </p>
        </article>
      </section>

      <section className="client-spend-panel" aria-label="Client spend chart">
        <div className="section-heading">
          <p className="eyebrow">Spend by client</p>
          <h2>Monthly client spend</h2>
        </div>
        <div className="client-spend-chart">
          <BarChart
            width={960}
            height={360}
            data={clientSpend}
            margin={{ top: 12, right: 18, left: 8, bottom: 36 }}
          >
            <CartesianGrid stroke="#d8e0dc" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="client"
              interval={0}
              tick={{ fill: '#63716e', fontSize: 12, fontWeight: 700 }}
              tickLine={false}
              axisLine={{ stroke: '#d8e0dc' }}
            />
            <YAxis
              tickFormatter={(value) => currencyFormatter.format(Number(value))}
              tick={{ fill: '#63716e', fontSize: 12, fontWeight: 700 }}
              tickLine={false}
              axisLine={false}
              width={82}
            />
            <Tooltip
              formatter={(value) => [
                currencyFormatter.format(Number(value)),
                'Monthly spend',
              ]}
              labelFormatter={(label) => `${label}`}
            />
            <Bar dataKey="total" fill="#4267ac" radius={[8, 8, 0, 0]} />
          </BarChart>
        </div>
      </section>

      <section className="client-spend-list" aria-label="Client spend details">
        {clientSpend.map((client) => (
          <article
            className={`client-spend-row${client.isCurrentUser ? ' active-client' : ''}`}
            key={client.client}
          >
            <div>
              <h3>{client.client}</h3>
              <p>{client.company}</p>
            </div>
            <strong>{currencyFormatter.format(client.total)}</strong>
          </article>
        ))}
      </section>
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
