import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import ChatRoom from "./components/ChatRoom";
import ChatRooms from "./components/ChatRooms";

const App = () => {
	return (
		<AuthProvider>
			<Router>
				<Navbar />
				<Routes>
					<Route path='/login' element={<Login />} />
					<Route path='/signup' element={<Signup />} />
					<Route path='/profile' element={<Profile />} />
					<Route path='/chat/:roomId' element={<ChatRoom />} />
					<Route path='/chatrooms' element={<ChatRooms />} />
				</Routes>
			</Router>

			<ToastContainer position='bottom-right' autoClose={3000} />
		</AuthProvider>
	);
};

export default App;
