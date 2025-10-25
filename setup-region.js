const axios = require('axios');

const MEDUSA_URL = 'http://localhost:9000';
const ADMIN_EMAIL = 'admin@storybox.bg';
const ADMIN_PASSWORD = 'Pandora2019+';

async function setupRegion() {
  try {
    // 1. Login as admin
    console.log('🔐 Logging in...');
    const authResponse = await axios.post(`${MEDUSA_URL}/auth/user/emailpass`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    const token = authResponse.data.token;
    console.log('✅ Logged in\n');

    const api = axios.create({
      baseURL: MEDUSA_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // 2. Check for existing regions
    console.log('🌍 Checking regions...');
    const regionsResponse = await api.get('/admin/regions');
    
    if (regionsResponse.data.regions && regionsResponse.data.regions.length > 0) {
      console.log('✅ Regions already exist:');
      regionsResponse.data.regions.forEach(r => {
        console.log(`   - ${r.name} (${r.currency_code.toUpperCase()}) - ID: ${r.id}`);
      });
      console.log('\n📋 Use this region ID in cart creation:');
      console.log(`   ${regionsResponse.data.regions[0].id}`);
      return;
    }

    // 3. Create Bulgaria region
    console.log('📍 Creating Bulgaria region...');
    const regionData = {
      name: 'Bulgaria',
      currency_code: 'bgn',
      countries: ['bg']
    };

    const regionResponse = await api.post('/admin/regions', regionData);
    const region = regionResponse.data.region;

    console.log('✅ Region created successfully!');
    console.log('   Name:', region.name);
    console.log('   Currency:', region.currency_code.toUpperCase());
    console.log('   ID:', region.id);
    console.log('\n✅ Setup complete!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

setupRegion();
