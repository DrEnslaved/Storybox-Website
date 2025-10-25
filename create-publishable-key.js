const axios = require('axios');

const MEDUSA_URL = 'http://localhost:9000';
const ADMIN_EMAIL = 'admin@storybox.bg';
const ADMIN_PASSWORD = 'Pandora2019+';

async function createPublishableKey() {
  try {
    // 1. Login as admin
    console.log('🔐 Logging in as admin...');
    const authResponse = await axios.post(`${MEDUSA_URL}/auth/user/emailpass`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    const token = authResponse.data.token;
    console.log('✅ Logged in successfully\n');

    // Set up axios with auth header
    const api = axios.create({
      baseURL: MEDUSA_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // 2. Try different endpoints to create publishable key
    console.log('🔑 Attempting to create publishable API key...\n');
    
    // Try endpoint 1: /admin/api-keys
    try {
      const response1 = await api.post('/admin/api-keys', {
        title: 'Web Storefront Key',
        type: 'publishable'
      });
      console.log('✅ Publishable key created via /admin/api-keys');
      console.log('Key:', response1.data);
      return;
    } catch (error) {
      console.log('❌ /admin/api-keys failed:', error.response?.status);
    }

    // Try endpoint 2: Direct Medusa v2 approach - get existing keys
    try {
      const listResponse = await api.get('/admin/api-keys?type=publishable');
      if (listResponse.data?.api_keys?.length > 0) {
        const key = listResponse.data.api_keys[0];
        console.log('✅ Found existing publishable key:');
        console.log('   ID:', key.id);
        console.log('   Title:', key.title);
        console.log('   Token:', key.token);
        console.log('\n📋 Add this to your .env file:');
        console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${key.token}`);
        return;
      }
    } catch (error) {
      console.log('❌ Failed to list keys:', error.response?.status);
    }

    // Try endpoint 3: Check sales channel approach
    try {
      const channelsResponse = await api.get('/admin/sales-channels');
      const salesChannelId = channelsResponse.data.sales_channels?.[0]?.id;
      
      if (salesChannelId) {
        console.log('✅ Found sales channel:', salesChannelId);
        console.log('\n⚠️  Manual setup required:');
        console.log('1. Go to: http://localhost:9000/app');
        console.log('2. Login with: admin@storybox.bg / Pandora2019+');
        console.log('3. Navigate to: Settings → API');
        console.log('4. Create a Publishable API Key');
        console.log('5. Associate it with sales channel:', salesChannelId);
        console.log('6. Copy the key and add to /app/.env:');
        console.log('   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...');
      }
    } catch (error) {
      console.log('❌ Failed to get sales channel:', error.response?.status);
    }

    console.log('\n📖 Medusa Admin Dashboard:');
    console.log('   URL: http://localhost:9000/app');
    console.log('   Email: admin@storybox.bg');
    console.log('   Password: Pandora2019+');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

createPublishableKey();
