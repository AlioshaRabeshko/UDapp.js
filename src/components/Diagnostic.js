import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Popup from 'reactjs-popup';

const test = {
	name: 'Обстеження органів сечовидільної системи',
	count: 28,
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

const { ipcRenderer, remote } = window.require('electron');

const ChoosePatient = () => {
	const [form, setForm] = useState(test);
	const [data, setData] = useState({});
	const history = useHistory();
	const handleFormChange = (e) =>
		setData({ ...data, [e.target.name]: e.target.value });
	const handleSubmit = () => {
		let count = 0;
		for (let key in data) if (data[key] !== '') count++;
		/* if (count === test.count) */
		console.log('data: ', data);
		ipcRenderer.send('createDocx', data);
		console.log('data: ', data);
	};
	// useEffect(() => console.log('data: ', data), [data]);
	return (
		<div>
			<div className="nav-menu">
				<Popup trigger={<div className="menu-item">Назад</div>} modal>
					{(close) => (
						<div>
							<p>
								Ви впевнені що хочете повернутися? Введені дані будуть втрачені
							</p>
							<div className="buttons">
								<div onClick={() => close()}>Відминити</div>
								<div onClick={() => history.push('/choosepatient')}>
									Перейти
								</div>
							</div>
						</div>
					)}
				</Popup>
				<Popup
					trigger={<div className="menu-item">Повернутися на головну</div>}
					modal>
					{(close) => (
						<div>
							<p>
								Ви впевнені що хочете перейти на головгу сторінку? Введені дані
								будуть втрачені
							</p>
							<div className="buttons">
								<div onClick={() => close()}>Відминити</div>
								<div onClick={() => history.push('/')}>Перейти</div>
							</div>
						</div>
					)}
				</Popup>
				<Popup
					trigger={<div className="menu-item">Вийти з програми</div>}
					modal>
					{(close) => (
						<div>
							<p>Ви впевнені що хочете закрити програму?</p>
							<div className="buttons">
								<div onClick={() => close()}>Відминити</div>
								<div onClick={() => remote.getCurrentWindow().close()}>
									Вийти
								</div>
							</div>
						</div>
					)}
				</Popup>
			</div>
			<div className="diagnostic">
				<h1>{form.name}</h1>
				{form.blocks.map((el, id) => (
					<div className="block" key={id}>
						<h3>{el.name}</h3>
						{el.inputs.map((el, id2) => (
							<div className="field" key={id2}>
								{el.prelabel ? <p>{el.prelabel}</p> : ''}
								<div>
									{el.type !== 'inputxinput' ? (
										el.type === 'radio' ? (
											el.values.map((el, tmp) => (
												<label key={tmp}>
													<input
														type="radio"
														name={`${id}_${id2}`}
														onChange={handleFormChange}
														value={el}
													/>
													{el}
												</label>
											))
										) : (
											<label>
												<input
													type="text"
													name={`${id}_${id2}`}
													onChange={handleFormChange}
												/>
												{el.afterlabel ? ` ${el.afterlabel}` : ''}
											</label>
										)
									) : (
										<label>
											<input
												type="text"
												name={`${id}_${id2}_1`}
												onChange={handleFormChange}
											/>
											x
											<input
												type="text"
												name={`${id}_${id2}_2`}
												onChange={handleFormChange}
											/>
											{el.afterlabel ? ` ${el.afterlabel}` : ''}
										</label>
									)}
								</div>
							</div>
						))}
					</div>
				))}
				<textarea placeholder="Заключення"></textarea>
				<div className="button" onClick={handleSubmit}>
					Submit
				</div>
			</div>
		</div>
	);
};

export default ChoosePatient;
