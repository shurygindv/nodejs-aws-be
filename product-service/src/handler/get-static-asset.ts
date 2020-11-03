import { promises as fs } from 'fs';
import path from 'path';

import { validator as v } from '../libs/validator';

// only jpg, png
export const getStaticAsset = async (event) => {
	console.info(event);

	const file = Object(event.pathParameters).file;

	if (v.isImageFileName(file)) {
		return serveStaticFile(file);
	}

	return { statusCode: 404 };
};

const mimeTypes = {
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
};


async function serveStaticFile(file: string) {
	const ext = path.extname(file);

	const filePath = path.resolve(
		__dirname,
		'assets/images',
		file
    );
    
    console.log(filePath);

	try {
		const fileContent = await fs.readFile(filePath);

		return {
			statusCode: 200,
			isBase64Encoded: true,
			body: fileContent.toString('base64'),
			headers: {
				'Content-Type': mimeTypes[ext],
			},
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 404,
		};
	}
}

