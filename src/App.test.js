import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn page heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/welcome to the plastic pollution awareness platform/i);
  expect(headingElement).toBeInTheDocument();
});