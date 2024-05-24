import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

const ChatRooms = () => {
	const [roomName, setRoomName] = useState("");
	const [rooms, setRooms] = useState([]);

	useEffect(() => {
		const unsubscribe = onSnapshot(collection(db, "chatRooms"), (snapshot) => {
			const roomsData = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setRooms(roomsData);
		});
		return unsubscribe;
	}, []);

	console.log(rooms);

	const handleCreateRoom = async (e) => {
		e.preventDefault();
		try {
			await addDoc(collection(db, "chatRooms"), { name: roomName });
			setRoomName("");
		} catch (error) {
			console.error("Error creating room: ", error);
		}
	};

	return (
		<div className='min-h-screen flex flex-col items-center bg-gray-100 p-4'>
			<div className='bg-white p-6 rounded shadow-md w-full max-w-md mb-4'>
				<h2 className='text-2xl mb-4'>Create a Chat Room</h2>
				<form onSubmit={handleCreateRoom}>
					<input
						type='text'
						value={roomName}
						onChange={(e) => setRoomName(e.target.value)}
						className='w-full p-2 border border-gray-300 rounded mb-4'
						placeholder='Room Name'
						required
					/>
					<button
						className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'
						type='submit'>
						Create Room
					</button>
				</form>
			</div>
			<div className='bg-white p-6 rounded shadow-md w-full max-w-md'>
				<h2 className='text-2xl mb-4'>Join a Chat Room</h2>
				<ul>
					{rooms.map((room) => (
						<li key={room.id} className='mb-2'>
							<Link
								to={`/chat/${room.id}`}
								className='text-blue-500 hover:underline'>
								{room.name}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default ChatRooms;
