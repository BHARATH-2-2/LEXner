'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';

export default function Nav() {
  const { token, logout } = useAuth();
  return (
    <nav>
      <Link href="/">LEXner</Link>
      <Link href="/upload">Upload</Link>
      <Link href="/graph">Graph</Link>
      {token ? (
        <>
          <span className="badge">Signed in</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link href="/">Login</Link>
      )}
    </nav>
  );
}
