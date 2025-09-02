'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';

export default function AuthPage() {
  const { login, signup, token } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      if (mode === 'signup') {
        await signup(username, password);
        setMessage('Signup successful. Please log in.');
        setMode('login');
      } else {
        await login(username, password);
        router.push('/dashboard');
      }
    } catch (e: any) {
      setMessage(e?.response?.data?.detail || e?.message || 'Something went wrong');
    }
  }

  if (token) {
    router.replace('/dashboard');
    return null;
  }

  return (
    <div className="card">
      <h2>{mode === 'login' ? 'Login' : 'Create Account'}</h2>
      {message && <p style={{color:'crimson'}}>{message}</p>}
      <form onSubmit={onSubmit}>
        <div className="row">
          <div>
            <label>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
        </div>
        <div className="actions">
          <button type="submit">{mode === 'login' ? 'Login' : 'Sign up'}</button>
          <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Need an account?' : 'Have an account?'}
          </button>
        </div>
      </form>
      <p style={{opacity:.7, marginTop:12}}>Use the navbar after logging in to upload and explore cases.</p>
    </div>
  );
}
