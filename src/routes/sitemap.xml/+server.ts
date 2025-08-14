// src/routes/sitemap.xml/+server.ts
export async function GET() {
	// Bisa mengambil URL dinamis dari database/API
	const staticUrls = [
		{
			url: 'https://reporthat.vercel.app/',
			changefreq: 'daily',
			priority: '1.0',
			lastmod: new Date().toISOString()
		},
		{
			url: 'https://reporthat.vercel.app/about',
			changefreq: 'monthly',
			priority: '0.8',
			lastmod: new Date('2024-01-01').toISOString()
		}
	];

	// Contoh mengambil URL dinamis (misalnya dari blog posts)
	// const dynamicUrls = await getDynamicUrls();
	// const allUrls = [...staticUrls, ...dynamicUrls];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls
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
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600' // Cache selama 1 jam
		}
	});
}

// Fungsi helper untuk URL dinamis (opsional)
// async function getDynamicUrls() {
//   const posts = await fetchBlogPosts();
//   return posts.map(post => ({
//     url: `https://reporthat.vercel.app/blog/${post.slug}`,
//     changefreq: 'weekly',
//     priority: '0.6',
//     lastmod: post.updatedAt
//   }));
// }
