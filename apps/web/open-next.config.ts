import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// No ISR/remote fetch cache: marketing content is versioned with the deployment.
// R2 backups use a separate private bucket, never this application's asset binding.
export default defineCloudflareConfig({});
