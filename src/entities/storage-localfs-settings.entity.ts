import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/** OWNER: @opoha/plugin-storage-localfs — settings for local root (ADR-0005). */
@Entity({ name: 'storage_localfs_settings' })
export class StorageLocalfsSettingsEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'root_path', type: 'text', nullable: true })
  rootPath!: string | null;

  @Column({ name: 'public_base_url', type: 'text', nullable: true })
  publicBaseUrl!: string | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
