import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import {
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";
import { toast } from "react-toastify";

const Profile = () => {
	const [user, setUser] = useState(null);
	const [username, setUsername] = useState("");
	const [profileImage, setProfileImage] = useState(null);
	const [newProfileImage, setNewProfileImage] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				setUser(currentUser);
				setUsername(currentUser.displayName || "");
				setProfileImage(currentUser.photoURL || null);
			}
		});

		return unsubscribe;
	}, []);

	const handleImageUpload = async (e) => {
		try {
			const file = e.target.files[0];
			const storageRef = ref(storage, `profileImages/${user.uid}`);
			if (profileImage) {
				// Delete previous image if exists
				const oldImageRef = refFromURL(profileImage);
				await deleteObject(oldImageRef);
			}
			await uploadBytes(storageRef, file);
			const photoURL = await getDownloadURL(storageRef);
			await updateProfile(user, { photoURL });
			setProfileImage(photoURL);
			setNewProfileImage(null);
			toast.success("Profile image updated successfully");
		} catch (error) {
			console.error("Error uploading profile image: ", error);
			toast.error("Error uploading profile image");
		}
	};

	const refFromURL = (url) => {
		const storageRef = ref(storage);
		return storageRef.child(url.split(storageRef._location.path).join(""));
	};

	const handleSave = async () => {
		try {
			await updateProfile(user, { displayName: username });
			const userDocRef = doc(db, "users", user.uid);
			await updateDoc(userDocRef, { username });
			toast.success("Profile updated successfully");
		} catch (error) {
			console.error("Error updating profile: ", error);
			toast.error("Error updating profile");
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100'>
			<div className='bg-white p-6 rounded shadow-md w-full max-w-sm'>
				<h2 className='text-2xl mb-4'>Profile</h2>
				{profileImage && (
					<div className='mb-4'>
						<img
							src={profileImage}
							alt='Profile'
							className='w-32 h-32 rounded-full object-cover'
						/>
						<button
							className='ml-2 text-sm text-blue-500'
							onClick={() => setProfileImage(null)}>
							Remove
						</button>
					</div>
				)}
				<input
					type='file'
					onChange={(e) => setNewProfileImage(e.target.files[0])}
					className='mb-4'
				/>
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
					/>
				</div>
				<button
					onClick={handleSave}
					className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'>
					Save
				</button>
			</div>
		</div>
	);
};

export default Profile;
