export interface User {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
}

export interface Credentials {
  email?: string;
  password: string; // Password for email or OTP for phone
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
}

export type AuthFunction = (
  credentials: Credentials,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => Promise<void>;



export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
};
