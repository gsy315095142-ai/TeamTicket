export type HallType = 'A' | 'B';

export interface UserInfo {
  name: string;
  gender: 'Male' | 'Female';
  phone: string;
}

export interface Seat {
  id: string;
  index: number;
  user: UserInfo | null;
}

export interface TimeSlot {
  id: string;
  time: string; // HH:mm
  date: string; // YYYY-MM-DD
  hallType: HallType;
  capacity: number;
  seats: Seat[];
}

export interface GroupTicket {
  id: string;
  packageName: string;
  headcount: number;
  priceTier: string;
  selectedDate: string;
  slots: TimeSlot[];
  remarks: string;
  remarkImage?: string; // Data URL
  createdAt: number;
}

export type ViewMode = 'staff' | 'member';
export type StaffTab = 'create' | 'list';
export type MemberStep = 'chat' | 'booking';
