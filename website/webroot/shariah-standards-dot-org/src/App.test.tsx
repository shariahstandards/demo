import React from 'react';
import { render, screen } from '@testing-library/react';
import {App} from './App';
import { MemoryRouter as Router } from 'react-router-dom';

const renderWithRouter = (node:any) => render(<Router>{node}</Router>);

jest.mock("./")
test('renders page heading', () => {
  renderWithRouter(<App />);
  const linkElement = screen.getByText(/shariah standards/i);
  expect(linkElement).toBeInTheDocument();
});
