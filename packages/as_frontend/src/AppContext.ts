import Cookie from 'js-cookie';
import * as Preact from 'preact';
import { Interface as Int } from 'as_common/graph/';

export interface AppContextData {
	data: Partial<Int.Root>;
	mergeData(data: Partial<Int.Root>): void;
}

export const AppContext = Preact.createContext<AppContextData>({
	data: {}, mergeData: () => { throw 'Accessed default AppContext'; }});

export async function queryData(mergeData: (data: Partial<Int.Root>) => void, query: string) {
	const refreshArray = Array.isArray(query) ? query : [ query ];
	const res = await fetch('/admin/data/' + refreshArray.join('&'), { cache: 'no-cache' });
	if (res.status !== 200) {
		Cookie.remove('tkn');
		location.href = '/admin';
		return {};
	}
	else {
		mergeData(await res.json());
		return res;
	}
};
