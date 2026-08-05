export interface AppError {
  code: string;
  message: string;
  originalError?: any;
}

export function parseSupabaseError(error: any): AppError {
  if (!error) {
    return { code: 'UNKNOWN_ERROR', message: 'An unknown error occurred' };
  }

  const message = error.message || error.error_description || 'Operation failed';
  const code = error.code || error.status || 'API_ERROR';

  if (message.includes('Invalid login credentials')) {
    return { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password. Please try again.', originalError: error };
  }
  if (message.includes('Email not confirmed')) {
    return { code: 'EMAIL_NOT_CONFIRMED', message: 'Please confirm your email address before logging in.', originalError: error };
  }
  if (message.includes('row-level security')) {
    return { code: 'PERMISSION_DENIED', message: 'You do not have permission to perform this action.', originalError: error };
  }

  return { code: String(code), message, originalError: error };
}
