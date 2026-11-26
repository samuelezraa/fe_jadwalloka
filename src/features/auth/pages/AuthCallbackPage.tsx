import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/features/auth/services/auth.service';
import { getDefaultHomeRoute } from '@/utils/departmentAccess';

export const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const idkaryawan = searchParams.get('idkaryawan') || searchParams.get('idkaryawanl') || '';
    const password = searchParams.get('password') || '';
    const id_departemen = searchParams.get('id_departemen') || '';
    const departemen = searchParams.get('departemen') || '';

    if (!idkaryawan || !password) {
      navigate('/login', { replace: true });
      return;
    }

    const doAuth = async () => {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        const response = await authService.loginByUrl({
          idkaryawan,
          password,
          id_departemen,
          departemen,
        });

        if (response.success && response.data?.token && response.data?.user) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          navigate(getDefaultHomeRoute(response.data.user), { replace: true });
        } else {
          setError(response.message || 'Autentikasi URL gagal.');
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Autentikasi URL gagal.');
      }
    };

    doAuth();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
      {error ? (
        <div className="max-w-sm w-full bg-white dark:bg-gray-900 p-6 rounded-2xl border border-red-200 dark:border-red-900 text-center space-y-3">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/login', { replace: true })}
            className="px-4 py-2 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Kembali ke Halaman Login
          </button>
        </div>
      ) : (
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          Memverifikasi akses pengguna...
        </p>
      )}
    </div>
  );
};

export default AuthCallbackPage;