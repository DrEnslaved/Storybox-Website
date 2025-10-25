const axios = require('axios');

const MEDUSA_URL = 'http://localhost:9000';
const ADMIN_EMAIL = 'admin@storybox.bg';
const ADMIN_PASSWORD = 'Pandora2019+';

async function setupMedusaComplete() {
  try {
    // 1. Login as admin
    console.log('🔐 Logging in as admin...');
    const authResponse = await axios.post(`${MEDUSA_URL}/auth/user/emailpass`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    const token = authResponse.data.token;
    console.log('✅ Logged in successfully');

    // Set up axios with auth header
    const api = axios.create({
      baseURL: MEDUSA_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // 2. Get or create sales channel
    console.log('\n📦 Setting up sales channel...');
    let salesChannelId;
    try {
      const channelsResponse = await api.get('/admin/sales-channels');
      if (channelsResponse.data.sales_channels && channelsResponse.data.sales_channels.length > 0) {
        salesChannelId = channelsResponse.data.sales_channels[0].id;
        console.log('✅ Using existing sales channel:', salesChannelId);
      } else {
        const createChannelResponse = await api.post('/admin/sales-channels', {
          name: 'Web Storefront',
          description: 'Main e-commerce storefront'
        });
        salesChannelId = createChannelResponse.data.sales_channel.id;
        console.log('✅ Sales channel created:', salesChannelId);
      }
    } catch (error) {
      console.error('❌ Sales channel error:', error.response?.data || error.message);
      console.log('⚠️  Continuing without sales channel...');
    }

    // 3. Create products
    console.log('\n🛍️  Creating products...');
    
    const products = [
      {
        title: 'Брандирани тениски с бродерия',
        handle: 'brandirani-teniski-s-broderia',
        description: 'Висококачествени памучни тениски с машинна бродерия на лого или текст. Идеални за корпоративни събития, екипни облекла и промоционални кампании. Минимална поръчка: 10 броя.',
        status: 'published',
        sales_channels: salesChannelId ? [{ id: salesChannelId }] : undefined,
        options: [
          { title: 'Ниво', values: ['Standard', 'Premium', 'VIP'] }
        ],
        variants: [
          {
            title: 'Standard',
            sku: 'EMBR-TSHIRT-STD',
            manage_inventory: false,
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
            manage_inventory: false,
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
            manage_inventory: false,
            prices: [
              { amount: 2000, currency_code: 'bgn' }
            ],
            options: {
              'Ниво': 'VIP'
            }
          }
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800' }
        ]
      },
      {
        title: 'Сублимационен печат върху чаши',
        handle: 'sublimatsionen-pechat-varhu-chashi',
        description: 'Персонализирани керамични чаши с пълноцветен сублимационен печат. Устойчиво изображение, подходящо за миялна машина. Минимална поръчка: 20 броя.',
        status: 'published',
        sales_channels: salesChannelId ? [{ id: salesChannelId }] : undefined,
        options: [
          { title: 'Ниво', values: ['Standard', 'Premium', 'VIP'] }
        ],
        variants: [
          {
            title: 'Standard',
            sku: 'SUBL-MUG-STD',
            manage_inventory: false,
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
            manage_inventory: false,
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
            manage_inventory: false,
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
      },
      {
        title: 'Трансферен печат върху текстил',
        handle: 'transferen-pechat-varhu-textil',
        description: 'Висококачествен трансферен печат върху различни видове текстил. Подходящ за сложни дизайни и фотографски качества изображения.',
        status: 'published',
        sales_channels: salesChannelId ? [{ id: salesChannelId }] : undefined,
        options: [
          { title: 'Ниво', values: ['Standard', 'Premium', 'VIP'] }
        ],
        variants: [
          {
            title: 'Standard',
            sku: 'TRANS-TEXT-STD',
            manage_inventory: false,
            prices: [
              { amount: 1800, currency_code: 'bgn' }
            ],
            options: {
              'Ниво': 'Standard'
            }
          },
          {
            title: 'Premium',
            sku: 'TRANS-TEXT-PREM',
            manage_inventory: false,
            prices: [
              { amount: 1600, currency_code: 'bgn' }
            ],
            options: {
              'Ниво': 'Premium'
            }
          },
          {
            title: 'VIP',
            sku: 'TRANS-TEXT-VIP',
            manage_inventory: false,
            prices: [
              { amount: 1400, currency_code: 'bgn' }
            ],
            options: {
              'Ниво': 'VIP'
            }
          }
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800' }
        ]
      }
    ];

    let createdProducts = [];
    for (const product of products) {
      try {
        const productResponse = await api.post('/admin/products', product);
        const createdProduct = productResponse.data.product;
        createdProducts.push(createdProduct);
        console.log(`✅ Created: ${product.title}`);
        console.log(`   ID: ${createdProduct.id}`);
      } catch (error) {
        console.error(`❌ Error creating ${product.title}:`, error.response?.data?.message || error.message);
      }
    }

    console.log(`\n✅ Successfully created ${createdProducts.length} products!`);

    // 4. Try to get publishable API keys (might not be available in all versions)
    console.log('\n🔑 Checking for publishable API keys...');
    try {
      const keysResponse = await api.get('/admin/api-keys/publishable');
      if (keysResponse.data?.api_keys && keysResponse.data.api_keys.length > 0) {
        console.log('✅ Publishable API Key:', keysResponse.data.api_keys[0].token);
      } else {
        console.log('ℹ️  No publishable API keys found. You may need to create one via the admin dashboard.');
      }
    } catch (error) {
      console.log('ℹ️  Publishable API keys endpoint not available. Access products directly or create via admin UI.');
    }

    console.log('\n' + '='.repeat(80));
    console.log('✨ MEDUSA SETUP COMPLETE! ✨');
    console.log('='.repeat(80));
    console.log('\n📋 Access Information:');
    console.log(`   Medusa Admin: http://localhost:9000/app`);
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Sales Channel: ${salesChannelId || 'N/A'}`);
    console.log(`\n   Products Created: ${createdProducts.length}`);
    createdProducts.forEach(p => {
      console.log(`   - ${p.title} (${p.variants?.length || 0} variants)`);
    });
    console.log('\n' + '='.repeat(80));

  } catch (error) {
    console.error('❌ Fatal error during setup:', error.response?.data || error.message);
    process.exit(1);
  }
}

setupMedusaComplete();
