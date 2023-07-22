import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux'; // Import the Provider
import store from './redux/store'; // Import your Redux store
import App from './App';

test('renders learn react link', () => {
  render(
    <Provider store={store}> {/* Wrap your component with the Provider */}
      <App />
    </Provider>
  );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
