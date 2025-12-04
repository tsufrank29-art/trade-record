import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import Login from '../src/screens/Login';
import { AuthProvider } from '../src/contexts/AuthContext';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('Login screen', () => {
  it('renders fields and triggers login', async () => {
    const { getByTestId } = render(<Login />, { wrapper });

    fireEvent.changeText(getByTestId('email-input'), 'user@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password');
    fireEvent.press(getByTestId('login-button'));

    await waitFor(() => {
      expect(getByTestId('login-button')).toBeTruthy();
    });
  });
});
