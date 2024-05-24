import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ChatRoom = () => {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const { roomId } = useParams();

	useEffect(() => {
		const unsubscribe = onSnapshot(
			doc(db, "chatRooms", roomId),
			(doc) => {
				if (doc.exists()) {
					const data = doc.data();
					setMessages(data.messages || []);
				}
			},
			(err) => {
				setError(err);
			}
		);

		return unsubscribe;
	}, [roomId]);

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!message) {
			return;
		}
		try {
			const newMessage = {
				text: message,
				createdAt: new Date(),
				uid: auth.currentUser.uid,
				displayName: auth.currentUser.displayName,
			};

			await updateDoc(doc(db, "chatRooms", roomId), {
				messages: [...messages, newMessage],
			});

			setMessage("");
		} catch (error) {
			console.error("Error sending message: ", error);
			setError("Error sending message");
		}
	};

	return (
		<div className='flex flex-col h-screen'>
			<div className='flex-1 overflow-auto p-4'>
				{messages.map((msg, index) => (
					<div key={index} className='mb-2'>
						<strong>{msg.displayName}: </strong>
						{msg.text}
					</div>
				))}
			</div>
			<form
				onSubmit={handleSendMessage}
				className='p-4 border-t border-gray-200'>
				<input
					type='text'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					className='w-full p-2 border border-gray-300 rounded'
					placeholder='Type your message'
				/>
				<button
					className='mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'
					type='submit'>
					Send
				</button>
			</form>
			<div className='p-4 border-t border-gray-200'>
				<Link
					to={`/private/${roomId}`}
					className='text-blue-500 hover:underline'>
					Send Private Message
				</Link>
			</div>
		</div>
	);
};

export default ChatRoom;
