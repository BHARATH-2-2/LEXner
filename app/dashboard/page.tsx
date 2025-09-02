'use client';

import Protected from '../../components/Protected';
import Link from 'next/link';
import { newSessionId } from '../../lib/session';

export default function Dashboard() {
  const sid = newSessionId();
  return (
    <Protected>
      <div className="card">
        <h2>Welcome to LEXner</h2>
        <p>Create a new session to upload a PDF or paste text.</p>
        <div className="actions">
          <Link className="badge" href={`/upload?session_id=${sid}`}>Start new session</Link>
          <Link className="badge" href="/graph">View Graph</Link>
        </div>
      </div>
    </Protected>
  );
}
