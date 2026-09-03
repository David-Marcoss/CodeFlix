'use client';
import AuthForm from '../components/auth-form';

export default function RegisterForm() {
  const onSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log('Form submitted');
  };

  return <AuthForm type='register' onSubmit={onSubmit} />;
}
