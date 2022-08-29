import { OTAVA_COOKIE, OTAVA_REST_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async ({ params }) => {
	let list;
	if (params.url.includes('quizlet')) {
		list = await getQuizlet(params.url);
	} else if (params.url.includes('otava')) {
		list = await getOtava(params.url);
	}

	return {
		list
	};
};

function getStrings(html: string) {
	return html
		.replace(/<[^>]+>/g, '\n')
		.split('\n')
		.filter((f) => f);
}

async function getOtava(url: string) {
	const res = await legitFetchOtava(url).then((res) => res.text());
	const str1 = res.slice(res.indexOf('var storedSettings = ') + 'var storedSettings = '.length);
	const str2 = str1.slice(0, str1.indexOf(';\n'));

	const o = JSON.parse(Array.from(JSON.parse(str2).settings).join(''));
	return o.task.pages[0].columns[0].containers[1].rows.map(otMap);
	function otMap(s: any) {
		let svcol = 0;
		let ficol = 1;
		if (s.columns[ficol].content.medias[0].content.text.startsWith('<p>')) {
			ficol = 0;
			svcol = 1;
		}
		let sv = s.columns[svcol].content.medias[0].content.text;
		sv = sv
			.replaceAll(/<\/?strong>|<\/?p>|<\/?em>/g, '')
			.replaceAll('<br>', '\n')
			.replaceAll('&nbsp;', ' ');
		if (sv.indexOf('[') != -1) sv = sv.slice(0, sv.indexOf('[') - 1);
		return {
			sv,
			fi: s.columns[ficol].content.medias[0].content.text
		};
	}
}

async function getQuizlet(url: string) {
	const rawText = await legitFetchQuizlet(url + '/').then((res) => res.text());
	const t1 = rawText.slice(
		rawText.indexOf(`<div class="SetPageTerms-termsList">`),
		rawText.indexOf(`<div class="SetPage-setLinksWrapper">`)
	);
	let list: Array<any> = [];
	const strings = getStrings(t1);
	for (let i = 0; i < strings.length; i += 2) {
		list = [...list, { sv: strings[i], fi: strings[i + 1] }];
	}
	return list;
}

function legitFetchOtava(url: string) {
	const page = url.slice(url.lastIndexOf('/') + 1);
	return fetch(
		`https://materiaalit.otava.fi/o/library-file-type-action/render?page=${page}${OTAVA_REST_URL}`,
		{
			headers: {
				accept: 'text/html, */*; q=0.01',
				'accept-language': 'fi-FI,fi;q=0.9,en-US;q=0.8,en;q=0.7',
				'cache-control': 'no-cache',
				pragma: 'no-cache',
				'sec-ch-ua': '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"Windows"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin',
				'x-requested-with': 'XMLHttpRequest',
				cookie: OTAVA_COOKIE,
				Referer: 'https://materiaalit.otava.fi/web/state-jurdgmztgazdamrc/61e1abdaf4480655aaa6b923',
				'Referrer-Policy': 'strict-origin-when-cross-origin'
			},
			body: null,
			method: 'GET'
		}
	);
}

function legitFetchQuizlet(url: string) {
	return fetch(url, {
		headers: {
			accept:
				'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
			'accept-language': 'fi-FI,fi;q=0.9,en-US;q=0.8,en;q=0.7',
			'cache-control': 'no-cache',
			pragma: 'no-cache',
			'sec-ch-ua': '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"Windows"',
			'sec-fetch-dest': 'document',
			'sec-fetch-mode': 'navigate',
			'sec-fetch-site': 'none',
			'sec-fetch-user': '?1',
			'upgrade-insecure-requests': '1'
		},
		referrerPolicy: 'strict-origin-when-cross-origin',
		body: null,
		method: 'GET',
		mode: 'cors',
		credentials: 'omit'
	});
}
