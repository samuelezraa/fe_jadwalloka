import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { authService } from '@/features/auth/services/auth.service';

export const LoginPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await authService.login(username, password);

      if (response.success) {
        // 🟢 Perbaikan: Mengambil token dari response.data.token sesuai struktur interface LoginResponse
        const token = response.data?.token;

        if (token) {
          localStorage.setItem('token', token);
        }
        
        // Arahkan ke halaman utama/dashboard setelah berhasil login
          navigate('/dashboard');
      } else {
        setErrorMessage(response.message || 'Login gagal.');
      }
    } catch (error: any) {
      // Menangkap pesan error dari response backend (misal status 401)
      const serverMessage = error.response?.data?.message;
      setErrorMessage(serverMessage || 'Terjadi kesalahan pada server. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative font-sans"
      style={{
        backgroundImage: "url('/background_login.jpg')",
      }}
    >
      <div className="w-full max-w-[390px] flex flex-col items-center">
        
        {/* Logo Saloka Melayang di Atas Card */}
        <div className="mb-6 flex justify-center">
          <img 
            src="/saloka-icon.png" 
            alt="Saloka Logo" 
            className="h-11 object-contain"
          />
        </div>

        {/* Card Form Login */}
        <div className="w-full bg-white dark:bg-gray-900 rounded-2xl p-7 shadow-xl border border-gray-100/80 dark:border-gray-800 space-y-5 transition-all">
          
          <div className="text-left space-y-1.5 font-sans">
            <h1 className="text-[22px] font-medium text-[#0f9468] tracking-tight leading-tight">
              Login LokaHR
            </h1>
            <p className="text-[12px] text-gray-400 font-normal leading-relaxed">
              Sugeng Rawuh, silahkan berikan informasi untuk akses aplikasi 👋
            </p>
          </div>

          {/* Form Login Component */}
          <LoginForm 
            onSubmit={handleLogin}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />

        </div>

      </div>
    </div>
  );
};

export default LoginPage;