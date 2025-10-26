import fetch from 'node-fetch';

async function seedProduct() {
  const MEDUSA_URL = 'http://localhost:9000';
  
  console.log('🌱 Seeding Bulgarian product in Medusa...\n');

  try {
    // Authenticate as admin
    console.log('1️⃣ Authenticating...');
    const authResponse = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@storybox.bg',
        password: 'admin123456'
      })
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      throw new Error(`Auth failed: ${authResponse.status} - ${errorText}`);
    }

    const authData = await authResponse.json();
    const token = authData.token;
    console.log('   ✅ Authenticated\n');

    // Get regions
    console.log('2️⃣ Fetching regions...');
    const regionsResponse = await fetch(`${MEDUSA_URL}/admin/regions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const regionsData = await regionsResponse.json();
    let regionId = regionsData.regions?.find(r => r.currency_code === 'bgn')?.id;

    // Create Bulgaria region if doesn't exist
    if (!regionId) {
      console.log('   Creating Bulgaria region...');
      const createRegionResponse = await fetch(`${MEDUSA_URL}/admin/regions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: 'Bulgaria',
          currency_code: 'bgn',
          countries: ['bg'],
          payment_providers: [],
          fulfillment_providers: [],
          tax_rate: 20
        })
      });

      if (createRegionResponse.ok) {
        const regionData = await createRegionResponse.json();
        regionId = regionData.region.id;
        console.log(`   ✅ Region created: ${regionId}\n`);
      } else {
        const errorText = await createRegionResponse.text();
        console.log(`   ⚠️  Could not create region: ${errorText}`);
        // Use first available region
        regionId = regionsData.regions?.[0]?.id;
      }
    } else {
      console.log(`   ✅ Found Bulgaria region: ${regionId}\n`);
    }

    // Create product
    console.log('3️⃣ Creating product...');
    const productData = {
      title: 'Българска Бродирана Риза',
      handle: 'bulgarska-brodirana-riza',
      description: 'Традиционна българска риза с ръчна бродерия. Изработена от 100% памук с народни мотиви. Перфектна за специални поводи и културни събития.',
      is_giftcard: false,
      status: 'published',
      options: [
        {
          title: 'Размер'
        }
      ],
      variants: [
        {
          title: 'S',
          sku: 'BGR-SHIRT-S',
          manage_inventory: false,
          prices: [
            {
              amount: 12000, // 120 BGN in cents
              currency_code: 'bgn'
            }
          ],
          options: {
            'Размер': 'S'
          }
        },
        {
          title: 'M',
          sku: 'BGR-SHIRT-M',
          manage_inventory: false,
          prices: [
            {
              amount: 12000,
              currency_code: 'bgn'
            }
          ],
          options: {
            'Размер': 'M'
          }
        },
        {
          title: 'L',
          sku: 'BGR-SHIRT-L',
          manage_inventory: false,
          prices: [
            {
              amount: 12000,
              currency_code: 'bgn'
            }
          ],
          options: {
            'Размер': 'L'
          }
        },
        {
          title: 'XL',
          sku: 'BGR-SHIRT-XL',
          manage_inventory: false,
          prices: [
            {
              amount: 12000,
              currency_code: 'bgn'
            }
          ],
          options: {
            'Размер': 'XL'
          }
        }
      ],
      metadata: {
        material: '100% памук',
        origin: 'България',
        category_bg: 'Традиционно облекло'
      }
    };

    const createProductResponse = await fetch(`${MEDUSA_URL}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    if (!createProductResponse.ok) {
      const errorText = await createProductResponse.text();
      console.error(`   ❌ Failed to create product: ${createProductResponse.status}`);
      console.error(`   Error: ${errorText}`);
      throw new Error('Product creation failed');
    }

    const productResult = await createProductResponse.json();
    const product = productResult.product;

    console.log(`   ✅ Product created!\n`);
    console.log('📦 Product Details:');
    console.log(`   ID: ${product.id}`);
    console.log(`   Title: ${product.title}`);
    console.log(`   Handle: ${product.handle}`);
    console.log(`   Status: ${product.status}`);
    console.log(`   Variants: ${product.variants?.length || 0}`);
    
    if (product.variants) {
      console.log('\n   Variants:');
      product.variants.forEach(v => {
        const price = v.prices?.find(p => p.currency_code === 'bgn');
        console.log(`     • ${v.title} (${v.sku}) - ${price ? (price.amount / 100).toFixed(2) + ' BGN' : 'No price'}`);
      });
    }

    console.log('\n🎉 Product seeding complete!');
    console.log('\n✅ Next steps:');
    console.log('   1. Visit http://localhost:3000/shop to see the product');
    console.log('   2. Visit http://localhost:9000/app to manage products in Medusa Admin');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seedProduct();
