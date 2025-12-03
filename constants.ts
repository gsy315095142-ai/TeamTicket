import { TimeSlot, HallType, Seat } from './types';

export const HALL_CONFIG = {
  A: { label: 'A Hall (Big)', capacity: 4 },
  B: { label: 'B Hall (Small)', capacity: 2 },
};

export const generateDailySlots = (date: string): { time: string; id: string }[] => {
  const slots = [];
  let hour = 13;
  let minute = 0;

  // From 13:00 to 21:00
  while (hour < 21 || (hour === 21 && minute === 0)) {
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    slots.push({
      time: timeStr,
      id: `${date}-${timeStr}`,
    });
    minute += 10;
    if (minute === 60) {
      minute = 0;
      hour += 1;
    }
  }
  return slots;
};

export const createEmptySeats = (count: number): Seat[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: Math.random().toString(36).substr(2, 9),
    index: i,
    user: null,
  }));
};

export const determinePriceTier = (count: number): string => {
  if (count <= 20) return '50元 (15-20人)';
  if (count <= 30) return '80元 (21-30人)';
  return '120元 (31-50人)';
};
