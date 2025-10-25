const axios = require('axios');

const MEDUSA_URL = 'http://localhost:9000';
const ADMIN_EMAIL = 'admin@storvbox.com';
const ADMIN_PASSWORD = 'admin123456';

async function setupMedusa() {
  try {
    // 1. Login as admin
    console.log('Logging in as admin...');
    const authResponse = await axios.post(`${MEDUSA_URL}/auth/user/emailpass`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    const token = authResponse.data.token;
    console.log('✓ Logged in successfully');

    // Set up axios with auth header
    const api = axios.create({
      baseURL: MEDUSA_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // 2. Create publishable API key
    console.log('\nCreating publishable API key...');
    let pubKey;
    try {
      const keyResponse = await api.post('/admin/publishable-api-keys', {
        title: 'Web Storefront'
      });
      pubKey = keyResponse.data.publishable_api_key.id;
      console.log('✓ Publishable API key created:', pubKey);
    } catch (error) {
      console.log('Note: Checking for existing API keys...');
      const keysResponse = await api.get('/admin/publishable-api-keys');
      pubKey = keysResponse.data.publishable_api_keys[0]?.id;
      if (pubKey) {
        console.log('✓ Using existing key:', pubKey);
      }
    }

    // 3. Create sales channel
    console.log('\nCreating sales channel...');
    let salesChannelId;
    try {
      const salesChannelResponse = await api.post('/admin/sales-channels', {
        name: 'Web Store',
        description: 'Main web storefront'
      });
      salesChannelId = salesChannelResponse.data.sales_channel.id;
      console.log('✓ Sales channel created:', salesChannelId);
    } catch (error) {
      console.log('Note: Checking for existing sales channels...');
      const channelsResponse = await api.get('/admin/sales-channels');
      salesChannelId = channelsResponse.data.sales_channels[0]?.id;
      if (salesChannelId) {
        console.log('✓ Using existing channel:', salesChannelId);
      }
    }

    // 4. Associate API key with sales channel
    if (pubKey && salesChannelId) {
      try {
        await api.post(`/admin/publishable-api-keys/${pubKey}/sales-channels`, {
          sales_channel_id: salesChannelId
        });
        console.log('✓ API key linked to sales channel');
      } catch (error) {
        console.log('Note: Link might already exist');
      }
    }

    // 5. Create products
    console.log('\nCreating products...');
    
    const products = [
      {
        title: 'Брандирани тениски с бродерия',
        handle: 'brandirani-teniski-s-broderia',
        description: 'Висококачествени памучни тениски с машинна бродерия на лого или текст. Идеални за корпоративни събития, екипни облекла и промоционални кампании.',
        is_giftcard: false,
        sales_channels: [{ id: salesChannelId }],
        options: [
          { title: 'Ниво', values: ['Standard', 'Premium', 'VIP'] }
        ],
        variants: [
          {
            title: 'Standard',
            sku: 'EMBR-TSHIRT-STD',
            prices: [
              { amount: 2500, currency_code: 'bgn' }
            ],
            options: {
              'Ниво': 'Standard'
            }
          },
          {
            title: 'Premium',
            sku: 'EMBR-TSHIRT-PREM',
            prices: [
              { amount: 2200, currency_code: 'bgn' }
            ],
            options: {
              'Ниво': 'Premium'
            }
          },
          {
            title: 'VIP',
            sku: 'EMBR-TSHIRT-VIP',
            prices: [
              { amount: 2000, currency_code: 'bgn' }
            ],
            options: {
              'Ниво': 'VIP'
            }
          }
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800' },
          { url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800' }
        ]
      },
      {
        title: 'Сублимационен печат върху чаши',
        handle: 'sublimatsionen-pechat-varhu-chashi',
        description: 'Персонализирани керамични чаши с пълноцветен сублимационен печат. Устойчиво изображение, подходящо за миялна машина.',
        is_giftcard: false,
        sales_channels: [{ id: salesChannelId }],
        options: [
          { title: 'Ниво', values: ['Standard', 'Premium', 'VIP'] }
        ],
        variants: [
          {
            title: 'Standard',
            sku: 'SUBL-MUG-STD',
            prices: [
              { amount: 1200, currency_code: 'bgn' }
            ],
            options: {
              'Ниво': 'Standard'
            }
          },
          {
            title: 'Premium',
            sku: 'SUBL-MUG-PREM',
            prices: [
              { amount: 1000, currency_code: 'bgn' }
            ],
            options: {
              'Ниво': 'Premium'
            }
          },
          {
            title: 'VIP',
            sku: 'SUBL-MUG-VIP',
            prices: [
              { amount: 900, currency_code: 'bgn' }
            ],
            options: {
              'Ниво': 'VIP'
            }
          }
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800' }
        ]
      }
    ];

    for (const product of products) {
      try {
        const productResponse = await api.post('/admin/products', product);
        console.log(`✓ Created product: ${product.title}`);
        console.log(`  ID: ${productResponse.data.product.id}`);
      } catch (error) {
        console.error(`✗ Error creating product ${product.title}:`, error.response?.data || error.message);
      }
    }

    console.log('\n✅ Setup completed successfully!');
    console.log('\n📋 Configuration:');
    console.log(`Medusa Admin: http://localhost:9000/app`);
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log(`\nPublishable API Key: ${pubKey}`);
    console.log(`Sales Channel ID: ${salesChannelId}`);
    console.log('\n⚠️  Save the publishable API key to your .env file:');
    console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${pubKey}`);

  } catch (error) {
    console.error('❌ Error during setup:', error.response?.data || error.message);
    process.exit(1);
  }
}

setupMedusa();
