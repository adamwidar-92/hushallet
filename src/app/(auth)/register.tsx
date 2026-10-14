import { useAuth } from '@/features/auth/AuthProvider';

import { AuthForm } from '@/features/auth/AuthForm';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  return <AuthForm mode="register" onSubmit={({ email, password, name }) => signUp(email, password, name)} />;
}
