import { Buffer } from 'node:buffer';
import process from 'node:process';
import { got } from 'got';
import type {
	CamelcasedWakatimeStatsResponse,
	WakatimeData,
} from '~/types/wakatime';

export async function getWakatimeData(): Promise<WakatimeData> {
	console.info('Retrieving Wakatime stats...');

	const response = await got.get(
		'https://wakatime.com/api/v1/users/leonzalion/stats/last_7_days',
		{
			headers: {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				Authorization: `Basic ${Buffer.from(
					process.env.WAKATIME_API_KEY
				).toString('base64')}`,
			},
		}
	);

	const result = JSON.parse(response.body) as CamelcasedWakatimeStatsResponse;

	const wakatimeData: WakatimeData = {
		dailyAverage: result.data.dailyAverage,
		totalSeconds: result.data.totalSeconds,
		languages: result.data.languages.map(({ name, totalSeconds }) => ({
			name,
			totalSeconds,
		})),
		projects: result.data.projects.map(({ name, totalSeconds }) => ({
			name,
			totalSeconds,
		})),
	};

	return wakatimeData;
}
