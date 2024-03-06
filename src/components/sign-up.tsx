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

function SignUp() {
	return (
		<div>
			<h1>Sign up</h1>
			<form action='https://dummy-blog.adaptable.app/user/sign-up' method='post'>
				<div className='labels-inputs'>
					<Field name='first_name' type='text'>
						First Name:
					</Field>
					<br />
					<Field name='last_name' type='text'>
						Last Name:
					</Field>
					<br />
					<Field name='username' type='text'>
						Username:
					</Field>
					<br />
					<Field name='password' type='text'>
						Password:
					</Field>
					<br />
					<Field name='passwordConfirmation' type='text'>
						Password Confirmation:
					</Field>
					<br />
				</div>
				<button type='submit'>
					<Link to='user/log-in'>Sign up</Link>
				</button>
			</form>
		</div>
	);
}

export default SignUp;
