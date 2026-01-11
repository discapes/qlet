<script>
	import { getStores, navigating, page, updated } from '$app/stores';
	import '../app.css';

	let site_url = $page.url.hostname;
</script>

<main class="flex flex-col justify-center h-screen items-center">
	<h1>qlet</h1>
	<pre class="inline-block">
Parses Quizlet and Otava Inne wordlists.
Use by adding the wordlist URL to the address, for example:

https://{site_url}/https://materiaalit.otava.fi/web/state-jurdgmztgazdamrc/61e1abdaf4480655aaa6b933
https://{site_url}/https://quizlet.com/367001089/nyckel-9-8-vad-hander-med-jorden-flash-cards
	</pre>
</main>
