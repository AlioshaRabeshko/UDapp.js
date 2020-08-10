'use strict';

const { globalShortcut, app, BrowserWindow, shell } = require('electron');
const { ipcMain } = require('electron');
const { Sequelize } = require('sequelize');
const pizzip = require('pizzip');
const docx = require('docxtemplater');
const fs = require('fs');
const path = require('path');
const isDev = require('electron-is-dev');

const Patients = require('../models/patients');
const Forms = require('../models/forms');

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		webPreferences: {
			nodeIntegration: true,
		},
		frame: false,
	});
	// mainWindow.setMenu(null);
	mainWindow.loadURL(
		isDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, '../build/index.html')}`
	);
	mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.on('getPatients', async (e, arg) => {
	const patients = await Patients.findAll();
	const filtered = patients.filter(
		(el) => el.name.toLowerCase().indexOf(arg.name.toLowerCase()) !== -1
	);
	if (filtered.length > 0) e.reply('getPatients-reply', { data: filtered });
	else e.reply('getPatients-reply', { data: [] });
});

ipcMain.on('getPatient', async (e, arg) => {
	const patient = await Patients.findOne({ where: { id: arg.id } });
	e.reply('getPatient-reply', { data: patient });
});

ipcMain.on('getSettle', async (e, arg) => {
	const settlesDate = await Patients.findAll({
		attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('settle')), 'settle']],
	});
	const settles = settlesDate.map((el) => el.settle);
	if (settles.length > 0) e.reply('getSettle-reply', { settles });
});

ipcMain.on('addPatient', async (e, arg) => {
	const patient = await Patients.create(arg);
	if (patient) e.reply('addPatient-reply', { status: true });
});

ipcMain.on('editPatient', async (e, arg) => {
	const patient = await Patients.findOne({ where: { id: arg.id } });
	patient.name = arg.name;
	patient.birthday = arg.birthday;
	patient.settle = arg.settle;
	patient.sex = arg.sex;
	patient.save();
	e.reply('editPatient-reply', { status: true });
});

ipcMain.on('createDocx', async (e, arg) => {
	const content = fs.readFileSync(
		path.resolve(__dirname, `tmp3.docx`),
		'binary'
	);
	const zip = new pizzip(content);
	try {
		const doc = new docx(zip);
		doc.setData(arg);
		doc.render();
		const buf = doc.getZip().generate({ type: 'nodebuffer' });
		fs.writeFile(path.resolve(__dirname, 'output.docx'), buf, () => {
			e.reply('createDocx-reply', { status: true, data: arg });
			shell.openPath(path.join(__dirname, 'output.docx'));
		});
	} catch (error) {
		console.log(error);
	}
});

ipcMain.on('getDiagnostics', async (e, arg) => {
	const strings = await Forms.findAll();
	const forms = strings.map((el) => JSON.parse(el.dataValues.form));
	e.reply('getDiagnostics-reply', { data: forms });
});
// const form = JSON.stringify({
// 	name: 'Обстеження органів сечовидільної системи',
// 	count: 28,
// 	blocks: [
// 		{
// 			name: 'Ліва нирка',
// 			inputs: [
// 				{
// 					type: 'radio',
// 					prelabel: 'Розміщена:',
// 					values: ['Типово', 'Нетипово', 'Нефроптоз І', 'Нефроптоз ІІ'],
// 				},
// 				{
// 					type: 'inputxinput',
// 					prelabel: 'Розміри:',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'Паренхіма:',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Контури:',
// 					values: ['Чіткі', 'Нечіткі'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Контури:',
// 					values: ['Рівні', 'Нерівні'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Шари диференціюються:',
// 					values: ['Чітко', 'Нечітко'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Співвідношення паренхіми до ЧМС:',
// 					values: ['3:1', '2:1', '1:1'],
// 				},
// 				{
// 					type: 'input',
// 					prelabel:
// 						'ЧМК ущільнений за рахунок дрібних ехопозитивних структур розміром до:',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Конкременти:',
// 					values: ['Виявлено', 'Невиявлено'],
// 				},
// 			],
// 		},
// 		{
// 			name: 'Права нирка',
// 			inputs: [
// 				{
// 					type: 'radio',
// 					prelabel: 'Розміщена:',
// 					values: ['Типово', 'Нетипово', 'Нефроптоз І', 'Нефроптоз ІІ'],
// 				},
// 				{
// 					type: 'inputxinput',
// 					prelabel: 'Розміри:',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'Паренхіма:',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Контури:',
// 					values: ['Чіткі', 'Нечіткі'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Контури:',
// 					values: ['Рівні', 'Нерівні'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Шари диференціюються:',
// 					values: ['Чітко', 'Нечітко'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Співвідношення паренхіми до ЧМС:',
// 					values: ['3:1', '2:1', '1:1'],
// 				},
// 				{
// 					type: 'input',
// 					prelabel:
// 						'ЧМК ущільнений за рахунок дрібних ехопозитивних структур розміром до:',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Конкременти:',
// 					values: ['Виявлено', 'Невиявлено'],
// 				},
// 			],
// 		},
// 		,
// 		{
// 			name: 'Сечовий міхур',
// 			inputs: [
// 				{
// 					type: 'radio',
// 					values: ['Виповнений', 'Невиповнений'],
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'V',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'Vзал',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Контури:',
// 					values: ['Чіткі', 'Нечіткі'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Контури:',
// 					values: ['Рівні', 'Нерівні'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Вміст',
// 					values: ['Однорідний', 'Неоднорідний'],
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'Стінки',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Сечоводи',
// 					values: ['Нерозширені', 'Розширені  '],
// 				},
// 			],
// 		},
// 	],
// });
// const tmp = await Forms.create({
// 	name: 'Обстеження органів сечовидільної системи',
// 	form,
// 	docxName: 'tmp3.docx',
// });
