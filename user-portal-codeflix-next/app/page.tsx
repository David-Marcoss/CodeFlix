import Image from 'next/image';

export default function Home() {
  return (
    <main className='min-h-screen overflow-x-hidden bg-[#141414] font-sans'>


      <section className='relative isolate flex h-[100svh] max-h-[56rem] min-h-[38rem] items-end overflow-hidden'>
        <Image
          src='/banner.png'
          fill
          preload
          sizes='100vw'
          alt=''
          className='object-cover object-[68%_center] sm:object-[62%_center] lg:object-center'
        />

        <div
          className='hero-backdrop absolute inset-0 z-0'
          aria-hidden='true'
        />

        <div className='relative z-10 mx-auto flex w-full max-w-7xl px-6 pb-16 sm:px-10 sm:pb-20 lg:px-16 lg:pb-28'>
          <div className='max-w-xl'>
            <div className='mb-5 flex items-center gap-2.5 text-xs font-semibold tracking-[0.24em] text-white/80 sm:text-sm'>
              <span className='h-2 w-2 rounded-full bg-red-600 shadow-[0_0_14px_rgba(220,38,38,0.9)]' />
              SÉRIE ORIGINAL CODEFLIX
            </div>

            <h1 className='text-[clamp(4rem,12vw,8.5rem)] leading-[0.8] font-black tracking-[-0.07em] text-white drop-shadow-[0_5px_24px_rgba(0,0,0,0.65)]'>
              MAID
            </h1>

            <p className='mt-7 max-w-lg text-base leading-relaxed text-white/85 drop-shadow-md sm:text-lg'>
              Depois de fugir de um relacionamento abusivo, uma jovem mãe
              enfrenta trabalhos como empregada doméstica enquanto luta para
              construir um futuro melhor para a filha.
            </p>

            <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4'>
              <button
                type='button'
                className='group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg bg-white px-7 py-3 text-base font-bold text-black shadow-xl transition duration-200 hover:-translate-y-0.5 hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'
              >
                <svg
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                  className='h-5 w-5 fill-current transition-transform duration-200 group-hover:scale-110'
                >
                  <path d='M7 4.8v14.4c0 .8.9 1.3 1.6.9l11-7.2a1.1 1.1 0 0 0 0-1.8l-11-7.2C7.9 3.5 7 4 7 4.8Z' />
                </svg>
                Assistir
              </button>

              <button
                type='button'
                className='inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg bg-white/15 px-7 py-3 text-base font-semibold text-white shadow-xl ring-1 ring-white/20 backdrop-blur-md transition duration-200 ring-inset hover:-translate-y-0.5 hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'
              >
                <svg
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                  fill='none'
                  className='h-5 w-5'
                >
                  <circle
                    cx='12'
                    cy='12'
                    r='9'
                    stroke='currentColor'
                    strokeWidth='2'
                  />
                  <path
                    d='M12 10.5v6M12 7.5h.01'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                </svg>
                Mais informações
              </button>
            </div>
          </div>
        </div>

        <div
          className='absolute inset-x-0 bottom-0 z-10 h-px bg-linear-to-r from-transparent via-white/15 to-transparent'
          aria-hidden='true'
        />
      </section>

      <div className='h-screen flex items-center justify-center'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate et incidunt nemo officiis sed corporis sapiente, ratione fugit asperiores omnis amet, modi numquam accusamus? Eius facere totam soluta nobis debitis!
      </div>
    </main>
  );
}
