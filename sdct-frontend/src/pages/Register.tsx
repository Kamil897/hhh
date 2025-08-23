import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Пароли не совпадают');
      return;
    }
    try {
      const res = await axios.post('/api/auth/register', { email, password });
      localStorage.setItem('token', res.data.access_token);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Register failed');
    }
  }

  return (
    <div className="container flex items-center justify-center h-screen">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Регистрация</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Пароль (мин. 6)" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Input type="password" placeholder="Повторите пароль" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button variant="secondary" type="submit" className="w-full">Зарегистрироваться</Button>
        </form>
        <p className="text-sm mt-3 text-center">Уже есть аккаунт? <Link to="/login" className="underline">Войти</Link></p>
      </div>
    </div>
  );
}