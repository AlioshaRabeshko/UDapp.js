import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const test = {
	name: 'Обстеження органів сечовидільної системи',
	blocks: [
		{
			name: 'Ліва нирка',
			inputs: [
				{
					type: 'radio',
					prelabel: 'Розміщена:',
					values: ['Типово', 'Нетипово', 'Нефроптоз І', 'Нефроптоз ІІ'],
				},
				{
					type: 'inputxinput',
					prelabel: 'Розміри:',
					afterlabel: 'мм',
				},
				{
					type: 'input',
					prelabel: 'Паренхіма:',
					afterlabel: 'мм',
				},
				{
					type: 'radio',
					prelabel: 'Контури:',
					values: ['Чіткі', 'Нечіткі'],
				},
				{
					type: 'radio',
					prelabel: 'Контури:',
					values: ['Рівні', 'Нерівні'],
				},
				{
					type: 'radio',
					prelabel: 'Шари диференціюються:',
					values: ['Чітко', 'Нечітко'],
				},
				{
					type: 'radio',
					prelabel: 'Співвідношення паренхіми до ЧМС:',
					values: ['3:1', '2:1', '1:1'],
				},
				{
					type: 'input',
					prelabel:
						'ЧМК ущільнений за рахунок дрібних ехопозитивних структур розміром до:',
					afterlabel: 'мм',
				},
				{
					type: 'radio',
					prelabel: 'Конкременти:',
					values: ['Виявлено', 'Невиявлено'],
				},
			],
		},
		{
			name: 'Права нирка',
			inputs: [
				{
					type: 'radio',
					prelabel: 'Розміщена:',
					values: ['Типово', 'Нетипово', 'Нефроптоз І', 'Нефроптоз ІІ'],
				},
				{
					type: 'inputxinput',
					prelabel: 'Розміри:',
					afterlabel: 'мм',
				},
				{
					type: 'input',
					prelabel: 'Паренхіма:',
					afterlabel: 'мм',
				},
				{
					type: 'radio',
					prelabel: 'Контури:',
					values: ['Чіткі', 'Нечіткі'],
				},
				{
					type: 'radio',
					prelabel: 'Контури:',
					values: ['Рівні', 'Нерівні'],
				},
				{
					type: 'radio',
					prelabel: 'Шари диференціюються:',
					values: ['Чітко', 'Нечітко'],
				},
				{
					type: 'radio',
					prelabel: 'Співвідношення паренхіми до ЧМС:',
					values: ['3:1', '2:1', '1:1'],
				},
				{
					type: 'input',
					prelabel:
						'ЧМК ущільнений за рахунок дрібних ехопозитивних структур розміром до:',
					afterlabel: 'мм',
				},
				{
					type: 'radio',
					prelabel: 'Конкременти:',
					values: ['Виявлено', 'Невиявлено'],
				},
			],
		},
		,
		{
			name: 'Сечовий міхур',
			inputs: [
				{
					type: 'radio',
					values: ['Виповнений', 'Невиповнений'],
				},
				{
					type: 'input',
					prelabel: 'V',
					afterlabel: 'мм',
				},
				{
					type: 'input',
					prelabel: 'Vзал',
					afterlabel: 'мм',
				},
				{
					type: 'radio',
					prelabel: 'Контури:',
					values: ['Чіткі', 'Нечіткі'],
				},
				{
					type: 'radio',
					prelabel: 'Контури:',
					values: ['Рівні', 'Нерівні'],
				},
				{
					type: 'radio',
					prelabel: 'Вміст',
					values: ['Однорідний', 'Неоднорідний'],
				},
				{
					type: 'input',
					prelabel: 'Стінки',
					afterlabel: 'мм',
				},
				{
					type: 'radio',
					prelabel: 'Сечоводи',
					values: ['Нерозширені', 'Розширені  '],
				},
			],
		},
	],
};

const { ipcRenderer } = window.require('electron');

const ChoosePatient = () => {
	return (
		<div className="diagnostic">
			<h1>{test.name}</h1>
			{test.blocks.map((el, id) => (
				<div className="block" key={id}>
					<h3>{el.name}</h3>
					{el.inputs.map((el, id) => (
						<div className="field" key={id}>
							{el.prelabel ? <p>{el.prelabel}</p> : ''}
							<div>
								{el.type !== 'inputxinput' ? (
									el.type === 'radio' ? (
										el.values.map((el, tmp) => (
											<label key={tmp}>
												<input type="radio" name={id} />
												{el}
											</label>
										))
									) : (
										<label>
											<input type="text" />
											{el.afterlabel ? ` ${el.afterlabel}` : ''}
										</label>
									)
								) : (
									<label>
										<input type="text" />
										x
										<input type="text" />
										{el.afterlabel ? ` ${el.afterlabel}` : ''}
									</label>
								)}
							</div>
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default ChoosePatient;
