import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <h1>Hello, Next.js! <Link href="/about">to about</Link></h1>
    </div>
  );
}
