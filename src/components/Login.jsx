import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigation = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			await signInWithEmailAndPassword(auth, email, password);
			navigation("/chatrooms");
		} catch (error) {
			console.error("Error logging in: ", error);
			toast.error(error.message);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100'>
			<div className='bg-white p-6 rounded shadow-md w-full max-w-sm'>
				<h2 className='text-2xl mb-4'>Login</h2>
				<form onSubmit={handleLogin}>
					<div className='mb-4'>
						<label className='block mb-1' htmlFor='email'>
							Email
						</label>
						<input
							type='email'
							id='email'
							className='w-full p-2 border border-gray-300 rounded'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className='mb-4'>
						<label className='block mb-1' htmlFor='password'>
							Password
						</label>
						<input
							type='password'
							id='password'
							className='w-full p-2 border border-gray-300 rounded'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<button
						className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'
						type='submit'>
						Login
					</button>
					<p className='text-center mt-4'>
						Don't have an account?{" "}
						<Link to='/signup' className='text-blue-500'>
							Sign Up
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
};

export default Login;
