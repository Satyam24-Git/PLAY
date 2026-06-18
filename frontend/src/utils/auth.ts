// Simple in-memory store for demo purposes.
// In a real app, use SecureStore or AsyncStorage.
let userId: string | null = null;
let userEmail: string | null = null;

export const setSession = (id: string, email: string) => {
  userId = id;
  userEmail = email;
};

export const getUserId = () => userId;
export const getUserEmail = () => userEmail;
