const Forms = require('./models/forms');

const form = JSON.stringify({
	name: 'Ехокардіологічне обстеження',
	count: 50,
	blocks: [
		{
			name: 'Лівий шлуночок - порожнина',
			inputs: [
				{
					type: 'input',
					prelabel: 'ВТЛШ:',
				},
				{
					type: 'input',
					prelabel: 'КДР:',
					afterlabel: 'см',
				},
				{
					type: 'input',
					prelabel: 'КСР:',
					afterlabel: 'см',
				},
				{
					type: 'input',
					prelabel: 'КДО:',
					afterlabel: 'мл',
				},
				{
					type: 'input',
					prelabel: 'КСО:',
					afterlabel: 'мл',
				},
				{
					type: 'input',
					prelabel: 'ОУ:',
					afterlabel: 'мл',
				},
				{
					type: 'input',
					prelabel: 'ФВ:',
					afterlabel: '%',
				},
				{
					type: 'input',
					prelabel: 'ЧСС:',
					afterlabel: '',
				},
				{
					type: 'input',
					prelabel: 'FS:',
				},
				{
					type: 'input',
					prelabel: 'Маса міокарду:',
					afterlabel: 'г',
				},
			],
		},
		{
			name: 'Лівий шлуночок - стінки',
			inputs: [
				{
					type: 'input',
					prelabel: 'ТМШП:',
					afterlabel: 'см',
				},
				{
					type: 'input',
					prelabel: 'Кінез:',
				},
				{
					type: 'input',
					prelabel: 'ТЗС:',
					afterlabel: 'см',
				},
				{
					type: 'input',
					prelabel: 'Кінез:',
				},
				{
					type: 'input',
					prelabel: 'Наявність перикардіального випоту:',
					afterlabel: 'см',
					radio: true,
					radiolabel: 'Ні',
				},
				{
					type: 'radio',
					prelabel: 'Діастологічна дисфункція:',
					values: ['>1', '<1'],
				},
				{
					type: 'input',
					prelabel: 'Атипова хорда:',
					afterlabel: 'см',
					radio: true,
					radiolabel: 'Ні',
				},
			],
		},
		{
			name: 'Мітральний клапан',
			inputs: [
				{
					type: 'radio',
					prelabel: 'Норма:',
					values: ['Так', 'Ні'],
				},
				{
					type: 'radio',
					prelabel: 'Рух',
					values: ['Паралелький', 'П-подібний'],
				},
				{
					type: 'radio',
					prelabel: 'Фіброз',
					values: ['Помірний', 'Виражений', 'Різкий'],
				},
				{
					type: 'text',
					prelabel: 'Кальциноз:',
				},
				{
					type: 'text',
					prelabel: 'Вегетація:',
				},
				{
					type: 'text',
					prelabel: 'Пролапс:',
				},
				{
					type: 'text',
					prelabel: 'Зворотній потік:',
				},
			],
		},
		{
			name: 'Правий шлуночок',
			inputs: [
				{
					type: 'radio',
					prelabel: 'Порожнина:',
					values: ['Норма', 'Збільшена'],
				},
				{
					type: 'radio',
					prelabel: 'Стінка',
					values: ['Норма', 'Гіпертрофія'],
				},
				{
					type: 'text',
					prelabel: 'Скоротливість',
				},
			],
		},
		{
			name: 'Трикуспідальний клапан',
			inputs: [
				{
					type: 'radio',
					prelabel: 'Норма:',
					values: ['Так', 'Ні'],
				},
				{
					type: 'text',
					prelabel: 'Фіброз',
				},
				{
					type: 'text',
					prelabel: 'Зворотній потік',
				},
				{
					type: 'input',
					prelabel: 'Градієнт регуляції',
					afterlabel: 'mmHg',
				},
			],
		},
		{
			name: 'Ліве передсердя',
			inputs: [
				{
					type: 'radio',
					prelabel: 'Норма:',
					values: ['Так', 'Ні'],
				},
				{
					type: 'input',
					prelabel: 'Збільшене:',
					afterlabel: 'см',
					radio: true,
					radiolabel: 'Норма',
				},
			],
		},
		{
			name: 'Праве передсердя',
			inputs: [
				{
					type: 'radio',
					prelabel: 'Норма:',
					values: ['Так', 'Ні'],
				},
				{
					type: 'input',
					prelabel: 'Збільшене:',
					afterlabel: 'см',
					radio: true,
					radiolabel: 'Норма',
				},
			],
		},
		{
			name: 'Аорта, аортальний клапан',
			inputs: [
				{
					type: 'radio',
					prelabel: 'Норма:',
					values: ['Так', 'Ні'],
				},
				{
					type: 'radio',
					prelabel: 'Фіброз',
					values: ['Помірний', 'Виражений', 'Різкий'],
				},
				{
					type: 'text',
					prelabel: 'Кальциноз:',
				},
				{
					type: 'text',
					prelabel: 'Вегетація:',
				},
				{
					type: 'text',
					prelabel: 'Систологічне розкриття:',
				},
				{
					type: 'input',
					prelabel: 'Діаметр аорти:',
					afterlabel: 'см',
				},
				{
					type: 'text',
					prelabel: 'Зворотній потік:',
				},
				{
					type: 'text',
					prelabel: 'Шв. кровотоку:',
				},
				{
					type: 'input',
					prelabel: 'Градієнт тиску:',
					afterlabel: 'mmHg',
				},
			],
		},
		{
			name: 'Клапан легеневої артерії',
			inputs: [
				{
					type: 'radio',
					prelabel: 'Норма:',
					values: ['Так', 'Ні'],
				},
				{
					type: 'radio',
					prelabel: 'Фіброз',
					values: ['Помірний', 'Виражений', 'Різкий'],
				},
				{
					type: 'text',
					prelabel: 'Не локується:',
				},
				{
					type: 'radio',
					prelabel: 'Гіпертензія:',
					values: ['Так', 'Ні'],
				},
				{
					type: 'text',
					prelabel: 'Регургітація:',
				},
				{
					type: 'text',
					prelabel: 'Швидкість кровотоку:',
				},
				{
					type: 'input',
					prelabel: 'Градієнт тиску:',
					afterlabel: 'mmHg',
				},
			],
		},
	],
});
Forms.create({
	name: 'Ехокардіологічне обстеження',
	form,
	docxName: 'tmp.docx',
});
