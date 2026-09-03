'use client';
import InputField from '@/app/components/input-field';

export default function ForgotPasswordForm() {
  const onSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log('Form submitted');
  };

  return (
    <div className='flex w-full max-w-[450px] flex-col items-center justify-center rounded-lg bg-[#141414ef] p-8 shadow-lg'>
      <div className='w-full'>
        <h1 className='text-start text-[2rem] font-extrabold text-white'>
          Esqueceu sua Senha?
        </h1>
      </div>

      <div className='w-full'>
        <h2 className='flex text-start text-[1rem] text-gray-300'>
          Não se preocupe! Digite seu email para redefinir sua senha
        </h2>
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

        <button
          type='submit'
          className='rounded-lg bg-red-600 p-3 text-lg font-extrabold hover:bg-red-700'
          onClick={onSubmit}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
