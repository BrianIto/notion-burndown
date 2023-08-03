<script lang="ts">
	import * as d3 from 'd3';
	import { setHours, differenceInDays } from 'date-fns';
	import { onMount } from 'svelte';
	export let data;

	let height = 700;

	var localized = d3.timeFormatDefaultLocale({
		dateTime: '%d/%m/%Y %H:%M:%S',
		date: '%d/%m/%Y',
		time: '%H:%M:%S',
		periods: ['AM', 'PM'],
		days: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
		shortDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
		months: [
			'Janeiro',
			'Fevereiro',
			'Março',
			'Abril',
			'Maio',
			'Junho',
			'Julho',
			'Agosto',
			'Setembro',
			'Outubro',
			'Novembro',
			'Dezembro'
		],
		shortMonths: [
			'Jan',
			'Fev',
			'Mar',
			'Abr',
			'Mai',
			'Jun',
			'Jul',
			'Ago',
			'Set',
			'Out',
			'Nov',
			'Dez'
		]
	});

	onMount(() => {
		//Cria escalas
		data.data = data.data.map((v) => ({ ...v, date: new Date(v.date.setHours(0)) }));
		let [minDate, maxDate] = d3.extent(data.data, (d) => d.date);
		const x = d3.scaleTime([minDate!, maxDate!], [50, 2220]);
		const y = d3.scaleLinear([d3.max(data.data, (d) => d.value), 0], [0, height - 79]);

		// Cria o parâmetro de linha
		const line = d3
			.line()
			.x((d) => x(d.date))
			.y((d) => y(d.value));

		// Cria o container
		const svg = d3
			.select('#burndown')
			.append('svg')
			.attr('viewBox', '0 0 2260 ' + height)
			.attr('width', '100%')
			.attr('height', height)
			.attr('style', 'height: auto; max-width: 100%; height: intrisic; background-color: #FFFFFF');

		// Cria os ticks
		let axis = svg
			.append('g')
			.attr('class', 'axis')
			.attr('transform', `translate(0, ${height - 80})`) // differenceInDays(maxDate!, minDate!)
			.call(d3.axisBottom(x).ticks(d3.timeDay.every(1), localized.format('%d %b')));
		axis.attr('font-size', '30px');
		axis.selectAll('.tick text').attr('dy', '2.2rem').style('transform', 'rotate(-25deg) translateX(-45px)');
		svg
			.append('g')
			.attr('transform', `translate(50, -2)`)
			.call(d3.axisLeft(y).ticks(5))
			.attr('font-size', '25px');

		//Adiciona a linha
		svg
			.append('path')
			.attr('fill', 'none')
			.attr('stroke', 'red')
			.attr('stroke-width', 6)
			.attr('d', line(data.data));

		svg
			.append('path')
			.attr('fill', 'none')
			.attr('stroke', 'rgba(0, 0, 0, 0.1)')
			.attr('stroke-width', 4)
			.attr(
				'd',
				line([
					{ date: minDate, value: d3.max(data.data, (d) => d.value) },
					{ date: maxDate, value: 0 }
				])
			);
	});
</script>

<div id="burndown" />

<style>
</style>
