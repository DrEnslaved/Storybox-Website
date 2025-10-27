const fetch = require('node-fetch');

const MEDUSA_URL = 'http://localhost:9000';
const ADMIN_EMAIL = 'admin@storybox.bg';
const ADMIN_PASSWORD = 'admin123456';

async function seedData() {
  try {
    console.log('🇧🇬 Starting Medusa v2 seeding...\n');

    // 1. Login as admin
    console.log('📧 Logging in as admin...');
    const authRes = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      })
    });

    if (!authRes.ok) {
      const error = await authRes.text();
      throw new Error(`Auth failed: ${error}`);
    }

    const authData = await authRes.json();
    const token = authData.token;
    console.log('✅ Successfully logged in\n');

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // 2. Create Bulgaria region
    console.log('🌍 Creating Bulgaria region...');
    const regionRes = await fetch(`${MEDUSA_URL}/admin/regions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'Bulgaria',
        currency_code: 'bgn',
        countries: ['bg'],
        automatic_taxes: false
      })
    });

    let regionId;
    if (regionRes.ok) {
      const regionData = await regionRes.json();
      regionId = regionData.region.id;
      console.log(`✅ Region created: ${regionData.region.name} (ID: ${regionId})\n`);
    } else {
      // Region might already exist, try to get it
      const regionsRes = await fetch(`${MEDUSA_URL}/admin/regions`, { headers });
      const regionsData = await regionsRes.json();
      const bgRegion = regionsData.regions.find(r => r.currency_code === 'bgn');
      if (bgRegion) {
        regionId = bgRegion.id;
        console.log(`ℹ️  Using existing Bulgaria region (ID: ${regionId})\n`);
      } else {
        throw new Error('Could not create or find Bulgaria region');
      }
    }

    // 3. Create publishable API key
    console.log('🔑 Creating publishable API key...');
    const keyRes = await fetch(`${MEDUSA_URL}/admin/publishable-api-keys`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'Storybox Web'
      })
    });

    let publishableKey;
    if (keyRes.ok) {
      const keyData = await keyRes.json();
      publishableKey = keyData.publishable_api_key.id;
      console.log(`✅ Publishable key created: ${publishableKey}\n`);
    }

    // 4. Get default sales channel
    console.log('📺 Getting sales channel...');
    const channelsRes = await fetch(`${MEDUSA_URL}/admin/sales-channels`, { headers });
    const channelsData = await channelsRes.json();
    const defaultChannel = channelsData.sales_channels[0];
    console.log(`✅ Using sales channel: ${defaultChannel.name} (ID: ${defaultChannel.id})\n`);

    // 5. Link publishable key to sales channel
    if (publishableKey) {
      console.log('🔗 Linking key to sales channel...');
      await fetch(`${MEDUSA_URL}/admin/publishable-api-keys/${publishableKey}/sales-channels/batch`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          add: [defaultChannel.id]
        })
      });
      console.log('✅ Key linked to sales channel\n');
    }

    // 6. Create sample product
    console.log('📦 Creating sample Bulgarian product...');
    const productRes = await fetch(`${MEDUSA_URL}/admin/products`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'Българска Бродирана Риза',
        description: 'Традиционна българска риза с ръчна бродерия. Изработена от 100% памук с народни мотиви.',
        is_giftcard: false,
        discountable: true,
        status: 'published',
        sales_channels: [{ id: defaultChannel.id }],
        variants: [
          {
            title: 'Размер S',
            sku: 'BGR-SHIRT-S',
            manage_inventory: true,
            allow_backorder: false,
            inventory_quantity: 10,
            prices: [
              {
                amount: 12000, // 120.00 BGN in smallest currency unit
                currency_code: 'bgn'
              }
            ]
          },
          {
            title: 'Размер M',
            sku: 'BGR-SHIRT-M',
            manage_inventory: true,
            allow_backorder: false,
            inventory_quantity: 15,
            prices: [
              {
                amount: 12000,
                currency_code: 'bgn'
              }
            ]
          }
        ]
      })
    });

    if (productRes.ok) {
      const productData = await productRes.json();
      console.log(`✅ Product created: ${productData.product.title} (ID: ${productData.product.id})\n`);
    } else {
      const error = await productRes.text();
      console.log(`⚠️  Product creation response: ${error}\n`);
    }

    console.log('🎉 Seeding completed successfully!');
    console.log(`\n📝 Add this to your .env file:`);
    console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableKey || 'check_admin_panel'}\n`);

  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    if (error.response) {
      console.error('Response:', await error.response.text());
    }
    process.exit(1);
  }
}

seedData();
