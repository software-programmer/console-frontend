import {
	JobOrderField,
	type JobOrder,
	type JobOrderField$options,
	type OrderDirection$options
} from '$houdini';
import type { JobsVariables } from './$houdini';

export const _JobsVariables: JobsVariables = ({ url }) => {
	const field = (url.searchParams.get('field') || JobOrderField.NAME) as JobOrderField$options;
	const direction = (url.searchParams.get('direction') || 'ASC') as OrderDirection$options;

	return { orderBy: { field: field, direction: direction } as JobOrder };
};
