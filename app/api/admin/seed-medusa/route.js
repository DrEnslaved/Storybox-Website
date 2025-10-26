import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';
    
    // First, authenticate as admin
    const authResponse = await fetch(`${MEDUSA_BACKEND_URL}/admin/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@storybox.bg',
        password: 'admin123456',
      }),
    });

    if (!authResponse.ok) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    const authData = await authResponse.json();
    const token = authData.token || authData.access_token;

    // Create Bulgaria region first
    console.log('Creating Bulgaria region...');
    const regionResponse = await fetch(`${MEDUSA_BACKEND_URL}/admin/regions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Bulgaria',
        currency_code: 'bgn',
        countries: ['bg'],
        payment_providers: [],
        fulfillment_providers: [],
        tax_rate: 20.0,
      }),
    });

    let regionId;
    if (regionResponse.ok) {
      const regionData = await regionResponse.json();
      regionId = regionData.region?.id;
      console.log('Region created:', regionId);
    } else {
      // Region might already exist, fetch it
      const regionsResponse = await fetch(`${MEDUSA_BACKEND_URL}/admin/regions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (regionsResponse.ok) {
        const regionsData = await regionsResponse.json();
        const bulgariaRegion = regionsData.regions?.find(r => r.currency_code === 'bgn');
        regionId = bulgariaRegion?.id || regionsData.regions?.[0]?.id;
      }
    }

    // Create sample product
    console.log('Creating sample product...');
    const productResponse = await fetch(`${MEDUSA_BACKEND_URL}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'Българска Бродирана Риза',
        handle: 'bulgarska-brodirana-riza',
        description: 'Традиционна българска риза с ръчна бродерия. Изработена от 100% памук с народни мотиви.',
        is_giftcard: false,
        discountable: true,
        status: 'published',
        options: [
          {
            title: 'Размер',
          }
        ],
        variants: [
          {
            title: 'S',
            sku: 'BGR-SHIRT-S',
            manage_inventory: true,
            inventory_quantity: 10,
            prices: [
              {
                amount: 12000, // 120 BGN in cents
                currency_code: 'bgn',
              }
            ],
            options: [
              {
                value: 'S'
              }
            ]
          },
          {
            title: 'M',
            sku: 'BGR-SHIRT-M',
            manage_inventory: true,
            inventory_quantity: 15,
            prices: [
              {
                amount: 12000,
                currency_code: 'bgn',
              }
            ],
            options: [
              {
                value: 'M'
              }
            ]
          },
          {
            title: 'L',
            sku: 'BGR-SHIRT-L',
            manage_inventory: true,
            inventory_quantity: 12,
            prices: [
              {
                amount: 12000,
                currency_code: 'bgn',
              }
            ],
            options: [
              {
                value: 'L'
              }
            ]
          },
          {
            title: 'XL',
            sku: 'BGR-SHIRT-XL',
            manage_inventory: true,
            inventory_quantity: 8,
            prices: [
              {
                amount: 12000,
                currency_code: 'bgn',
              }
            ],
            options: [
              {
                value: 'XL'
              }
            ]
          }
        ],
        weight: 300,
        metadata: {
          material: '100% памук',
          origin: 'България',
          category_bg: 'Традиционно облекло',
        },
      }),
    });

    if (!productResponse.ok) {
      const errorData = await productResponse.json();
      console.error('Product creation failed:', errorData);
      return NextResponse.json({ 
        error: 'Product creation failed',
        details: errorData 
      }, { status: productResponse.status });
    }

    const productData = await productResponse.json();
    
    return NextResponse.json({
      success: true,
      message: 'Sample product created successfully',
      region: regionId,
      product: productData.product,
    });

  } catch (error) {
    console.error('Error seeding Medusa:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}
