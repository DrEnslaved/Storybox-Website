export default {
  name: 'project',
  title: 'Portfolio Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Project Title',
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
      name: 'client',
      title: 'Client Name',
      type: 'string',
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    },
    {
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    },
    {
      name: 'services',
      title: 'Services Provided',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'completedAt',
      title: 'Completion Date',
      type: 'date',
    },
    {
      name: 'description',
      title: 'Project Description',
      type: 'blockContent',
    },
    {
      name: 'challenge',
      title: 'The Challenge',
      type: 'text',
      rows: 4,
    },
    {
      name: 'solution',
      title: 'Our Solution',
      type: 'text',
      rows: 4,
    },
    {
      name: 'results',
      title: 'Results',
      type: 'text',
      rows: 4,
    },
    {
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      description: 'Display this project prominently',
      initialValue: false,
    },
    {
      name: 'testimonial',
      title: 'Client Testimonial',
      type: 'object',
      fields: [
        {
          name: 'quote',
          title: 'Quote',
          type: 'text',
          rows: 3,
        },
        {
          name: 'author',
          title: 'Author Name',
          type: 'string',
        },
        {
          name: 'position',
          title: 'Author Position',
          type: 'string',
        },
      ],
    },
  ],

  preview: {
    select: {
      title: 'title',
      client: 'client',
      media: 'mainImage',
    },
    prepare(selection) {
      const { client } = selection
      return { ...selection, subtitle: client && `Client: ${client}` }
    },
  },
}
