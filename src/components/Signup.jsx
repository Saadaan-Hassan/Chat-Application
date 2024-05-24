import React, { useState } from "react";
import { auth, db, storage } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [profileImage, setProfileImage] = useState(null);

	const handleSignup = async (e) => {
		e.preventDefault();
		try {
			// Create user with email and password
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			// Upload profile image if selected
			let profileImageUrl = "";
			if (profileImage) {
				const imageRef = ref(
					storage,
					`profile_images/${userCredential.user.uid}`
				);
				await uploadBytes(imageRef, profileImage);
				profileImageUrl = await getDownloadURL(imageRef);
			}

			// Update user profile with username and profile image URL
			await updateUserProfile(userCredential.user, username, profileImageUrl);

			// Redirect to chat room or profile page
		} catch (error) {
			console.error("Error signing up: ", error);
			toast.error(error.message);
		}
	};

	const updateUserProfile = async (user, username, profileImageUrl) => {
		try {
			await updateProfile(user, {
				displayName: username,
				photoURL: profileImageUrl,
			});

			// Update user document in Firestore with additional data if needed
			await setDoc(doc(db, "users", user.uid), {
				username,
				profileImageUrl,
			});
		} catch (error) {
			console.error("Error updating user profile: ", error);
			toast.error("Error updating user profile");
		}
	};

	const handleImageUpload = (e) => {
		const imageFile = e.target.files[0];
		setProfileImage(imageFile);
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100'>
			<div className='bg-white p-6 rounded shadow-md w-full max-w-sm'>
				<h2 className='text-2xl mb-4'>Sign Up</h2>
				<form onSubmit={handleSignup}>
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
					<div className='mb-4'>
						<label className='block mb-1' htmlFor='username'>
							Username
						</label>
						<input
							type='text'
							id='username'
							className='w-full p-2 border border-gray-300 rounded'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div className='mb-4'>
						<label className='block mb-1' htmlFor='profileImage'>
							Profile Image
						</label>
						<input
							type='file'
							id='profileImage'
							accept='image/*'
							className='w-full p-2 border border-gray-300 rounded'
							onChange={handleImageUpload}
						/>
					</div>
					<button
						className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'
						type='submit'>
						Sign Up
					</button>
				</form>
			</div>
			<ToastContainer position='bottom-right' autoClose={3000} />
		</div>
	);
};

export default Signup;
