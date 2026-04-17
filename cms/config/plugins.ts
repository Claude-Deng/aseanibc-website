import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  upload: {
    config: {
      // 本地存储（默认），上线前切换到 OSS/S3
      sizeLimit: 5 * 1024 * 1024, // 5MB
    },
  },
});

export default config;
