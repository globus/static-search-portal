import Head from "next/head";

import { Search } from "@/components/Search";
import { RequireAuthentication } from "@/components/RequireAuthentication";
import { getMetadata } from "@from-static/generator-kit";

export default function SearchPage() {
  return (
    <>
      <Head>
        <title>{getMetadata().title} | Search</title>
      </Head>
      <RequireAuthentication>
        <Search />
      </RequireAuthentication>
    </>
  );
}
