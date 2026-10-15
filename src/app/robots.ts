import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { SITE_URL } from '@/lib/seo';

export default async function robots(): Promise<MetadataRoute.Robots> {
  let host = '';
  try {
    const headersList = await headers();
    host = headersList.get('host') || '';
  } catch {}

  // Explicitly disallow crawling on any Vercel staging or default subdomain
  if (host.includes('vercel.app')) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  // Canonical production domain: allow full indexing of public elevator services
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
