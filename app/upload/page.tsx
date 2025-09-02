'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Protected from '../../components/Protected';
import { api } from '../../lib/api';

export default function UploadPage() {
  const params = useSearchParams();
  const router = useRouter();
  const session_id = useMemo(() => params.get('session_id') || '', [params]);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!session_id) {
      setStatus('Missing session_id in URL. Go back to Dashboard to create one.');
    }
  }, [session_id]);

  async function uploadPdf() {
    if (!file || !session_id) return;
    setStatus('Uploading PDF...');
    const form = new FormData();
    form.set('session_id', session_id);
    form.set('file', file);
    try {
      await api.post('/upload', form);
      setStatus('Uploaded. Parsing and NER done.');
    } catch (e: any) {
      setStatus(e?.response?.data?.detail || 'Upload failed');
    }
  }

  async function pasteText() {
    if (!text || !session_id) return;
    setStatus('Sending text...');
    try {
      await api.post('/paste_text', [{ session_id, text }]);
      setStatus('Text stored and processed.');
    } catch (e: any) {
      setStatus(e?.response?.data?.detail || 'Paste failed');
    }
  }

  function viewCase() {
    router.push(`/case/${session_id}`);
  }

  return (
    <Protected>
      <div className="card">
        <h2>Upload PDF</h2>
        <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
        <div className="actions">
          <button onClick={uploadPdf} disabled={!file || !session_id}>Upload</button>
        </div>
      </div>

      <div className="card">
        <h2>Or Paste Text</h2>
        <textarea rows={10} value={text} onChange={e => setText(e.target.value)} placeholder="Paste your judgment text here" />
        <div className="actions">
          <button onClick={pasteText} disabled={!text || !session_id}>Save Text</button>
        </div>
      </div>

      <div className="card">
        <div className="actions">
          <button onClick={viewCase} disabled={!session_id}>View Case Data</button>
        </div>
        {status && <p>{status}</p>}
      </div>
    </Protected>
  );
}
