import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { useAuthStore } from './stores/authStore';

beforeEach(() => {
  window.history.pushState({}, '', '/');
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

test('renders client cost dashboard after login', () => {
  render(<App />);

  loginAsAlex();

  expect(screen.getByText(/client cost preview/i)).toBeInTheDocument();
  expect(screen.getByText(/expense breakdown/i)).toBeInTheDocument();
  expect(screen.getByText(/hours worked by phase/i)).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: /primary navigation/i })).toBeInTheDocument();
});

test('navigates between top navigation links', () => {
  render(<App />);
  loginAsAlex();

  fireEvent.click(screen.getByRole('link', { name: /support/i }));
  expect(screen.getByRole('heading', { name: /hello world/i })).toBeInTheDocument();
  expect(screen.getAllByText(/support/i).length).toBeGreaterThan(0);

  fireEvent.click(screen.getByRole('link', { name: /my expenses/i }));
  expect(screen.getByRole('heading', { name: /hello world/i })).toBeInTheDocument();
  expect(screen.getAllByText(/my expenses/i).length).toBeGreaterThan(0);

  fireEvent.click(screen.getByRole('link', { name: /home/i }));
  expect(screen.getByText(/client cost preview/i)).toBeInTheDocument();
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

  expect(screen.getByRole('heading', { name: /hello world/i })).toBeInTheDocument();
  expect(screen.getAllByText(/settings/i).length).toBeGreaterThan(0);
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

  expect(screen.getByText(/client cost preview/i)).toBeInTheDocument();
  expect(screen.getByText(/welcome back, alex rivera/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
});

test('shows customer-specific mock costs after login', () => {
  render(<App />);

  clickLoginButton();
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'sam@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'support2026' },
  });
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));

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
