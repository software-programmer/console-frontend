// TODO: Denne trengs vel ikke lenger? Kommenterer ut for å få npm run check ok.
/*import { error } from '@sveltejs/kit';
import type { AdminUsersVariables } from './$houdini';
export const _AdminUsersVariables: AdminUsersVariables = ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	if (!page || page < 1) {
		error(400, 'Bad pagenumber');
	}
	const limit = 50;
	const offset = (page - 1) * limit;

	return { limit, offset };
};*/
