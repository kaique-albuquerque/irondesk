import type { Checkin } from '@/interfaces/checkin.interface';
import type { Student } from '@/interfaces/student.interface';
import { addDays } from '@/utils/date';
import { randomChance, randomInt, randomPick } from '@/utils/random';

const peakHours = [6, 6, 7, 7, 7, 8, 8, 9, 10, 11, 12, 15, 16, 17, 18, 18, 18, 19, 19, 20, 21];

function toTimestamp(date: string, hour: number, minute: number): string {
  return `${date}T${`${hour}`.padStart(2, '0')}:${`${minute}`.padStart(2, '0')}:00.000Z`;
}

export function buildCheckins(students: Student[], today: string): Checkin[] {
  const active = students.filter((student) => student.status === 'active');
  const checkins: Checkin[] = [];
  let counter = 0;

  for (let dayOffset = 29; dayOffset >= 0; dayOffset -= 1) {
    const date = addDays(today, -dayOffset);
    const isToday = dayOffset === 0;
    const total = isToday ? randomInt(12, 24) : randomInt(15, 33);
    const used = new Set<string>();

    for (let index = 0; index < total; index += 1) {
      const student = randomPick(active);
      if (used.has(student.id)) continue;
      used.add(student.id);
      const hour = isToday ? randomInt(6, 14) : randomPick(peakHours);
      const minute = randomInt(0, 59);
      const stillTraining = isToday && randomChance(0.4);
      const duration = randomInt(42, 108);
      counter += 1;
      checkins.push({
        id: `chk_${`${counter}`.padStart(4, '0')}`,
        studentId: student.id,
        date,
        checkInAt: toTimestamp(date, hour, minute),
        checkOutAt: stillTraining
          ? null
          : toTimestamp(date, hour + Math.floor((minute + duration) / 60), (minute + duration) % 60),
      });
    }
  }

  return checkins;
}
