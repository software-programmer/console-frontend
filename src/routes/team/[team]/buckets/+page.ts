import { BucketOrderField } from '$houdini';
import { urlToOrderDirection, urlToOrderField } from '$lib/components/OrderByMenu.svelte';
import { startOfMonth, subMonths } from 'date-fns';
import type { BucketsVariables } from './$houdini';

const rows = 25;

export const _BucketsVariables: BucketsVariables = ({ url }) => {
	const after = url.searchParams.get('after') || '';
	const before = url.searchParams.get('before') || '';

	return {
		orderBy: {
			field: urlToOrderField(BucketOrderField, BucketOrderField.NAME, url),
			direction: urlToOrderDirection(url)
		},
		...(before ? { before, last: rows } : { after, first: rows }),
		from: startOfMonth(subMonths(new Date(), 12)),
		to: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
	};
};
