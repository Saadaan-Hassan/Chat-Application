import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { Power, CircleUserRound } from "lucide-react";

const Navbar = () => {
	const { currentUser } = useAuth();

	const handleLogout = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error("Error logging out: ", error);
			toast.error("Error logging out");
		}
	};

	return (
		<nav className='bg-gray-700 p-2'>
			<div className='container mx-auto flex justify-between items-center'>
				<Link to='/' className='text-white text-lg flex items-center'>
					<img
						src='favicon.png'
						alt='Lingua Link'
						style={{
							width: "50px",
							height: "50px",
						}}
					/>
					Lingua Link
				</Link>
				<div>
					{currentUser ? (
						<div className='flex items-center gap-x-4'>
							<Link to='/profile' className='text-green-500'>
								<CircleUserRound />
							</Link>
							<button onClick={handleLogout} className='text-red-500'>
								<Power />
							</button>
						</div>
					) : (
						<>
							<Link to='/login' className='text-white mr-4'>
								Login
							</Link>
							<Link to='/signup' className='text-white'>
								Sign Up
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
