export interface Checkin {
  id: string;
  studentId: string;
  date: string;
  checkInAt: string;
  checkOutAt: string | null;
}

export interface CheckinView extends Checkin {
  studentName: string;
  studentPlan: string;
  durationMinutes: number | null;
}

export interface CheckinInput {
  studentId: string;
  date: string;
  checkInAt: string;
}
