import {IExecuteFunctions,} from 'n8n-core';

import {
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {OptionsWithUri,} from 'request';

export class LdsMicroMeasure implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LdsMicroMeasure',
		name: 'ldsMicroMeasure',
		icon: 'file:gear-icon.svg',
		group: ['transform'],
		version: 1,
		description: 'Consume LdsSimilarity API for micro measures',
		defaults: {
			name: 'LdsMicroMeasure',
			color: '#1A82e2',
		},
		inputs: ['main', 'main'],
		inputNames: ['LdsDataset', 'LdsMicroMeasure'],
		outputs: ['main'],
		credentials: [
		],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.

			{
				displayName: 'Resource 1',
				name: 'url1',
				type: 'string',
				required: true,
				default:'',
				description:'Name of the first concept',
			},

			{
				displayName: 'Resource 2',
				name: 'url2',
				type: 'string',
				required: true,
				default:'',
				description:'Name of the second concept',
			},

			{
				displayName: 'Property',
				name: 'propertyName',
				type: 'string',
				required: true,
				default:'',
				description:'Name of the property to be considered during the calculation',
			},

			{
				displayName: 'Type of atomic measure',
				name: 'measure_atomic',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getMeasures',
				},
				default: 'levenshtein',
				description: 'Type of atomic measure to apply on the property',
			},

			{
				displayName: 'Weight',
				name: 'weight',
				type: 'number',
				required: true,
				typeOptions: {
					maxValue: 1,
					minValue: 0,
					numberStepSize: 0.01,
				},
				default: 0.5,
				description: 'Indicate the weight of this measure. This value acts like a coefficient.',
			},

			{
				displayName: 'Output format for numbers',
				name: 'format_numbers',
				type: 'options',
				options: [
					{
						name: 'Numeric',
						value: 'numeric',
					},
					{
						name: 'String',
						value: 'string',
						description: 'This option can helps displaying the zeros values in Google Sheet. This ' +
							'has no impact on aggregation calculations.',
					},
				],
				default: 'numeric',
				description: 'The output format for the result value of similarity score. <br />' +
					'String format can be preferred for the Google Sheets output (Google Sheets doesn\'t <br />' +
					'report the value when it is zero, and this option forces Google Sheets node to <br />' +
					'write the zero value), whereas numeric format can be preferred for the CSV output, <br />' +
					'for example.',
			},

		],
	};

	methods = {
		loadOptions: {
			async getMeasures(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				// @ts-ignore
				const responseData = await this.helpers.request({
					headers: {
						'Accept': 'application/json',
					},
					method: 'POST',
					body: {},
					uri: 'http://localhost:9002/getMicroMeasures',
					json: true,
				});

				for(const option of responseData) {
					returnData.push({
						name: option.name,
						value: option.attribute,
						description: option.description,
					});
				}

				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		// récupérer les valeurs entrées par l'utilisateur
		const formatString = this.getNodeParameter('format_numbers', 0) !== 'numeric';

		// récupérer les valeurs en input et les sauvegarder pour les ajouter à la sortie

		// tslint:disable-next-line:no-any
		let previousData: string | any[] = [];
		let parameters;
		try { // dataset : parameters
			parameters = this.getInputData(0);
			if (typeof parameters === 'undefined') throw new Error('');
		}
		catch(error) {
			throw new Error('Dataset parameters are missing. Maybe you forgot to add a LdsDataset node before this one.');
		}
		let usePreviousData=true;
		try { // input file : items
			previousData = this.getInputData(1);
			if (typeof previousData === 'undefined') throw new Error('');
		}
		catch(error) {
			usePreviousData=false;
		}

		// calculer la valeur de similarité avec l'api LDS (requête POST)
		// pour l'instant on renvoie une valeur aléatoire



		const sendData = {
			headers: {
				'Accept': 'application/json',
			},
			method: 'POST',
			body: {
				'ldDatasetMain': parameters[0].json,
				'resources': [{
					resource1: this.getNodeParameter('url1', 0) as string,
					resource2: this.getNodeParameter('url2', 0) as string,
					property: this.getNodeParameter('propertyName', 0) as string,
				}],
				'options': {
					weight: this.getNodeParameter('weight', 0) as number,
					measureType: this.getNodeParameter('measure_atomic', 0) as string,
				},
			},
			uri: 'http://localhost:9002/microMeasure',
			json: true,
		};

		//console.log(sendData);

		const responseData = await this.helpers.request(sendData);

		// fusionner l'input et le résultat, puis faire la sortie

		//log(responseData);
		const returnData = [];

		if(usePreviousData === true) {
			for(let i=0; i<previousData.length; i++) {
				returnData.push({
					resource1: previousData[i].json.resource1,
					resource2: previousData[i].json.resource2,
					property: previousData[i].json.property,
					score: previousData[i].json.score,
					weight: previousData[i].json.weight,
					result: previousData[i].json.result,
				});
			}
		}

		if(responseData.status === 'error') {
			throw new Error('Error ' + responseData.code + ' : ' + responseData.message);
		}
		else if (responseData.status === 'success') {
			const weight = this.getNodeParameter('weight', 0) as number;
			returnData.push({
				resource1: this.getNodeParameter('url1', 0) as string,
				resource2: this.getNodeParameter('url2', 0) as string,
				property: this.getNodeParameter('propertyName', 0) as string,
				score: (formatString) ? responseData.data[0].score as string : responseData.data[0].score as number,
				'weight': weight,
				result: (responseData.data[0].score * weight) as number,
			});

		}

		return [this.helpers.returnJsonArray(returnData)];




	}

}
