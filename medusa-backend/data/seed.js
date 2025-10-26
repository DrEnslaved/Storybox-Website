module.exports = async ({container}) => {
  const productModuleService = container.resolve("productModuleService");
  const regionModuleService = container.resolve("regionModuleService");
  const salesChannelModuleService = container.resolve("salesChannelModuleService");
  const stockLocationModuleService = container.resolve("stockLocationModuleService");
  const inventoryService = container.resolve("inventoryService");

  console.log("🇧🇬 Seeding Bulgarian e-commerce data...");

  try {
    // Create Bulgaria region with BGN currency
    console.log("Creating Bulgaria region...");
    const region = await regionModuleService.create({
      name: "Bulgaria",
      currency_code: "bgn",
      countries: ["bg"],
    });
    console.log(`✅ Region created: ${region.name}`);

    // Get default sales channel
    const salesChannels = await salesChannelModuleService.list();
    const defaultChannel = salesChannels[0];
    console.log(`✅ Found sales channel: ${defaultChannel.name}`);

    // Get default stock location
    const stockLocations = await stockLocationModuleService.list();
    const defaultLocation = stockLocations[0];
    console.log(`✅ Found stock location: ${defaultLocation.name}`);

    // Create a sample Bulgarian product
    console.log("Creating Bulgarian embroidery product...");
    const product = await productModuleService.create({
      title: "Българска Бродирана Риза",
      handle: "bulgarska-brodirana-riza",
      description: "Традиционна българска риза с ръчна бродерия. Изработена от 100% памук с народни мотиви.",
      is_giftcard: false,
      discountable: true,
      status: "published",
      options: [
        {
          title: "Размер",
          values: ["S", "M", "L", "XL"]
        }
      ],
      weight: 300,
      metadata: {
        material: "100% памук",
        origin: "България",
        category_bg: "Традиционно облекло",
      },
    });

    console.log(`✅ Product created: ${product.title}`);

    // Create variants
    const variantData = [
      { size: "S", sku: "BGR-SHIRT-S", qty: 10 },
      { size: "M", sku: "BGR-SHIRT-M", qty: 15 },
      { size: "L", sku: "BGR-SHIRT-L", qty: 12 },
      { size: "XL", sku: "BGR-SHIRT-XL", qty: 8 },
    ];

    for (const data of variantData) {
      const variant = await productModuleService.createVariants({
        product_id: product.id,
        title: data.size,
        sku: data.sku,
        manage_inventory: true,
        options: {
          Размер: data.size
        }
      });
      
      // Set price for variant
      await productModuleService.updateVariants(variant.id, {
        prices: [
          {
            amount: 12000, // 120 BGN in cents
            currency_code: "bgn",
            region_id: region.id
          }
        ]
      });

      console.log(`✅ Variant created: ${data.size} (${data.sku})`);
    }

    console.log("\n🎉 Seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log("   • Region: Bulgaria (BGN)");
    console.log("   • Product: Българска Бродирана Риза");
    console.log("   • Variants: 4 (S, M, L, XL)");
    console.log("   • Price: 120.00 BGN per item");

  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
};
