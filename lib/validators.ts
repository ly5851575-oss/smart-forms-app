// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Check if passwords match
export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

// Get error message for email
export const getEmailError = (email: string): string | null => {
  if (!email) {
    return 'البريد الإلكتروني مطلوب';
  }
  if (!isValidEmail(email)) {
    return 'البريد الإلكتروني غير صحيح';
  }
  return null;
};

// Get error message for password
export const getPasswordError = (password: string): string | null => {
  if (!password) {
    return 'كلمة المرور مطلوبة';
  }
  if (!isValidPassword(password)) {
    return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
  }
  return null;
};

// Get error message for confirm password
export const getConfirmPasswordError = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return 'تأكيد كلمة المرور مطلوب';
  }
  if (!passwordsMatch(password, confirmPassword)) {
    return 'كلمات المرور غير متطابقة';
  }
  return null;
};

// Get error message for name
export const getNameError = (name: string): string | null => {
  if (!name) {
    return 'الاسم الكامل مطلوب';
  }
  if (name.length < 3) {
    return 'الاسم يجب أن يكون 3 أحرف على الأقل';
  }
  return null;
};
