import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders client cost dashboard', () => {
  render(<App />);
  expect(screen.getByText(/client cost preview/i)).toBeInTheDocument();
  expect(screen.getByText(/expense breakdown/i)).toBeInTheDocument();
  expect(screen.getByText(/hours worked by phase/i)).toBeInTheDocument();
});

test('logs in with a valid mock user and updates the auth button', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /login/i }));
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
