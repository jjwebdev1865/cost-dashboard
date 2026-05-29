import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { useAuthStore } from './stores/authStore';

beforeEach(() => {
  window.history.pushState({}, '', '/');
  delete document.body.dataset.theme;
  useAuthStore.getState().logoutUser();
});

const clickLoginButton = () => {
  const loginButtons = screen.getAllByRole('button', { name: /login/i });
  fireEvent.click(loginButtons[loginButtons.length - 1]);
};

const loginAsAlex = () => {
  clickLoginButton();
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'alex@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'password123' },
  });
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));
};

test('renders the welcome page when no user is logged in', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /welcome to the site/i })).toBeInTheDocument();
  expect(screen.getByText(/track customer support activity/i)).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /login/i }).length).toBeGreaterThan(0);
  expect(screen.queryByRole('navigation', { name: /primary navigation/i })).not.toBeInTheDocument();
});

test('renders logged-in home without expense details', () => {
  render(<App />);

  loginAsAlex();

  expect(screen.getByRole('heading', { name: /welcome back, alex rivera/i })).toBeInTheDocument();
  expect(screen.getByText(/review client spend/i)).toBeInTheDocument();
  expect(screen.queryByText(/expense breakdown/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/hours worked by phase/i)).not.toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: /primary navigation/i })).toBeInTheDocument();
});

test('navigates between top navigation links', () => {
  render(<App />);
  loginAsAlex();

  fireEvent.click(screen.getByRole('link', { name: /support/i }));
  expect(
    screen.getByRole('heading', { name: /we are here to help/i })
  ).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /meet the team/i })).toBeInTheDocument();
  expect(screen.getByText(/morgan ellis/i)).toBeInTheDocument();
  expect(screen.getAllByText(/support/i).length).toBeGreaterThan(0);

  fireEvent.click(screen.getByRole('link', { name: /my expenses/i }));
  expect(
    screen.getByRole('heading', { name: /client spending overview/i })
  ).toBeInTheDocument();
  expect(screen.getAllByText(/my expenses/i).length).toBeGreaterThan(0);

  fireEvent.click(screen.getByRole('link', { name: /home/i }));
  expect(screen.getByRole('heading', { name: /welcome back, alex rivera/i })).toBeInTheDocument();
});

test('opens the settings dropdown from the top navigation', () => {
  render(<App />);
  loginAsAlex();

  fireEvent.click(screen.getByRole('button', { name: /open settings menu/i }));
  expect(screen.getByRole('menuitem', { name: /settings/i })).toBeInTheDocument();
  expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
});

test('navigates to settings from the settings dropdown', () => {
  render(<App />);
  loginAsAlex();

  fireEvent.click(screen.getByRole('button', { name: /open settings menu/i }));
  fireEvent.click(screen.getByRole('menuitem', { name: /settings/i }));

  expect(screen.getByRole('heading', { name: /account settings/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /light or dark mode/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /change your email/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /change your password/i })).toBeInTheDocument();
});

test('updates appearance mode from settings', () => {
  render(<App />);
  loginAsAlex();

  fireEvent.click(screen.getByRole('button', { name: /open settings menu/i }));
  fireEvent.click(screen.getByRole('menuitem', { name: /settings/i }));
  fireEvent.click(screen.getByRole('switch', { name: /use dark mode/i }));

  expect(document.body).toHaveAttribute('data-theme', 'dark');
});

test('updates the current user email from settings', () => {
  render(<App />);
  loginAsAlex();

  fireEvent.click(screen.getByRole('button', { name: /open settings menu/i }));
  fireEvent.click(screen.getByRole('menuitem', { name: /settings/i }));
  fireEvent.change(screen.getByLabelText(/email address/i), {
    target: { value: 'alex.updated@example.com' },
  });
  fireEvent.click(screen.getByRole('button', { name: /save email/i }));

  expect(screen.getByText(/email updated/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /open settings menu/i }));
  fireEvent.click(screen.getByRole('menuitem', { name: /profile/i }));

  expect(screen.getByText(/alex.updated@example.com/i)).toBeInTheDocument();
});

test('updates the current user password from settings', () => {
  render(<App />);
  loginAsAlex();

  fireEvent.click(screen.getByRole('button', { name: /open settings menu/i }));
  fireEvent.click(screen.getByRole('menuitem', { name: /settings/i }));
  fireEvent.change(screen.getByLabelText(/current password/i), {
    target: { value: 'password123' },
  });
  fireEvent.change(screen.getByLabelText(/^new password$/i), {
    target: { value: 'newpass123' },
  });
  fireEvent.change(screen.getByLabelText(/confirm new password/i), {
    target: { value: 'newpass123' },
  });
  fireEvent.click(screen.getByRole('button', { name: /save password/i }));

  expect(screen.getByText(/password updated/i)).toBeInTheDocument();
  expect(useAuthStore.getState().currentUser?.password).toBe('newpass123');
});

test('shows profile details for the logged in user', () => {
  render(<App />);

  loginAsAlex();

  fireEvent.click(screen.getByRole('button', { name: /open settings menu/i }));
  fireEvent.click(screen.getByRole('menuitem', { name: /profile/i }));

  expect(screen.getByRole('heading', { name: /alex rivera/i })).toBeInTheDocument();
  expect(screen.getByText(/alex@example.com/i)).toBeInTheDocument();
  expect(screen.getByText(/evergreen health systems/i)).toBeInTheDocument();
});

test('logs in with a valid mock user and updates the auth button', () => {
  render(<App />);

  clickLoginButton();
  expect(
    screen.getByRole('heading', { name: /sign in to the customer dashboard/i })
  ).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'alex@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'password123' },
  });
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));

  expect(screen.getByRole('heading', { name: /welcome back, alex rivera/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
});

test('shows client spend totals on the expenses page', () => {
  render(<App />);

  clickLoginButton();
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'sam@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'support2026' },
  });
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));
  fireEvent.click(screen.getByRole('link', { name: /my expenses/i }));

  expect(screen.getAllByText(/harbor retail partners/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText('$17,100').length).toBeGreaterThan(0);

  fireEvent.click(screen.getByRole('button', { name: /logout/i }));
  clickLoginButton();
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'jordan@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'dashboard' },
  });
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));
  fireEvent.click(screen.getByRole('link', { name: /my expenses/i }));

  expect(screen.getAllByText(/summit field operations/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText('$30,000').length).toBeGreaterThan(0);
});

test('links from login to the create account page', () => {
  render(<App />);

  clickLoginButton();
  fireEvent.click(screen.getByRole('link', { name: /create an account/i }));

  expect(
    screen.getByRole('heading', { name: /sign up for the customer dashboard/i })
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
});
