import { visualizationColors } from '$lib/visualizationColors';
import type { EChartsOption } from 'echarts';
import type { OptionDataValue } from 'echarts/types/src/util/types.js';

export function euroValueFormatter(
	value?: number,
	{ maximumFractionDigits = 2 }: Intl.NumberFormatOptions = {}
): string {
	if (value === undefined) {
		return '';
	}

	return value.toLocaleString('en', {
		style: 'currency',
		currency: 'EUR',
		maximumFractionDigits,
		maximumSignificantDigits: 2,
		roundingPriority: 'morePrecision'
	});
}

export function getMinToDate(from: string) {
	const fromDate = new Date(from);
	fromDate.setDate(fromDate.getDate() + 1);
	return fromDate.toISOString().split('T')[0];
}

export function getMaxFromDate(to: string) {
	const toDate = new Date(to);
	toDate.setDate(toDate.getDate() - 1);
	return toDate.toISOString().split('T')[0];
}

export type DailCostType = {
	readonly series: {
		readonly date: Date;
		readonly services: {
			readonly cost: number;
			readonly service: string;
		}[];
		readonly sum: number;
	}[];
};

export function costTransformStackedColumnChart(
	from: Date,
	to: Date,
	data: DailCostType
): EChartsOption {
	const dates: string[] = [];
	const seriesData: { [service: string]: [number, number][] } = {};
	const allServices = new Set<string>();

	// First pass to identify all possible services
	data.series.forEach((entry) => {
		entry.services.forEach((service) => {
			allServices.add(service.service);
		});
	});

	// Second pass to build the series data
	data.series.forEach((entry) => {
		const entryDate = new Date(entry.date);

		// Check if the entry date is within the provided range
		if (entryDate >= from && entryDate <= to) {
			dates.push(entryDate.toISOString().split('T')[0]); // Format date as YYYY-MM-DD

			if (entry.services.length === 0) {
				// No services for this day, add 0 for all services
				allServices.forEach((service) => {
					if (!seriesData[service]) {
						seriesData[service] = [];
					}
					seriesData[service].push([entryDate.getTime(), 0]);
				});
			} else {
				// Process each service for this day
				entry.services.forEach((service) => {
					if (!seriesData[service.service]) {
						seriesData[service.service] = [];
					}
					seriesData[service.service].push([entryDate.getTime(), service.cost]);
				});

				// Add 0 for missing services on this day
				allServices.forEach((service) => {
					if (!entry.services.some((s) => s.service === service)) {
						if (!seriesData[service]) {
							seriesData[service] = [];
						}
						seriesData[service].push([entryDate.getTime(), 0]);
					}
				});
			}
		}
	});

	// Prepare the series for ECharts
	const series = Array.from(allServices).map((serviceName) => ({
		name: serviceName,
		type: 'line',
		stack: 'Cost',
		areaStyle: {
			opacity: 1
		},
		showSymbol: false,
		data: seriesData[serviceName]
	}));

	// Return the ECharts option object
	return {
		animation: false,
		title:
			series.length === 0
				? {
						text: 'No data',
						left: 'center',
						top: 'center',
						textStyle: {
							color: '#aaa'
						}
					}
				: {},
		tooltip: {
			trigger: series.length > 10 ? 'item' : 'axis',
			axisPointer: {
				type: 'shadow'
			},
			valueFormatter(value: OptionDataValue[]) {
				return euroValueFormatter(value[1] as number);
			}
		},
		color: visualizationColors,
		legend: {
			selector: [{ title: 'Inverse selection', type: 'inverse' }],
			data: Array.from(allServices)
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [
			{
				type: 'time',
				boundaryGap: false
			}
		],
		yAxis: [
			{
				type: 'value',
				axisLabel: {
					formatter: (value: number) => euroValueFormatter(value)
				}
			}
		],
		series
	} as EChartsOption;
}

export type TeamCostEnvType = {
	readonly date: Date;
	readonly sum: number;
	readonly workloads: {
		readonly cost: number;
		readonly workloadName: string;
	}[];
}[];

export function costTransformColumnChartTeamCostEnv(data: TeamCostEnvType) {
	const dates = data.map((entry) => entry.date.toISOString().split('T')[0]);

	const workloadNames = new Set<string>();
	data.forEach((entry) => {
		entry.workloads.forEach((workload) => {
			if (workload.workloadName !== '') {
				workloadNames.add(workload.workloadName);
			}
		});
	});

	return {
		title: {},
		legend: {
			bottom: 0,
			width: '90%',
			selector: [
				{
					title: 'Inverse selection',
					type: 'inverse'
				}
			]
		},

		tooltip: {
			trigger: data[0].workloads.length > 10 ? 'item' : 'axis',
			axisPointer: {
				type: 'shadow'
			},
			valueFormatter(value: number) {
				return euroValueFormatter(value);
			}
		},
		color: ['#3386E0', '#005B82', '#C77300', '#368DA8', '#33AA5F', '#8269A2'].reverse(),

		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [
			{
				type: 'category',
				data: dates,
				boundaryGap: false
			}
		],
		yAxis: [
			{
				type: 'value',
				axisLabel: {
					formatter: (value: number) => euroValueFormatter(value)
				}
			}
		],
		series: Array.from(workloadNames).map((workloadName) => ({
			name: workloadName,
			type: 'line',
			emphasis: {
				focus: 'series'
			},
			data: data.map((dateEntry) => {
				const workload = dateEntry.workloads.find((w) => w.workloadName === workloadName);
				return workload?.cost || 0;
			})
		}))
	} as EChartsOption;
}

export function costTransformColumnChartTeamEnvironmentApplicationsCost(
	series: {
		name: string | undefined;
		data: (number | undefined)[][];
	}[]
) {
	return {
		animation: false,
		title: {},
		legend: {
			// bottom: 0,
			width: '90%',
			selector: [
				{
					title: 'Inverse selection',
					type: 'inverse'
				}
			]
		},

		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			},
			valueFormatter(value: OptionDataValue[]) {
				return euroValueFormatter(value[1] as number);
			}
		},
		color: visualizationColors,

		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [
			{
				type: 'time',
				boundaryGap: false
			}
		],
		yAxis: [
			{
				type: 'value',
				axisLabel: {
					formatter: (value: number) => euroValueFormatter(value)
				}
			}
		],
		series: series.map(({ name, data }) => ({
			name,
			type: 'line',
			showSymbol: false,
			data
		}))
	} as EChartsOption;
}
