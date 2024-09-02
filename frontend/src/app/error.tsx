"use client";

import Link from "next/link";

interface Error {
  name: string;
  message: string;
  stack?: string;
}

export default function Error({ error }: { error: Error }) {
  return (
    <main className="flex justify-center items-center flex-col gap-6">
      <h1 className="text-3xl font-semibold">Something went wrong!</h1>
      <p className="text-lg">{error.message}</p>

      <Link href={"/"}>
        <button className="inline-block bg-accent-500 text-primary-800 px-6 py-3 text-lg">
          Try again
        </button>
      </Link>
    </main>
  );
}
