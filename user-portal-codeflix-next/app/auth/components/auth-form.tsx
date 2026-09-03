'use client';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import InputField from '@/app/components/input-field';
import { useState } from 'react';

type AuthFormProps = {
  type: 'login' | 'register';
  onSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className='flex w-full max-w-[450px] flex-col items-center justify-center rounded-lg bg-[#141414ef] p-8 shadow-lg'>
      <div className='w-full'>
        <h1 className='text-start text-[2rem] font-extrabold text-white'>
          {type === 'login'
            ? 'Informe seus dados para entrar'
            : 'Crie sua conta'}
        </h1>
      </div>

      <div className='w-full'>
        <div className='flex text-start text-[1rem]'>
          {type === 'login' ? (
            <p className='text-gray-300'>
              Não tem uma conta?{' '}
              <Link
                href='/auth/register'
                className='font-extrabold text-red-800 hover:text-red-900'
              >
                Registre-se
              </Link>
            </p>
          ) : (
            <p className='text-gray-300'>
              Já tem uma conta?{' '}
              <Link
                href='/auth/login'
                className='font-extrabold text-red-800 hover:text-red-900'
              >
                Entre aqui
              </Link>
            </p>
          )}
        </div>
      </div>

      <form
        action='/login'
        method='POST'
        className='mt-10 flex w-full flex-col gap-4'
      >
        <InputField
          id='email'
          type='email'
          name='email'
          autoComplete='email'
          placeholder='Digite seu email'
          label='Email'
          required
        />

        <InputField
          id='password'
          type='password'
          name='password'
          autoComplete='current-password'
          placeholder='Digite sua senha'
          label='Senha'
          required
        />

        {type === 'register' && (
          <InputField
            id='confirm_password'
            type='password'
            name='confirm_password'
            autoComplete='current-password'
            placeholder='Confirme sua senha'
            label='Confirmar Senha'
            required
          />
        )}

        <button
          type='submit'
          className='rounded-lg bg-red-600 p-3 text-lg font-extrabold hover:bg-red-700'
          onClick={onSubmit}
        >
          {type === 'login' ? 'Entrar' : 'Registrar'}
        </button>
      </form>

      {type === 'login' && (
        <div className='my-12 flex w-full flex-col items-start'>
          <button
            type='button'
            aria-expanded={showHelp}
            aria-controls='register-help'
            className='flex items-center gap-2'
            onClick={() => setShowHelp(!showHelp)}
          >
            <h3 className='text-lg font-bold'>Ajuda</h3>
            {showHelp ? (
              <ChevronUp className='h-5 w-5' />
            ) : (
              <ChevronDown className='h-5 w-5' />
            )}
          </button>
          {showHelp && (
            <div id='register-help' className='flex flex-col gap-2'>
              <a href='/auth/forgot-password' className='underline hover:text-gray-400'>
                Esqueceu o email ou número de celular?
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
