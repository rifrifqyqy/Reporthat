<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
</script>

<main class=" space-y-8">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Page>Report</Breadcrumb.Page>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>

	<section class="mt-8">Reporting Page</section>
</main>
