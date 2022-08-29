import { OTAVA_COOKIE, OTAVA_REST_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const prerender = false;

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
			'upgrade-insecure-requests': '1',
			cookie:
				'set_num_visits_per_set=3; qi5=c4founvagz52%3Ac9XGah-h.jNjnxEJorsV; fs=rhdjey; akv=%7B%7D; qtkn=VnaGK95fMpvfXCSU4Y7PpS; app_session_id=1de032a7-9dbc-4740-9aed-afd846725321; __cf_bm=YgA902I7qPOlzDbFwg9BAEAk7fVn_0oJZgSmlLZSPKI-1661789082-0-Af11n9oKAsnnb3uwVxkcRCsB1ZIODZJXfKXGFFhBQWHuPaJK+I4Va/laQNNWqUe4oy5YIsMdqiVh84bg218afqQ=; __cfruid=ca3924ccf585cc743f460498514545c029e15ee7-1661789082; _cfuvid=3MdmTDCUNrVcjPnGAzqpgCbwqfuy7G8pjZCyIpofJAk-1661789082259-0-604800000; qmeasure__persistence=%7B%2228%22%3A%2200001000%22%2C%2227%22%3A%2200000001%22%2C%2210%22%3A%2200000001%22%2C%2229%22%3A%2200100000%22%7D; session_landing_page=Sets%2Fshow; _gcl_au=1.1.93397992.1661789086; hide-fb-button=0; afUserId=a9fa1863-a31a-457d-bc9b-37b42e0dd155-p; AF_SYNC=1661789087772; _lr_geo_location=FI; OptanonAlertBoxClosed=2022-08-29T16:04:56.041Z; eupubconsent-v2=CPedmkgPedmkgAcABBENCeCgAP_AAH_AACiQI9tf_X__b2_j-_5_f_t0eY1P9_7__-0zjhfdl-8N3f_X_L8X52M7vF36pq4KuR4Eu3LBIQdlHOHcTUmw6okVrzPsbk2cr7NKJ7PEmnMbOydYGH9_n1_z-ZKY7_____7z_v-v___3____7-3f3__p_3_-__e_V_99zfn9_____9vP___9v-_9__________3_74I9gEmGrcQBdmWODNtGEUCIEYVhIdQKACigGFogMIHVwU7K4CfWELABAKEJwIgQ4gowYBAAIJAEhEQEgR4IBEARAIAAQAKgEIAGNgEFgBYGAQACgGhYoxQBCBIQZEBEUpgQFSJBQb2VCCUHehphCHWeAFBo_4qEBGsgYrAyEhYOQ4IkBLxZIHmKN8gBGCFAKJUIAAAA.f_gAD_gAAAAA; embedded-consent=Mon, 29 Aug 2022 16:04:56 GMT; _ga=GA1.2.2077994941.1661789096; _gid=GA1.2.1716608193.1661789097; _gat_UA-1203987-1=1; __gads=ID=5b529f049eb1efd3:T=1661789097:S=ALNI_MYjkGSUMvNWrFiVckzqz2B58hHrag; _fbp=fb.1.1661789097684.1405997038; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Aug+29+2022+19%3A05%3A10+GMT%2B0300+(Eastern+European+Summer+Time)&version=6.34.0&isIABGlobal=false&hosts=&consentId=072c67dd-3359-4b60-8d7b-c261e02a281c&interactionCount=2&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0004%3A1%2CN01%3A1%2CSTACK42%3A1&geolocation=FI%3B19&AwaitingReconsent=false'
		},
		referrerPolicy: 'strict-origin-when-cross-origin',
		body: null,
		method: 'GET'
	});
}
