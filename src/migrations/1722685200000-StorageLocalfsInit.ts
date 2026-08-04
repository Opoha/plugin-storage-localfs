import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Initial settings table for localfs storage (ADR-0005).
 * Table prefix: plugin id `storage-localfs` → `storage_localfs_*`.
 * Blob bytes stay on disk; this table only stores optional config.
 */
export class StorageLocalfsInit1722685200000 implements MigrationInterface {
  name = 'StorageLocalfsInit1722685200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "storage_localfs_settings" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "root_path" text,
        "public_base_url" text,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "storage_localfs_settings_pkey" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "storage_localfs_settings"`);
  }
}
