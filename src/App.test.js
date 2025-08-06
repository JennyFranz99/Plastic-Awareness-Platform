// src/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';


// Recharts is mocked to avoid requiring the actual library during tests.
jest.mock(
  'recharts',
  () => ({
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    LineChart: ({ children }) => <div>{children}</div>,
    Line: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
  }),
  { virtual: true }
);

import App from './App';

test('renders home page hero', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const headingElement = screen.getByText(/see the truth about plastic/i);
  expect(headingElement).toBeInTheDocument();
});