import { DEFAULT_CONFIGURATIONS } from 'endoscopy-shared';
import { initializeDatabase, prisma } from '../../config/database';

// ---------------------------------------------------------------------------
// Sync configurations for a single organization (inside a transaction)
// ---------------------------------------------------------------------------

const syncOrganizationConfigurations = async (
  organizationId: number,
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]
): Promise<{ created: number; skipped: number }> => {
  let created = 0;
  let skipped = 0;

  for (const config of DEFAULT_CONFIGURATIONS) {
    const existing = await tx.configurationModule.findFirst({
      where: {
        organizationId,
        module: config.module,
        subModule: config.subModule,
        fieldKey: config.fieldKey,
      },
    });

    if (existing) {
      skipped++;
    } else {
      await tx.configurationModule.create({
        data: {
          ...config,
          organizationId,
          meta: config.meta != null ? JSON.stringify(config.meta) : undefined,
        },
      });
      created++;
    }
  }

  return { created, skipped };
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const run = async (): Promise<void> => {
  try {
    await initializeDatabase();

    const organizations = await prisma.organization.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    });

    if (organizations.length === 0) {
      console.log('No active organizations found. Skipping.');
      process.exit(0);
    }

    console.log(`Found ${organizations.length} organization(s). Syncing configurations...\n`);

    let totalCreated = 0;
    let totalSkipped = 0;

    for (const org of organizations) {
      const { created, skipped } = await prisma.$transaction(async (tx) => {
        return syncOrganizationConfigurations(org.id, tx);
      });

      console.log(`✅ Org #${org.id} "${org.name}" — created: ${created}, skipped: ${skipped}`);
      totalCreated += created;
      totalSkipped += skipped;
    }

    console.log(`\n🎉 Done. Total created: ${totalCreated}, skipped: ${totalSkipped}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Configuration org seeder failed', error);
    process.exit(1);
  }
};

void run();
