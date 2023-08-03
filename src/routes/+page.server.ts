import { API_SECRET } from '$env/static/private';
import { PUBLIC_NOTION_API } from '$env/static/public';
import { addDays, isSameDay, addHours } from 'date-fns';

interface IDatabaseResult {
	object: string;
	id: string;
	created_time: string;
	last_edited_time: string;
	created_by: {
		object: string;
		id: string;
	};
	url: string;
}

interface IChart {
	date: Date;
	value: number;
}

interface IDatabaseSearch {
	object: string;
	results: Array<IDatabaseResult>;
	has_more: boolean;
}

const getDatabaseNamedStories = async (): Promise<IDatabaseResult | undefined> => {
	let result: IDatabaseSearch = await (
		await fetch(PUBLIC_NOTION_API + 'search', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + API_SECRET,
				'Notion-Version': '2022-06-28'
			},
			body: JSON.stringify({
				query: 'stories',
				sort: 'ascending'
			})
		})
	).json();
	return result.results.find((r) => r.object === 'database');
};

const getDatabaseData = async (databaseId: string) => {
	let results = await (
		await fetch(PUBLIC_NOTION_API + 'databases/' + databaseId + '/query', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + API_SECRET,
				'Notion-Version': '2022-06-28'
			}
		})
	).json();
	return results;
};

export type ListType = { peso: number; Finish: Date | null; tag: string };

const getChartData = (data: {
	list: Array<ListType>;
	startDate: string | null;
	finishDate: string | null;
	sum: number;
}) => {
	let dates: Array<IChart> = [];
	let actualDate = addHours(new Date(data.startDate!), 12);
	let finishDate = addHours(new Date(data.finishDate!), 12);
	let previousValue = data.sum;
	while (!isSameDay(actualDate, addDays(finishDate, 1))) {
		let actualDateStories = data.list.filter((it) => {
			return isSameDay(addHours(new Date(it.Finish!), 12), actualDate);
		});
		let sumOfActualDateStoriesPoints = actualDateStories.reduce(
			(previousSum, a) => previousSum + a.peso,
			0
		);
		previousValue -= sumOfActualDateStoriesPoints;
		dates.push({ date: actualDate, value: previousValue });
		actualDate = addDays(actualDate, 1);
	}
	return dates;
};

export const load = async ({ url }) => {
	let finishDate = url.searchParams.get('finish');
	let startDate = url.searchParams.get('start');
	let response;
	let database = await getDatabaseNamedStories();
	if (database) response = await getDatabaseData(database?.id);
	else throw new Error('Não foi possível encontrar o banco de dados.');
	let list: Array<ListType> = response.results.map((r: any) => {
		return {
			peso: r.properties.Peso.number,
			Finish: r.properties.Finish.date ? r.properties.Finish.date.start : null,
			tag: r.properties.Tags.multi_select[0].name
		};
	});
	let describe = {
		list,
		sum: list.reduce((partial: number, a: { peso: number }) => partial + a.peso, 0),
		startDate,
		finishDate
	};
	const res = getChartData(describe);
	console.log(res);
	return { data: res };
};
