const $RefParser = require("@apidevtools/json-schema-ref-parser");
const Ajv = require('ajv');
const fs = require('fs-extra');

const FILE_TO_VALIDATE = 'C:/Dev/stac-spec/item-spec/examples/CBERS_4_MUX_20181029_177_106_L4.json';

const ALL_SCHEMAS = {
	"$schema": "http://json-schema.org/draft-07/schema#",
	"oneOf": [
		{
		"$ref": "./stac-spec/item-spec/json-schema/item.json"
		},
		{
			"anyOf": [
				{
					"$ref": "./stac-spec/catalog-spec/json-schema/catalog.json"
				},
				{
					"$ref": "./stac-spec/collection-spec/json-schema/collection.json"
				}
			]
		}
	]
};

async function run() {
	try {
		let schema = await $RefParser.dereference(ALL_SCHEMAS);
		let ajv = new Ajv({
			allErrors: true
		});
		let validate = ajv.compile(schema);
		let data = await fs.readJson(FILE_TO_VALIDATE);
		var valid = validate(data);
		if (!valid) console.log(validate.errors);
		else console.info("VALID");
	}
	catch(err) {
		console.error(err);
	}
}

run();