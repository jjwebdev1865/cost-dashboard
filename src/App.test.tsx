import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders client cost dashboard', () => {
  render(<App />);
  expect(screen.getByText(/client cost preview/i)).toBeInTheDocument();
  expect(screen.getByText(/expense breakdown/i)).toBeInTheDocument();
  expect(screen.getByText(/hours worked by phase/i)).toBeInTheDocument();
});
