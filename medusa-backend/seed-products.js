const axios = require('axios');

const MEDUSA_URL = 'http://localhost:9000';
const ADMIN_EMAIL = 'admin@storvbox.com';
const ADMIN_PASSWORD = 'admin123456';

async function seedMedusaProducts() {
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

    // 2. Create a region (Bulgaria/BGN)
    console.log('\nCreating region...');
    let regionId;
    try {
      const regionResponse = await api.post('/admin/regions', {
        name: 'Bulgaria',
        currency_code: 'bgn',
        countries: ['bg'],
        payment_providers: [],
        fulfillment_providers: []
      });
      regionId = regionResponse.data.region.id;
      console.log('✓ Region created:', regionId);
    } catch (error) {
      console.log('Note: Region might already exist');
      // Get existing region
      const regionsResponse = await api.get('/admin/regions');
      regionId = regionsResponse.data.regions[0]?.id;
    }

    // 3. Create sample products
    console.log('\nCreating products...');
    
    const products = [
      {
        title: 'Брандирани тениски с бродерия',
        handle: 'brandirani-teniski-s-broderia',
        description: 'Висококачествени памучни тениски с машинна бродерия на лого или текст. Идеални за корпоративни събития, екипни облекла и промоционални кампании.',
        is_giftcard: false,
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

    console.log('\n✓ Seeding completed successfully!');
    console.log('\nMedusa Admin: http://localhost:9000/app');
    console.log('Email: admin@storvbox.com');
    console.log('Password: admin123456');

  } catch (error) {
    console.error('Error during seeding:', error.response?.data || error.message);
    process.exit(1);
  }
}

seedMedusaProducts();
