import Head from "next/head";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div>
      <Head>
        <title>chatty</title>
        <meta
          name="description"
          content="chat app using firebase and next js"
        />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <Sidebar />
    </div>
  );
}
