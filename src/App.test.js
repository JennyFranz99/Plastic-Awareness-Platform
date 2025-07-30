// src/App.test.js
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders learn page heading', () => {
render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const headingElement = screen.getByText(/welcome to the plastic pollution awareness platform/i);
  expect(headingElement).toBeInTheDocument();
});