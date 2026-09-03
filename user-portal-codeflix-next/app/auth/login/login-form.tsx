'use client';
import { useRouter } from 'next/navigation';
import AuthForm from '../components/auth-form';

export default function LoginForm() {
  const router = useRouter();

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget.form!);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch('/auth/login/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer login');
      }

      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return <AuthForm type='login' onSubmit={onSubmit} />;
}
