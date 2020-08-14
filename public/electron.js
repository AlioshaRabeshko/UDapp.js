'use strict';

const {
	globalShortcut,
	app,
	BrowserWindow,
	shell,
	remote,
} = require('electron');
const { ipcMain } = require('electron');
const { Sequelize } = require('sequelize');
const pizzip = require('pizzip');
const docx = require('docxtemplater');
const fs = require('fs');
const path = require('path');
const isDev = require('electron-is-dev');

const Patients = require('../models/patients');
const Diagnostics = require('../models/diagnostics');
const Forms = require('../models/forms');
const Settings = require('../models/settings');

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
		},
		// frame: false,
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
	const { data, id, patientId } = arg;
	const { name, birthday } = (
		await Patients.findOne({ where: { id: patientId } })
	).dataValues;
	const doctor = (await Settings.findOne({ where: { property: 'doctor' } }))
		.dataValues;
	const device = (await Settings.findOne({ where: { property: 'device' } }))
		.dataValues;
	const { docxName } = (await Forms.findOne({ where: { id } })).dataValues;
	const template = fs.readFileSync(path.resolve(__dirname, docxName), 'binary');
	const zip = new pizzip(template);
	try {
		const doc = new docx(zip);
		const obj = {
			...data,
			name,
			birthday: birthday.toLocaleDateString(),
			date: new Date().toLocaleDateString(),
			doctor: doctor.value,
			device: device.value,
		};
		const tmp = await Diagnostics.create({
			patientId,
			diagnosticId: id,
			data: JSON.stringify(obj),
		});
		doc.setData(obj);
		doc.render();
		const buf = doc.getZip().generate({ type: 'nodebuffer' });
		const output = path.resolve(__dirname, 'output.docx');
		const writeStream = fs.createWriteStream(output);
		writeStream.write(buf);
		shell.openPath(output);
		e.reply('createDocx', { id: tmp.dataValues.id });
	} catch (error) {
		console.log(error);
	}
});

ipcMain.on('getDiagnostics', async (e, arg) => {
	const strings = await Forms.findAll();
	const forms = strings.map((el) => ({
		form: JSON.parse(el.dataValues.form),
		id: el.dataValues.id,
	}));
	e.reply('getDiagnostics-reply', { data: forms });
});

ipcMain.on('getDiagnostic', async (e, arg) => {
	const data = await Forms.findOne({ where: { id: arg.id } });
	e.reply('getDiagnostic-reply', { data });
});

ipcMain.on('getPrevious', async (e, arg) => {
	const res = await Diagnostics.findAll({ where: { patientId: arg.id } });
	const newRes = [];
	for (const val of res) {
		const form = await Forms.findOne({
			where: { id: val.dataValues.diagnosticId },
		});
		newRes.push({
			name: form.dataValues.name,
			id: val.dataValues.id,
			createdAt: val.dataValues.createdAt,
		});
	}
	e.reply('getPrevious-reply', { data: newRes });
});

ipcMain.on('deleteReport', async (e, arg) => {
	const item = await Diagnostics.findOne({ where: { id: arg.id } });
	item.destroy();
});

ipcMain.on('getReport', async (e, arg) => {
	const data = await Diagnostics.findOne({ where: { id: arg.id } });
	const form = await Forms.findOne({
		where: { id: data.dataValues.diagnosticId },
	});
	const patient = await Patients.findOne({
		where: { id: data.dataValues.patientId },
	});
	e.reply('getReport-reply', {
		data: data.dataValues.data,
		form: form.dataValues,
		patient: patient.dataValues,
	});
});

ipcMain.on('genDocx', async (e, arg) => {
	const data = await Diagnostics.findOne({ where: { id: arg.id } });
	const form = await Forms.findOne({
		where: { id: data.dataValues.diagnosticId },
	});
	const obj = JSON.parse(data.dataValues.data);
	const template = fs.readFileSync(
		path.resolve(__dirname, form.dataValues.docxName),
		'binary'
	);
	const zip = new pizzip(template);
	try {
		const doc = new docx(zip);
		doc.setData(obj);
		doc.render();
		const buf = doc.getZip().generate({ type: 'nodebuffer' });
		const output = path.resolve(__dirname, 'output.docx');
		const writeStream = fs.createWriteStream(output);
		writeStream.write(buf);
		shell.openPath(output);
	} catch (error) {
		console.log(error);
	}
});

ipcMain.on('fetchSettings', async (e, arg) => {
	const settings = await Settings.findAll();
	e.reply('fetchSettings-reply', { settings });
});

// const form = JSON.stringify({
// 	name: 'Обстеження органів черевної порожнини',
// 	count: 29,
// 	blocks: [
// 		{
// 			name: 'Печінка',
// 			inputs: [
// 				{
// 					type: 'input',
// 					prelabel: 'Ліва доля:',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'Права доля:',
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
// 					prelabel: 'Краї:',
// 					values: ['Типово', 'Нетипово'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Ехоструктура:',
// 					values: ['Дрібнозерниста', 'Однорідна', 'Неоднорідна'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Ехогенність:',
// 					values: ['Підвищена', 'Знижена', 'Без змін'],
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'Ворітка вежа:',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'НПВ:',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'Холедох:',
// 					afterlabel: 'мм',
// 				},
// 			],
// 		},
// 		{
// 			name: 'Жовчний міхур',
// 			inputs: [
// 				{
// 					type: 'radio',
// 					prelabel: 'Розміщена:',
// 					values: ['Визначається', 'Не визначається'],
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'Розміри:',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'Стінки:',
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
// 			],
// 		},
// 		{
// 			name: 'Підшлункова залоза',
// 			inputs: [
// 				{
// 					type: 'radio',
// 					prelabel: 'Візуалізація:',
// 					values: ['Візуалізується', 'Не візуалізується'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Візуалізація:',
// 					values: ['Повністю', 'Неповністю'],
// 				},
// 				{
// 					type: 'inputxinputxinput',
// 					prelabel: 'Розміри',
// 					afterlabel: 'мм',
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Структура:',
// 					values: ['Однорідна', 'Неоднорідна'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Ехогенність:',
// 					values: ['Підвищена', 'Знижена', 'Без змін'],
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'Панкреатична протока',
// 					afterlabel: 'мм',
// 				},
// 			],
// 		},
// 		{
// 			name: 'Селезінка',
// 			inputs: [
// 				{
// 					type: 'input',
// 					prelabel: 'Розміри',
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
// 					prelabel: 'Ехоструктура:',
// 					values: ['Дрібнозерниста', 'Однорідна', 'Неоднорідна'],
// 				},
// 				{
// 					type: 'radio',
// 					prelabel: 'Ехогенність:',
// 					values: ['Підвищена', 'Знижена', 'Без змін'],
// 				},
// 				{
// 					type: 'input',
// 					prelabel: 'Селезінкова вежа у воротах селезінки',
// 					afterlabel: 'мм',
// 				},
// 			],
// 		},
// 	],
// });
// Forms.create({
// 	name: 'Обстеження органів сечовидільної системи',
// 	form,
// 	docxName: 'tmp2.docx',
// });
