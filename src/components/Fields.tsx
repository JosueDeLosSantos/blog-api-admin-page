type inputs = {
	name: string;
	type: string;
	value: string;
	onInput: React.FormEventHandler;
	children: string;
};

type imageFile = {
	name: string;
	onInput: React.FormEventHandler;
	children: string;
};

type textArea = {
	name: string;
	value: string;
	onChange: React.FormEventHandler;
	children: string;
};

export function TextField({ name, type = "text", value, onInput, children }: inputs) {
	return (
		<div className='form-group'>
			<label htmlFor={name}>{children}</label>
			<input onInput={onInput} type={type} name={name} value={value} />
		</div>
	);
}

export function TextAreaField({ name, value, onChange, children }: textArea) {
	return (
		<div className='form-group'>
			<label htmlFor={name}>{children}</label>
			<textarea
				cols={100}
				rows={30}
				onChange={onChange}
				name={name}
				value={value}
			></textarea>
		</div>
	);
}

export function FileField({ name, onInput, children }: imageFile) {
	return (
		<div className='form-group'>
			<label htmlFor={name}>{children}</label>
			<input type='file' onChange={onInput} name={name} accept={"image/*"} />
		</div>
	);
}
