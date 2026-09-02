'use client';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { useScroll } from '../hooks/useScroll';

export function Header() {
  const isScroled = useScroll();

  return (
    <header
      className={`${isScroled && 'bg-black transition-all'} fixed top-0 z-50 flex w-full`}
    >
      <nav className='w-full'>
        <ul className='mx-20 flex flex-row justify-between px-10 py-3'>
          <div className='flex items-center'>
            <li className='p-4'>
              <Image
                alt='codeflix-logo'
                src={'/codeflix-logo.png'}
                width={100}
                height={100}
              />
            </li>
            <li className='px-4 py-2 text-lg text-gray-300 hover:rounded-4xl hover:bg-gray-600 hover:font-bold hover:text-white hover:opacity-50'>
              Início
            </li>
            <li className='px-4 py-2 text-lg text-gray-300 hover:rounded-4xl hover:bg-gray-600 hover:font-bold hover:text-white hover:opacity-50'>
              Séries
            </li>
            <li className='px-4 py-2 text-lg text-gray-300 hover:rounded-4xl hover:bg-gray-600 hover:font-bold hover:text-white hover:opacity-50'>
              Filmes
            </li>
            <li className='px-4 py-2 text-lg text-gray-300 hover:rounded-4xl hover:bg-gray-600 hover:font-bold hover:text-white hover:opacity-50'>
              Bombando
            </li>
            <li className='px-4 py-2 text-lg text-gray-300 hover:rounded-4xl hover:bg-gray-600 hover:font-bold hover:text-white hover:opacity-50'>
              Minha Lista
            </li>
          </div>

          <div className='flex items-center gap-8'>
            <li className='p-2 hover:rounded-full hover:bg-gray-500'>
              <Search width={30} height={30} />
            </li>
            <li>
              <Image
                alt='profile'
                src={'/profile.png'}
                width={40}
                height={60}
                className='rounded-md'
              />
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
}
