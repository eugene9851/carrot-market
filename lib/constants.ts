export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_REGEX = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
export const PASSWORD_REGEX_ERROR = "A password must have lowercase, uppercase, number, and special characters."