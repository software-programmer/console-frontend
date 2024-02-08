import type { TeamVulnerabilityMetrics$result } from '$houdini';
import type { EChartsOption } from 'echarts';

export function vulnerabilitiesTeamTransformLineChart(
	metrics: TeamVulnerabilityMetrics$result
): EChartsOption {
	console.log(metrics);
	const dates = new Array<Date>();

	for (let i = 0; i < metrics.team.vulnerabilityMetrics.data.length; i++) {
		dates.push(metrics.team.vulnerabilityMetrics.data[i].date);
	}

	const numberOfDays = dates.length;

	const highSeries = new Array<number>();
	const mediumSeries = new Array<number>();
	const lowSeries = new Array<number>();
	const unassignedSeries = new Array<number>();
	const criticalSeries = new Array<number>();
	const riskScoreSeries = new Array<number>();

	for (let i = 0; i < numberOfDays; i++) {
		highSeries.push(metrics.team.vulnerabilityMetrics.data[i].high);
		mediumSeries.push(metrics.team.vulnerabilityMetrics.data[i].medium);
		lowSeries.push(metrics.team.vulnerabilityMetrics.data[i].low);
		unassignedSeries.push(metrics.team.vulnerabilityMetrics.data[i].unassigned);
		criticalSeries.push(metrics.team.vulnerabilityMetrics.data[i].critical);
		riskScoreSeries.push(metrics.team.vulnerabilityMetrics.data[i].riskScore);
	}

	return {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'line'
			},
			valueFormatter: (value: number) => (value == null ? '-' : value)
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: dates.map((date) => {
				return date.toLocaleDateString('en-GB', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				});
			})
		},
		yAxis: [
			{
				name: 'Vulnerabilities',
				type: 'value'
			},
			{
				name: 'Risk score',
				type: 'value',
				inverse: false
			}
		],
		series: [
			{
				type: 'line',
				name: 'Critical',
				data: criticalSeries,
				showSymbol: false,
				color: '#f86c6b'
			},
			{
				type: 'line',
				name: 'High',
				data: highSeries,
				showSymbol: false,
				color: '#fd8b00'
			},
			{
				type: 'line',
				name: 'Medium',
				data: mediumSeries,
				showSymbol: false,
				color: '#ffc107'
			},
			{
				type: 'line',
				name: 'Low',
				data: lowSeries,
				showSymbol: false,
				color: '#4dbd74'
			},
			{
				type: 'line',
				name: 'Unassigned',
				data: unassignedSeries,
				showSymbol: false,
				color: '#777777'
			},
			{
				type: 'line',
				name: 'Risk score',
				data: riskScoreSeries,
				showSymbol: false,
				color: '#777777',
				yAxisIndex: 1
			}
		]
	} as EChartsOption;
}
