export async function GET() {
	// Gunakan URL absolut dari request untuk memastikan domain yang benar
	const baseUrl = 'https://reporthat.vercel.app';

	const urls = [
		{
			url: `${baseUrl}/`,
			changefreq: 'daily',
			priority: '1.0',
			lastmod: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
		},
		{
			url: `${baseUrl}/about`,
			changefreq: 'monthly',
			priority: '0.8',
			lastmod: new Date().toISOString().split('T')[0]
		}
	];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(item) => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		status: 200,
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=3600, s-maxage=3600',
			'X-Robots-Tag': 'noindex' // Sitemap tidak perlu diindex
		}
	});
}

// Export untuk prerendering (opsional tapi direkomendasikan)
export const prerender = true;
