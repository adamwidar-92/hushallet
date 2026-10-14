import { useAuth } from '@/features/auth/AuthProvider';

import { AuthForm } from '@/features/auth/AuthForm';

export default function LoginScreen() {
  const { signIn } = useAuth();
  return <AuthForm mode="login" onSubmit={({ email, password }) => signIn(email, password)} />;
}
