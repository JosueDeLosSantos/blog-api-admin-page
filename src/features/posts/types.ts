export type postTypes = {
	_id: string;
	title: string;
	description: string;
	date: string;
	author: string;
	file: {
		filename: string;
		originalname: string;
		mimetype: string;
		path: string;
		size: number;
	};
	__v: number;
};
