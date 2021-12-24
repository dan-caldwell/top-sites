import type { NextPage } from 'next'
import Head from 'next/head';
import Search from './search';

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Classic Rank</title>
        <meta name="description" content="Classic Rank website rankings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-4 flex flex-col items-center bg-gray-100">
        <Search />
      </main>
    </>
  )
}

export default Home
