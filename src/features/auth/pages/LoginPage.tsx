import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm'; // Sesuaikan path ini dengan letak LoginForm kamu

export const LoginPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (username: string, password: string) => {
    setErrorMessage('');

    const VALID_USERNAME = 'admin';
    const VALID_PASSWORD = 'password123';

    setIsLoading(true);

    setTimeout(() => {
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        setIsLoading(false);
        navigate('/dashboard');
      } else {
        setIsLoading(false);
        setErrorMessage('Username atau password yang Anda masukkan salah!');
      }
    }, 600);
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
          {/* Mengubah font-bold menjadi font-semibold */}
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