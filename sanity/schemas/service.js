export default {
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Service Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      description: 'Lucide icon name (e.g., "Paintbrush", "Scissors")',
    },
    {
      name: 'image',
      title: 'Service Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    },
    {
      name: 'fullDescription',
      title: 'Full Description',
      type: 'blockContent',
    },
    {
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'pricing',
      title: 'Pricing Information',
      type: 'object',
      fields: [
        {
          name: 'startingPrice',
          title: 'Starting Price',
          type: 'number',
        },
        {
          name: 'pricingNote',
          title: 'Pricing Note',
          type: 'string',
          description: 'e.g., "per item" or "contact for quote"',
        },
      ],
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
    },
  ],

  preview: {
    select: {
      title: 'title',
      media: 'image',
      order: 'order',
    },
    prepare(selection) {
      const { order } = selection
      return { ...selection, subtitle: order ? `Order: ${order}` : '' }
    },
  },

  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
}
