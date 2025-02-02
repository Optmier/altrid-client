/** root url */
const $_root = '/';
/** login default */
const $_loginDefault = `${$_root}login`;
/** login student */
const $_loginStudent = `${$_loginDefault}?user=students`;
/** login teacher */
const $_loginTeacher = `${$_loginDefault}?user=teachers`;
/** login admin */
const $_loginAdmin = `${$_loginDefault}/admins`;
/** class root */
const $_classDefault = `${$_root}class`;

export { $_root, $_loginDefault, $_loginStudent, $_loginTeacher, $_loginAdmin, $_classDefault };
