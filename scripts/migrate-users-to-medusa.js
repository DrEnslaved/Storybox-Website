const { Client } = require('pg');

async function migrateUsersToMedusa() {
  console.log('🔄 Starting MongoDB → PostgreSQL/Medusa Migration\n');

  // MongoDB users data (exported)
  const mongoUsers = [
    {
      id: 'f0b2a2d9-1ca5-4c2e-bb44-7175f31f8ac8',
      name: 'Kaloyan Petkov',
      email: 'kalo.petkov@gmail.com',
      password: '$2b$10$JeW.lhCkY1KBcJGjkzc9LuGTvulY8YyAJx7ZEDeAESfhoOiNvi6x.',
      createdAt: '2025-10-25T20:17:40.305Z'
    },
    {
      id: 'd1dd6c6a-ab3c-47fb-b422-41fc237acb2c',
      name: 'Desislava Petkova',
      email: 'dgpetkova@gmail.com',
      password: '$2b$10$nZdF11ntuXMBnALBlHrV..6pwrdiF0AWXDfehbtJhro1Ft8WoiImO',
      createdAt: '2025-10-26T06:57:42.775Z'
    }
  ];

  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'medusa_user',
    password: 'medusa_password',
    database: 'medusa_db',
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL\n');

    for (const user of mongoUsers) {
      console.log(`Migrating user: ${user.name} (${user.email})`);

      // Split name into first and last
      const nameParts = user.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Check if customer already exists
      const existingCustomer = await client.query(
        'SELECT id FROM customer WHERE email = $1',
        [user.email]
      );

      if (existingCustomer.rows.length > 0) {
        console.log(`  ⏭️  Customer already exists, skipping\n`);
        continue;
      }

      // Generate Medusa customer ID
      const customerId = `cus_${Math.random().toString(36).substring(2, 15)}`;

      // Insert customer into Medusa
      await client.query(`
        INSERT INTO customer (
          id, 
          email, 
          first_name, 
          last_name,
          password_hash,
          has_account,
          created_at,
          updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, true, $6, $6
        )
      `, [
        customerId,
        user.email,
        firstName,
        lastName,
        user.password, // Keep the same bcrypt hash
        user.createdAt
      ]);

      console.log(`  ✅ Created Medusa customer: ${customerId}\n`);
    }

    console.log('🎉 Migration completed successfully!\n');
    console.log('Migrated users:');
    mongoUsers.forEach(u => console.log(`  - ${u.name} (${u.email})`));

    await client.end();

  } catch (error) {
    console.error('❌ Migration error:', error);
    await client.end();
    process.exit(1);
  }
}

migrateUsersToMedusa();
