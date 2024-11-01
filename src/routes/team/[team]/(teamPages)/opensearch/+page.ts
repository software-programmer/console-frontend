import {
	OpenSearchOrderField,
	type OpenSearchOrderField$options,
	type OrderDirection$options
} from '$houdini';
import type { OpenSearchVariables } from './$houdini';

export const _OpenSearchVariables: OpenSearchVariables = ({ url }) => {
	const field = (url.searchParams.get('field') ||
		OpenSearchOrderField.NAME) as OpenSearchOrderField$options;
	const direction = (url.searchParams.get('direction') || 'ASC') as OrderDirection$options;

	// Date 30 days ago
	const from = new Date();
	from.setDate(from.getDate() - 30);

	// Date yesterday
	const to = new Date();
	to.setDate(to.getDate() - 1);

	return { orderBy: { field: field, direction: direction }, from, to };
};
