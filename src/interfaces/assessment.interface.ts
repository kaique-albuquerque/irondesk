export interface BodyMeasurements {
  shoulder: number;
  chest: number;
  waist: number;
  hip: number;
  thigh: number;
  arm: number;
}

export interface Assessment {
  id: string;
  studentId: string;
  assessedBy: string;
  date: string;
  weight: number;
  height: number;
  bodyFat: number;
  measurements: BodyMeasurements;
  notes: string;
}

export interface AssessmentView extends Assessment {
  studentName: string;
  bmi: number;
  imcLabel: string;
}

export type AssessmentInput = Omit<Assessment, 'id'>;
