// App.js

import React from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ChatRooms from "./components/ChatRooms";

const PrivateRoute = ({ element }) => {
	const { currentUser } = useAuth();

	return currentUser ? element : <Navigate to='/login' replace />;
};

const AuthRoute = ({ element }) => {
	const { currentUser } = useAuth();

	return currentUser ? <Navigate to='/' replace /> : element;
};

const App = () => {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path='/login' element={<AuthRoute element={<Login />} />} />
					<Route path='/signup' element={<AuthRoute element={<Signup />} />} />
					<Route path='/' element={<PrivateRoute element={<ChatRooms />} />} />
				</Routes>
			</Router>

			<ToastContainer position='bottom-right' autoClose={3000} />
		</AuthProvider>
	);
};

export default App;
