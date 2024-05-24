import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = () => {
	const { currentUser } = useAuth();

	const handleLogout = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error("Error logging out: ", error);
		}
	};

	return (
		<nav className='bg-blue-500 p-4'>
			<div className='container mx-auto flex justify-between items-center'>
				<Link to='/' className='text-white text-lg'>
					ChatApp
				</Link>
				<div>
					{currentUser ? (
						<>
							<Link to='/profile' className='text-white mr-4'>
								Profile
							</Link>
							<Link to='/chatrooms' className='text-white mr-4'>
								Chat Rooms
							</Link>
							<button onClick={handleLogout} className='text-white'>
								Logout
							</button>
						</>
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
