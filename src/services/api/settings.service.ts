import type { Settings } from '@/interfaces/settings.interface';
import { simulateLatency } from '@/services/api/helpers';
import { getDatabase, mutateDatabase, resetDatabase } from '@/services/storage/database.service';

export const settingsService = {
  async get(): Promise<Settings> {
    await simulateLatency();
    return settingsService.read();
  },

  async update(input: Settings): Promise<Settings> {
    await simulateLatency();
    return mutateDatabase((database) => {
      database.settings = { ...database.settings, ...input };
      return database.settings;
    });
  },

  async resetDemoData(): Promise<void> {
    await simulateLatency();
    resetDatabase();
  },

  read(): Settings {
    return { ...getDatabase().settings };
  },
};
