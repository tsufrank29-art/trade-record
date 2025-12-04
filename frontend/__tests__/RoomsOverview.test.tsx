import React from 'react';
import { render } from '@testing-library/react-native';
import RoomsOverview from '../src/screens/RoomsOverview';

jest.mock('../src/hooks/useRooms', () => ({
  useRooms: () => ({
    data: [
      { id: 1, name: '短線房', owner: '小明', trading_cycle: '短線波段', member_count: 12 }
    ],
    isLoading: false,
    isError: false
  })
}));

describe('RoomsOverview', () => {
  it('shows room cards', () => {
    const { getByText } = render(<RoomsOverview />);
    expect(getByText('短線房')).toBeTruthy();
    expect(getByText(/人數：12/)).toBeTruthy();
  });
});
