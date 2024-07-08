
import Header from '@/assets/header';
import Link from 'next/link';

export default function Page() {
  return (
    <div>
      <Header/>
      <h1>Welcome to my app!</h1>
      <Link href="/authentication" prefetch={true}>
      Dashboard
    </Link>
    </div>
  );
}