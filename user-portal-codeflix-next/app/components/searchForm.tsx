'use client';
import { Search } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export function SearchForm() {
  const searchParam = useSearchParams();
  const navigate = useRouter();
  const currentSearch = searchParam.get('title');

  const [showSearchForm, setShowSearchForm] = useState(false);
  const [searchValue, setSearchValue] = useState<string>(currentSearch ?? '');

  const onChangeSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const onSubmitSearchForm = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParam.toString());
    params.set('title', searchValue);
    navigate.push(`/search?${params.toString()}`);
  };

  return !showSearchForm ? (
    <button
      className='cursor-pointer p-2 hover:rounded-full hover:bg-gray-500'
      onClick={() => setShowSearchForm(!showSearchForm)}
    >
      <Search width={30} height={30} />
    </button>
  ) : (
    <form
      className='flex w-96 flex-row items-center justify-start gap-4 rounded-4xl border border-gray-600 px-4 py-2'
      onSubmit={onSubmitSearchForm}
    >
      <Search width={30} height={30} />
      <input
        type='text'
        className='flex-1 border-none p-1 text-lg outline-none focus:ring-0'
        placeholder='Títulos, Generos, etc'
        onChange={(e) => onChangeSearchValue(e.target.value)}
      />
    </form>
  );
}
