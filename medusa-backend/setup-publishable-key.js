const fetch = require('node-fetch');

async function setupMedusa() {
  const MEDUSA_URL = 'http://localhost:9000';
  
  console.log('🔧 Setting up Medusa publishable key...\n');

  try {
    // First, create a publishable API key via SQL since Medusa v2 API might not have endpoint
    console.log('Creating publishable API key directly in database...');
    
    const { Client } = require('pg');
    const client = new Client({
      host: 'localhost',
      port: 5432,
      user: 'medusa_user',
      password: 'medusa_password',
      database: 'medusa_db',
    });

    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Check if publishable keys already exist
    const checkResult = await client.query('SELECT * FROM publishable_api_key LIMIT 1');
    
    let publishableKey;
    if (checkResult.rows.length > 0) {
      publishableKey = checkResult.rows[0].id;
      console.log(`✅ Found existing publishable key: ${publishableKey}`);
    } else {
      // Create a new publishable key
      const insertResult = await client.query(`
        INSERT INTO publishable_api_key (id, created_at, updated_at, created_by, revoked_by, revoked_at)
        VALUES (
          'pk_' || md5(random()::text),
          NOW(),
          NOW(),
          NULL,
          NULL,
          NULL
        )
        RETURNING id
      `);
      publishableKey = insertResult.rows[0].id;
      console.log(`✅ Created new publishable key: ${publishableKey}`);
    }

    // Get or create default sales channel
    console.log('\nSetting up sales channel...');
    const salesChannelResult = await client.query(`
      SELECT id FROM sales_channel WHERE name = 'Default Sales Channel' LIMIT 1
    `);

    let salesChannelId;
    if (salesChannelResult.rows.length > 0) {
      salesChannelId = salesChannelResult.rows[0].id;
      console.log(`✅ Found sales channel: ${salesChannelId}`);
    } else {
      const createChannelResult = await client.query(`
        INSERT INTO sales_channel (id, name, description, is_disabled, created_at, updated_at, deleted_at)
        VALUES (
          'sc_' || md5(random()::text),
          'Default Sales Channel',
          'Default sales channel for the store',
          false,
          NOW(),
          NOW(),
          NULL
        )
        RETURNING id
      `);
      salesChannelId = createChannelResult.rows[0].id;
      console.log(`✅ Created sales channel: ${salesChannelId}`);
    }

    // Link publishable key to sales channel
    console.log('\nLinking publishable key to sales channel...');
    await client.query(`
      INSERT INTO publishable_api_key_sales_channel (publishable_key_id, sales_channel_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `, [publishableKey, salesChannelId]);
    console.log('✅ Linked successfully');

    await client.end();

    // Update .env file
    console.log('\n📝 Updating .env files...');
    const fs = require('fs');
    const path = require('path');

    // Update Next.js .env
    const nextEnvPath = path.join(__dirname, '../.env');
    let nextEnvContent = fs.readFileSync(nextEnvPath, 'utf8');
    
    if (nextEnvContent.includes('NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=')) {
      nextEnvContent = nextEnvContent.replace(
        /NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=.*/,
        `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableKey}`
      );
    } else {
      nextEnvContent += `\nNEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableKey}\n`;
    }
    
    fs.writeFileSync(nextEnvPath, nextEnvContent);
    console.log('✅ Updated /app/.env');

    console.log('\n🎉 Medusa setup complete!');
    console.log(`\n📋 Publishable Key: ${publishableKey}`);
    console.log(`📋 Sales Channel: ${salesChannelId}`);
    console.log('\n⚠️  Please restart Next.js server for changes to take effect:');
    console.log('   sudo supervisorctl restart nextjs');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

setupMedusa();
