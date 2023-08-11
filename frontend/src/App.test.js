import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux'; 
import store from './redux/store'; 
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
