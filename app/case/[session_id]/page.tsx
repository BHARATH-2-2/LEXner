'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Protected from '../../../components/Protected';
import { api } from '../../../lib/api';

type CaseData = {
  case_title: string;
  judges: string[];
  citations: string[];
  acts_sections: string[];
  summary: string;
};

export default function CasePage() {
  const { session_id } = useParams();
  const [data, setData] = useState<CaseData | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [exportUrl, setExportUrl] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/full_case_data', { params: { session_id } });
        setData(res.data);
      } catch (e: any) {
        setErr(e?.response?.data?.detail || 'Failed to fetch');
      }
    }
    load();
  }, [session_id]);

  async function doExport() {
    try {
      const res = await api.get('/export_case', { params: { session_id } });
      setExportUrl(res.data.file_path || null);
    } catch (e: any) {
      setErr(e?.response?.data?.detail || 'Export failed');
    }
  }

  return (
    <Protected>
      <div className="card">
        <h2>Case: {session_id}</h2>
        {!data && !err && <p>Loading...</p>}
        {err && <p style={{color:'crimson'}}>{err}</p>}
        {data && (
          <div className="row">
            <div>
              <h3>Judges</h3>
              <ul>{data.judges.map((j, i) => <li key={i}>{j}</li>)}</ul>
              <h3>Citations</h3>
              <ul>{data.citations.map((c, i) => <li key={i}>{c}</li>)}</ul>
              <h3>Acts & Sections</h3>
              <ul>{data.acts_sections.map((a, i) => <li key={i}>{a}</li>)}</ul>
            </div>
            <div>
              <h3>Summary</h3>
              <p>{data.summary}</p>
            </div>
          </div>
        )}
        <div className="actions" style={{marginTop:12}}>
          <button onClick={doExport}>Export JSON</button>
          {exportUrl && <a className="badge" href={exportUrl} target="_blank" rel="noreferrer">Download Export</a>}
        </div>
      </div>
    </Protected>
  );
}
