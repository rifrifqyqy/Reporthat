export async function GET() {
	const urls = [
		'https://reporthat.vercel.app/',
		'https://reporthat.vercel.app/about',
		'https://reporthat.vercel.app/contact'
	];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls
				.map(
					(url) => `
        <url>
          <loc>${url}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `
				)
				.join('')}
    </urlset>
  `;

	return new Response(sitemap.trim(), {
		headers: { 'Content-Type': 'application/xml' }
	});
}
