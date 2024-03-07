type inputs = {
	name: string;
	type: string;
	value: string;
	onInput: React.FormEventHandler;
	children: string;
};

function Field({ name, type, value, onInput, children }: inputs) {
	return (
		<div className='form-group'>
			<label htmlFor={name}>{children}</label>
			<input onInput={onInput} type={type} name={name} value={value} />
		</div>
	);
}

export default Field;
