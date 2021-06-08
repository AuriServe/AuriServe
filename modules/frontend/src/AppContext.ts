import Cookie from 'js-cookie';
import * as Preact from 'preact';
import { Root as Data } from 'common/graph/type';

export interface AppContextData {
	data: Partial<Data>;
	mergeData(data: Partial<Data>): void;
}

export const AppContext = Preact.createContext<AppContextData>({
	data: {}, mergeData: () => { throw 'Accessed default AppContext'; }});

export async function queryData(mergeData: (data: Partial<Data>) => void, query: string) {
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
