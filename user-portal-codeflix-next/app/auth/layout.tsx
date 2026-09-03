type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {


  return (
    <div
      className='flex min-h-screen w-full flex-col'
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <header className='w-full px-6 py-6 sm:px-12 lg:px-20'>
        <div className='text-4xl font-bold text-red-700 sm:text-5xl'>
          Codeflix
        </div>
      </header>

      <main className='flex flex-1 items-center justify-center px-4 py-8 sm:px-6'>
        {children}
      </main>
    </div>
  );
}
