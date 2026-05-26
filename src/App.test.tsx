import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { APP_NAME } from './constants/app';

test('renders bus timing header', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: APP_NAME })).toBeInTheDocument();
});
