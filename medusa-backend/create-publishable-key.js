const { Client } = require('pg');
const crypto = require('crypto');

async function createPublishableKey() {
  console.log('🔑 Creating Medusa Publishable API Key...\n');

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

    // Check if key already exists
    const existingKey = await client.query(`
      SELECT id, title, redacted FROM api_key 
      WHERE type = 'publishable' AND deleted_at IS NULL 
      LIMIT 1
    `);

    if (existingKey.rows.length > 0) {
      const key = existingKey.rows[0];
      console.log('✅ Publishable key already exists:');
      console.log(`   ID: ${key.id}`);
      console.log(`   Title: ${key.title}`);
      console.log(`   Key: ${key.redacted}\n`);
      
      // Update .env
      await updateEnvFile(key.redacted);
      await client.end();
      return;
    }

    // Generate new API key
    const keyId = `pk_${crypto.randomBytes(16).toString('hex')}`;
    const token = `pk_${crypto.randomBytes(32).toString('hex')}`;
    const salt = crypto.randomBytes(16).toString('hex');
    const redacted = token.substring(0, 7) + '...' + token.substring(token.length - 4);
    
    // Get sales channel
    const salesChannelResult = await client.query(`
      SELECT id FROM sales_channel 
      WHERE name = 'Default Sales Channel' 
      LIMIT 1
    `);
    
    if (salesChannelResult.rows.length === 0) {
      throw new Error('No sales channel found');
    }
    
    const salesChannelId = salesChannelResult.rows[0].id;
    console.log(`✅ Found sales channel: ${salesChannelId}\n`);

    // Insert API key
    console.log('Creating publishable API key...');
    await client.query(`
      INSERT INTO api_key (
        id, token, salt, redacted, title, type, 
        created_by, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, 
        'system', NOW(), NOW()
      )
    `, [keyId, token, salt, redacted, 'Storybox Store Frontend', 'publishable']);

    console.log(`✅ API Key created: ${keyId}\n`);

    // Link to sales channel
    console.log('Linking to sales channel...');
    await client.query(`
      INSERT INTO publishable_api_key_sales_channel (
        publishable_key_id, sales_channel_id
      ) VALUES ($1, $2)
    `, [keyId, salesChannelId]);
    
    console.log('✅ Linked to sales channel\n');

    // Update .env file
    await updateEnvFile(token);

    console.log('🎉 Setup complete!\n');
    console.log('📋 Your Publishable API Key:');
    console.log(`   ${token}\n`);
    console.log('⚠️  Restart Next.js to apply changes:');
    console.log('   sudo supervisorctl restart nextjs\n');

    await client.end();

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    await client.end();
    process.exit(1);
  }
}

async function updateEnvFile(apiKey) {
  const fs = require('fs');
  const path = require('path');

  console.log('📝 Updating .env file...');
  
  const envPath = path.join(__dirname, '../.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check if key exists and update or append
  if (envContent.includes('NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=')) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=.*/,
      `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey}`
    );
  } else {
    // Add at the end
    if (!envContent.endsWith('\n')) {
      envContent += '\n';
    }
    envContent += `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey}\n`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Updated /app/.env\n');
}

createPublishableKey();
