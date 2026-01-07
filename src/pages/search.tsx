import Head from "next/head";

import { Search } from "@/components/Search";
import { RequireAuthentication } from "@/components/RequireAuthentication";

import { METADATA } from "../../static";

export default function SearchPage() {
  return (
    <>
      <Head>
        <title>{METADATA.title} | Search</title>
      </Head>
      <RequireAuthentication>
        <Search />
      </RequireAuthentication>
    </>
  );
}
