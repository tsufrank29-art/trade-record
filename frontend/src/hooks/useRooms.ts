import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

export type Room = {
  id: number;
  name: string;
  owner: string;
  trading_cycle: string;
  member_count: number;
};

const fetchRooms = async (): Promise<Room[]> => {
  const { data } = await api.get('/rooms');
  return data?.data ?? data;
};

export const useRooms = () => {
  return useQuery({ queryKey: ['rooms'], queryFn: fetchRooms });
};
