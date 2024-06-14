import { Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

const TeacherOrSecretaryOrAdminRoute = ({ element: Element, ...rest }) => {
	const { user } = useContext(AuthContext);
	const { addNotification } = useNotification();

	useEffect(() => {
		if (!user) {
			addNotification("Bitte logge dich zuerst ein!", "error");
		} else if (!(user.role === 1 || user.role === 2 || user.role === 3)) {
			addNotification("Nicht die nötige Berechtigung.", "error");
		}
	}, [user, addNotification]);

	if (!user) {
		return <Navigate to="/rolelogin" />;
	} else if (user.role === 1 || user.role === 2 || user.role === 3) {
		return <Element {...rest} />;
	} else {
		return <Navigate to="/rolelogin" />;
	}
};

const AdminRoute = ({ element: Element, ...rest }) => {
	const { user } = useContext(AuthContext);
	const { addNotification } = useNotification();

	useEffect(() => {
		if (!user) {
			addNotification("Bitte logge dich zuerst ein!", "error");
		} else if (user.role !== 3) {
			addNotification("Nicht die nötige Berechtigung.", "error");
		}
	}, [user, addNotification]);

	if (!user) {
		return <Navigate to="/rolelogin" />;
	} else if (user.role === 3) {
		return <Element {...rest} />;
	} else {
		return <Navigate to="/rolelogin" />;
	}
};

const SecretaryOrAdminRoute = ({ element: Element, ...rest }) => {
	const { user } = useContext(AuthContext);
	const { addNotification } = useNotification();

	useEffect(() => {
		if (!user) {
			addNotification("Bitte logge dich zuerst ein!", "error");
		} else if (!(user.role === 2 || user.role === 3)) {
			addNotification("Nicht die nötige Berechtigung.", "error");
		}
	}, [user, addNotification]);

	if (!user) {
		return <Navigate to="/rolelogin" />;
	} else if (user.role === 2 || user.role === 3) {
		return <Element {...rest} />;
	} else {
		return <Navigate to="/rolelogin" />;
	}
};

const TeacherOrAdminRoute = ({ element: Element, ...rest }) => {
	const { user } = useContext(AuthContext);
	const { addNotification } = useNotification();

	useEffect(() => {
		if (!user) {
			addNotification("Bitte logge dich zuerst ein!", "error");
		} else if (!(user.role === 1 || user.role === 3)) {
			addNotification("Nicht die nötige Berechtigung.", "error");
		}
	}, [user, addNotification]);

	if (!user) {
		return <Navigate to="/rolelogin" />;
	} else if (user.role === 1 || user.role === 3) {
		return <Element {...rest} />;
	} else {
		return <Navigate to="/rolelogin" />;
	}
};

const TeacherRoute = ({ element: Element, ...rest }) => {
	const { user } = useContext(AuthContext);
	const { addNotification } = useNotification();

	useEffect(() => {
		if (!user) {
			addNotification("Bitte logge dich zuerst ein!", "error");
		} else if (user.role !== 1) {
			addNotification("Nicht die nötige Berechtigung.", "error");
		}
	}, [user, addNotification]);

	if (!user) {
		return <Navigate to="/rolelogin" />;
	} else if (user.role !== 1) {
		return <Navigate to="/rolelogin" />;
	} else {
		return <Element {...rest} />;
	}
};

const StudentRoute = ({ element: Element, ...rest }) => {
	const { user } = useContext(AuthContext);
	const { addNotification } = useNotification();

	useEffect(() => {
		if (!user) {
			addNotification("Bitte logge dich zuerst ein!", "error");
		} else if (user.role !== 10) {
			addNotification("Nicht die nötige Berechtigung.", "error");
		}
	}, [user, addNotification]);

	if (!user) {
		return <Navigate to="/login" />;
	} else if (user.role !== 10) {
		return <Navigate to="/login" />;
	} else {
		return <Element {...rest} />;
	}
};

export {
	AdminRoute,
	TeacherOrSecretaryOrAdminRoute,
	TeacherOrAdminRoute,
	SecretaryOrAdminRoute,
	TeacherRoute,
	StudentRoute,
};
