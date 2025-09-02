'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import Protected from '../../components/Protected';
import { api } from '../../lib/api';

const ForceGraph2D = dynamic(() => import('react-force-graph').then(m => m.ForceGraph2D), { ssr: false });

type GraphRecord = {
  session_id: string;
  case_title: string;
  relation: string;
  entity_name: string;
  entity_type: string[];
};

type GraphData = { nodes: any[]; links: any[] };

function toGraph(rows: GraphRecord[]): GraphData {
  const nodesMap = new Map<string, any>();
  const links: any[] = [];

  function addNode(id: string, group: string, label?: string) {
    if (!nodesMap.has(id)) {
      nodesMap.set(id, { id, group, label: label || id });
    }
  }

  rows.forEach((r) => {
    const caseId = `case:${r.session_id}`;
    addNode(caseId, 'Case', r.case_title);

    const label = (r.entity_type && r.entity_type[0]) || 'Entity';
    const entId = `${label}:${r.entity_name}`;
    addNode(entId, label, r.entity_name);
    links.push({ source: label === 'Judge' ? entId : caseId, target: label === 'Judge' ? caseId : entId, rel: r.relation });
  });

  return { nodes: Array.from(nodesMap.values()), links };
}

export default function GraphPage() {
  const [data, setData] = useState<GraphData | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [sessionIdFilter, setSessionIdFilter] = useState<string>('');

  async function load() {
    try {
      const res = await api.get('/graph', { params: sessionIdFilter ? { session_id: sessionIdFilter } : {} });
      const rows = (res.data.graph || []) as GraphRecord[];
      setData(toGraph(rows));
    } catch (e: any) {
      setErr(e?.response?.data?.detail || 'Failed to load graph');
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <Protected>
      <div className="card">
        <h2>Graph</h2>
        <div className="actions">
          <input placeholder="Filter by session_id (optional)" value={sessionIdFilter} onChange={e => setSessionIdFilter(e.target.value)} />
          <button onClick={load}>Reload</button>
        </div>
        {err && <p style={{color:'crimson'}}>{err}</p>}
        <div style={{ height: '70vh', border: '1px solid #eee', borderRadius: 12, marginTop: 12 }}>
          {data && <ForceGraph2D
            graphData={data}
            nodeLabel={(n: any) => `${n.group}: ${n.label}`}
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}
          />}
        </div>
      </div>
    </Protected>
  );
}
