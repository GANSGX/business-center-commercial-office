import bcrypt from 'bcryptjs'

const password = process.argv[2]

if (!password) {
  console.error('Usage: npx ts-node scripts/hash-password.ts yourpassword')
  process.exit(1)
}

bcrypt.hash(password, 12).then((hash) => {
  console.log('\nPassword hash (copy to ADMIN_PASSWORD_HASH in .env.local):')
  console.log(hash)
})
