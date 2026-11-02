import type { Assessment } from '@/interfaces/assessment.interface';
import type { Employee } from '@/interfaces/employee.interface';
import type { Student } from '@/interfaces/student.interface';
import { addDays, todayISO } from '@/utils/date';
import { randomDecimal, randomInt } from '@/utils/random';

export function buildAssessments(
  students: Student[],
  employees: Employee[],
): Assessment[] {
  const assessor = employees.find((employee) => employee.role === 'professor') ?? employees[0];
  const candidates = students.filter((student) => student.status === 'active').slice(0, 18);
  const assessments: Assessment[] = [];

  candidates.forEach((student, studentIndex) => {
    const height = randomInt(158, 191);
    let weight = randomDecimal(58, 104, 1);
    let bodyFat = randomDecimal(16, 33, 1);
    const baseDate = addDays(todayISO(), -270);

    for (let index = 0; index < 3; index += 1) {
      const date = addDays(baseDate, index * 90 + (studentIndex % 12));
      weight = Number((weight - randomDecimal(0.2, 2.4, 1)).toFixed(1));
      bodyFat = Number((bodyFat - randomDecimal(0.1, 1.3, 1)).toFixed(1));
      assessments.push({
        id: `asm_${student.id}_${index}`,
        studentId: student.id,
        assessedBy: assessor.id,
        date,
        weight,
        height,
        bodyFat,
        measurements: {
          shoulder: randomInt(104, 126),
          chest: randomInt(84, 108),
          waist: randomInt(68, 96),
          hip: randomInt(88, 112),
          thigh: randomInt(50, 66),
          arm: randomInt(27, 39),
        },
        notes: index === 0 ? 'Avaliação inicial de acompanhamento.' : 'Evolução registrada pelo professor responsável.',
      });
    }
  });

  return assessments;
}
