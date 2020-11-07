import { promises as fs } from 'fs';
import path from 'path';

import { validator as v } from '../libs/validator';
import { httpResponse } from "../libs/http";

// only jpg, png
export const getStaticAsset = async (event) => {
	console.info(event);

	const file = Object(event.pathParameters).file;

	if (v.isImageFileName(file)) {
		return serveStaticFile(file);
	}

	return httpResponse.fileNotFound();
};

const mimeTypes = {
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
};


const readAssetFile = (file: string) => fs.readFile(path.resolve(
	__dirname,
	'assets/images',
	file
));

async function serveStaticFile(file: string) {
	const ext = path.extname(file);
	const contentType = mimeTypes.hasOwnProperty(ext) ? mimeTypes[ext] : '';

	if (contentType === '') {
		return httpResponse.fileNotFound();
	}

	try {
		const fileContent = await readAssetFile(file);

		return httpResponse.lambdaFile({
			fileContent: fileContent,
			contentType
		});
	} catch (error) {
		console.error(error);
		return httpResponse.fileNotFound();
	}
}

