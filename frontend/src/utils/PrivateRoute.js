import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const TeacherOrSecretaryOrAdminRoute = ({ element: Element, ...rest }) => {
	let { user } = useContext(AuthContext);

	if (user) {
		return user.role === 1 || user.role === 2 || user.role === 3 ? (
			<Element {...rest} />
		) : (
			<Navigate to="/login" />
		);
	} else {
		return <Navigate to="/login" />;
	}
};

const AdminRoute = ({ element: Element, ...rest }) => {
	let { user } = useContext(AuthContext);

	if (user) {
		return user.role === 3 ? (
			<Element {...rest} />
		) : (
			<Navigate to="/login" />
		);
	} else {
		return <Navigate to="/login" />;
	}
};

const SecretaryOrAdminRoute = ({ element: Element, ...rest }) => {
	let { user } = useContext(AuthContext);

	if (user) {
		return user.role === 2 || user.role === 3 ? (
			<Element {...rest} />
		) : (
			<Navigate to="/login" />
		);
	} else {
		return <Navigate to="/login" />;
	}
};

const TeacherRoute = ({ element: Element, ...rest }) => {
	let { user } = useContext(AuthContext);

	if (user) {
		return user.role === 1 ? (
			<Element {...rest} />
		) : (
			<Navigate to="/login" />
		);
	} else {
		return <Navigate to="/login" />;
	}
};

export {
	AdminRoute,
	TeacherOrSecretaryOrAdminRoute,
	SecretaryOrAdminRoute,
	TeacherRoute,
};
