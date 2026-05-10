import { initializeDatabase } from '../../config/database';
import { seedDefaultAdmin } from '../../app/services/auth';

const run = async (): Promise<void> => {
  try {
    await initializeDatabase();

    const result = await seedDefaultAdmin();

    console.log(
      result.created
        ? `Admin created: ${result.user.email}`
        : `Admin already exists: ${result.user.email}`
    );

    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin user', error);
    process.exit(1);
  }
};

void run();