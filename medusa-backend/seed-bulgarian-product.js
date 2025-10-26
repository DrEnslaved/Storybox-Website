const { Medusa } = require("@medusajs/medusa-js");

const medusa = new Medusa({ baseUrl: "http://localhost:9000", maxRetries: 3 });

async function seedBulgarianProduct() {
  try {
    console.log("🇧🇬 Starting Bulgarian product seeding...");

    // Login as admin
    console.log("\n📧 Logging in as admin...");
    const auth = await medusa.admin.auth.getToken({
      email: "admin@storybox.bg",
      password: "admin123456",
    });

    if (!auth || !auth.access_token) {
      throw new Error("Failed to authenticate");
    }

    console.log("✅ Successfully logged in");
    medusa.admin.auth.setApiKey(auth.access_token);

    // Create or get Bulgaria region with BGN currency
    console.log("\n🌍 Creating Bulgaria region...");
    
    try {
      const region = await medusa.admin.regions.create({
        name: "Bulgaria",
        currency_code: "bgn",
        countries: ["bg"],
        payment_providers: ["pp_system_default"],
        fulfillment_providers: ["fulfillment-manual"],
        tax_rate: 20.0, // 20% VAT in Bulgaria
      });
      console.log(`✅ Region created: ${region.region.name} (${region.region.currency_code.toUpperCase()})`);
    } catch (error) {
      console.log("ℹ️  Region might already exist");
    }

    // Create a sample Bulgarian product
    console.log("\n📦 Creating sample Bulgarian embroidery product...");
    
    const product = await medusa.admin.products.create({
      title: "Българска Бродирана Риза",
      handle: "bulgarska-brodirana-riza",
      description: "Традиционна българска риза с ръчна бродерия. Изработена от 100% памук с народни мотиви.",
      is_giftcard: false,
      discountable: true,
      options: [
        {
          title: "Размер",
          values: ["S", "M", "L", "XL"]
        }
      ],
      variants: [
        {
          title: "S",
          sku: "BGR-SHIRT-S",
          inventory_quantity: 10,
          manage_inventory: true,
          prices: [
            {
              amount: 12000, // 120 BGN in cents
              currency_code: "bgn",
            }
          ],
          options: [
            {
              value: "S"
            }
          ]
        },
        {
          title: "M",
          sku: "BGR-SHIRT-M",
          inventory_quantity: 15,
          manage_inventory: true,
          prices: [
            {
              amount: 12000, // 120 BGN
              currency_code: "bgn",
            }
          ],
          options: [
            {
              value: "M"
            }
          ]
        },
        {
          title: "L",
          sku: "BGR-SHIRT-L",
          inventory_quantity: 12,
          manage_inventory: true,
          prices: [
            {
              amount: 12000, // 120 BGN
              currency_code: "bgn",
            }
          ],
          options: [
            {
              value: "L"
            }
          ]
        },
        {
          title: "XL",
          sku: "BGR-SHIRT-XL",
          inventory_quantity: 8,
          manage_inventory: true,
          prices: [
            {
              amount: 12000, // 120 BGN
              currency_code: "bgn",
            }
          ],
          options: [
            {
              value: "XL"
            }
          ]
        }
      ],
      weight: 300,
      metadata: {
        material: "100% памук",
        origin: "България",
        category_bg: "Традиционно облекло",
      },
      status: "published",
    });

    console.log(`✅ Product created: ${product.product.title}`);
    console.log(`   ID: ${product.product.id}`);
    console.log(`   Handle: ${product.product.handle}`);
    console.log(`   Variants: ${product.product.variants.length}`);

    console.log("\n🎉 Seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log("   • Region: Bulgaria (BGN)");
    console.log("   • Product: Българска Бродирана Риза");
    console.log("   • Variants: 4 (S, M, L, XL)");
    console.log("   • Price: 120.00 BGN per item");
    console.log("\n🔗 Access Medusa Admin: http://localhost:9000/app");
    console.log("   Email: admin@storybox.bg");
    console.log("   Password: admin123456");

  } catch (error) {
    console.error("\n❌ Error during seeding:", error.message);
    if (error.response) {
      console.error("Response data:", JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

seedBulgarianProduct();
