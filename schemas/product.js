// Sanity Schema Types

export const priceTier = {
  name: 'priceTier',
  title: 'Price Tier',
  type: 'object',
  fields: [
    {
      name: 'tierName',
      title: 'Tier Name',
      type: 'string',
      options: {
        list: [
          { title: 'Standard', value: 'standard' },
          { title: 'Premium', value: 'premium' },
          { title: 'VIP', value: 'vip' }
        ]
      }
    },
    {
      name: 'price',
      title: 'Price (BGN)',
      type: 'number'
    }
  ]
}

export const product = {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Машинна бродерия', value: 'embroidery' },
          { title: 'Сублимация', value: 'sublimation' },
          { title: 'Трансферен печат', value: 'transfer' },
          { title: 'Лазерно рязане', value: 'laser' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'priceTiers',
      title: 'Price Tiers',
      type: 'array',
      of: [{ type: 'priceTier' }],
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'sku',
      title: 'SKU',
      type: 'string'
    },
    {
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'minQuantity',
      title: 'Minimum Order Quantity',
      type: 'number',
      initialValue: 1
    },
    {
      name: 'maxQuantity',
      title: 'Maximum Order Quantity',
      type: 'number',
      initialValue: 5000
    },
    {
      name: 'features',
      title: 'Product Features',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'metaDescription',
      title: 'SEO Meta Description',
      type: 'text',
      description: 'For SEO purposes (max 160 characters)'
    },
    {
      name: 'metaKeywords',
      title: 'SEO Keywords',
      type: 'array',
      of: [{ type: 'string' }]
    }
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images.0',
      category: 'category'
    },
    prepare(selection) {
      const { title, media, category } = selection
      return {
        title,
        subtitle: category,
        media
      }
    }
  }
}