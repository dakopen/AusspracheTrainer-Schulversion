const isTeacher = (user) => user?.role === 1;

const isSecretary = (user) => user?.role === 2;

const isAdmin = (user) => user?.role === 3;

const isStudyStudent = (user) => user?.role === 10;

const isTeacherOrSecretary = (user) => isTeacher(user) || isSecretary(user);

const isTeacherOrAdmin = (user) => isTeacher(user) || isAdmin(user);

const isSecretaryOrAdmin = (user) => isSecretary(user) || isAdmin(user);

const isTeacherOrSecretaryOrAdmin = (user) =>
	isTeacher(user) || isSecretary(user) || isAdmin(user);

const isNotLoggedIn = (user) => !user;

export {
	isTeacher,
	isSecretary,
	isAdmin,
	isStudyStudent,
	isTeacherOrSecretary,
	isTeacherOrAdmin,
	isSecretaryOrAdmin,
	isTeacherOrSecretaryOrAdmin,
	isNotLoggedIn,
};
