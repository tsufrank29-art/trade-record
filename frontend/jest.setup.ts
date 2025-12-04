import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock axios to avoid real network calls during unit tests
jest.mock('@/api/axios', () => ({
  post: jest.fn(() =>
    Promise.resolve({
      data: { token: 'test-token', user: { id: 1, email: 'user@example.com', nickname: 'Tester' } }
    })
  )
}));
