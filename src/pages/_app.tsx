import { AppProps } from "next/app";
import Head from "next/head";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>The Lost Rabbit</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
      </Head>
      <Component {...pageProps}></Component>
    </>
  );
}
