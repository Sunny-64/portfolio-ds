import { hash } from '@node-rs/argon2';

const password = process.argv[2];

if (!password) {
  console.log('Usage: node scripts/generate-password.mjs <your-password>');
  process.exit(1);
}

hash(password).then((h) => {
  console.log('\n--- Generated Argon2id Password Hash ---');
  console.log(h);
  console.log('\nCopy and paste this into your .env.local (escaped for Next.js dotenv-expand):');
  console.log(`ADMIN_PASSWORD_HASH="${h.replace(/\$/g, '\\$')}"\n`);
});
