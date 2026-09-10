'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useScroll } from '../hooks/useScroll';
import { SearchForm } from './searchForm';

export function Header() {
  const isScroled = useScroll();

  return (
    <header
      className={`${isScroled && 'bg-black transition-all'} fixed top-0 z-50 flex w-full`}
    >
      <nav className='w-full'>
        <div className='mx-20 flex flex-row justify-between px-10 py-3'>
          <div className='flex items-center'>
            <Link href='/' className='p-4' aria-label='Ir para o início'>
              <Image
                alt='codeflix-logo'
                src={'/codeflix-logo.png'}
                width={100}
                height={100}
              />
            </Link>
            <Link
              href='/'
              className='px-4 py-2 text-lg text-gray-300 hover:rounded-4xl hover:bg-gray-600 hover:font-bold hover:text-white hover:opacity-50'
            >
              Início
            </Link>
            <Link
              href='/search?genre=Action'
              className='px-4 py-2 text-lg text-gray-300 hover:rounded-4xl hover:bg-gray-600 hover:font-bold hover:text-white hover:opacity-50'
            >
              Ação
            </Link>
            <Link
              href='/search?genre=Comedy'
              className='px-4 py-2 text-lg text-gray-300 hover:rounded-4xl hover:bg-gray-600 hover:font-bold hover:text-white hover:opacity-50'
            >
              Comédia
            </Link>
            <Link
              href='/search?genre=Animation'
              className='px-4 py-2 text-lg text-gray-300 hover:rounded-4xl hover:bg-gray-600 hover:font-bold hover:text-white hover:opacity-50'
            >
              Animação
            </Link>
            <Link
              href='/search?genre=Horror'
              className='px-4 py-2 text-lg text-gray-300 hover:rounded-4xl hover:bg-gray-600 hover:font-bold hover:text-white hover:opacity-50'
            >
              Terror
            </Link>
          </div>

          <div className='flex items-center gap-8'>
            <div>
              <SearchForm />
            </div>
            <div>
              <Image
                alt='profile'
                src={'/profile.png'}
                width={40}
                height={60}
                className='rounded-md'
              />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
