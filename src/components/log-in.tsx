import { Link } from "react-router-dom";

type inputs = {
	name: string;
	type: string;
	children: string;
};

function Field({ name, type, children }: inputs) {
	return (
		<div className='form-group'>
			<label htmlFor={name}>{children}</label>
			<input type={type} name={name} />
		</div>
	);
}

function LogIn() {
	return (
		<div>
			<h1>Log in</h1>
			<form action='https://dummy-blog.adaptable.app/user/log-in' method='post'>
				<div className='labels-inputs'>
					<Field name='username' type='text'>
						Username:
					</Field>
					<br />
					<Field name='password' type='text'>
						Password:
					</Field>
					<br />
				</div>
				<button type='submit'>
					<Link to='/'>Log in</Link>
				</button>
			</form>
		</div>
	);
}

export default LogIn;
