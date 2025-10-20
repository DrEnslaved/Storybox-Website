import { Metadata } from 'next'

export const siteConfig = {
  name: 'STORVBOX',
  description: 'Професионални услуги по машинна бродерия, сублимация, трансферен печат и лазерно рязане в София, България',
  url: 'https://headless-bizsite.preview.emergentagent.com',
  locale: 'bg_BG',
  location: {
    city: 'София',
    country: 'България',
    address: 'гр. Стралджа 27, ж.к. Горубляне, 1138 София',
    phone: '+359 898 973 000',
    email: 'office@storvbox.bg'
  },
  social: {
    facebook: '#',
    instagram: '#'
  }
}

export const defaultMetadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'STORVBOX - Машинна Бродерия и Текстилен Печат | София, България',
    template: '%s | STORVBOX'
  },
  description: siteConfig.description,
  keywords: [
    'машинна бродерия софия',
    'бродерия българия',
    'сублимация печат софия',
    'трансферен печат',
    'лазерно рязане',
    'корпоративни облекла софия',
    'промоционални продукти българия',
    'брандиране текстил софия',
    'machine embroidery sofia',
    'embroidery bulgaria',
    'promotional products sofia'
  ],
  authors: [{ name: 'STORVBOX' }],
  creator: 'STORVBOX',
  publisher: 'STORVBOX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'bg_BG',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: 'STORVBOX - Машинна Бродерия | София, България',
    description: siteConfig.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'STORVBOX - Машинна Бродерия'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STORVBOX - Машинна Бродерия | София, България',
    description: siteConfig.description,
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
}

export function generatePageMetadata({
  title,
  description,
  path = '',
  keywords = [],
  images = []
}) {
  return {
    title,
    description,
    keywords: [...defaultMetadata.keywords, ...keywords],
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      url: `${siteConfig.url}${path}`,
      images: images.length > 0 ? images : defaultMetadata.openGraph.images
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
      images: images.length > 0 ? images : defaultMetadata.twitter.images
    },
    alternates: {
      canonical: `${siteConfig.url}${path}`,
    },
  }
}