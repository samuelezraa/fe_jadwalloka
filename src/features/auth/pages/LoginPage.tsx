import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, KeyRound, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { FormInput } from '@/components/ui/FormInput';
import { Button } from '@/components/ui/button';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // State untuk menyimpan pesan error validasi
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Reset pesan error saat submit ulang

    // Contoh data kredensial dummy (sesuai kebutuhan Anda)
    const VALID_USERNAME = 'admin';
    const VALID_PASSWORD = 'password123';

    setIsLoading(true);

    setTimeout(() => {
      // Validasi Username & Password
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        setIsLoading(false);
        navigate('/dashboard'); // Navigasi ke dashboard jika benar
      } else {
        setIsLoading(false);
        // Tampilkan pesan error jika salah
        setErrorMessage('Username atau password yang Anda masukkan salah!');
      }
    }, 600); // Simulasi delay loading request
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative font-sans"
      style={{
        backgroundImage: "url('/background_login.jpg')",
      }}
    >
      <div className="w-full max-w-[380px] flex flex-col items-center">
        
        {/* Logo Saloka Melayang */}
        <div className="mb-5 flex justify-center">
          <img 
            src="/saloka-icon.png" 
            alt="Saloka Logo" 
            className="h-10 md:h-11 object-contain"
          />
        </div>

        {/* Card Form Login */}
        <div className="w-full bg-white dark:bg-gray-900 rounded-2xl p-7 shadow-xl border border-gray-100/80 dark:border-gray-800 space-y-5 transition-all">
          
          <div className="text-left space-y-1.5">
            <h1 className="text-[22px] font-bold text-[#0d8a6a] tracking-tight leading-tight">
              Login LokaHR
            </h1>
            <p className="text-[12px] text-gray-400 font-normal leading-relaxed">
              Sugeng Rawuh, silahkan berikan informasi untuk akses aplikasi 👋
            </p>
          </div>

          {/* Alert Pesan Error jika Username/Password Salah */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-red-600 dark:text-red-400 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            
            {/* Input Username */}
            <FormInput
              label="Username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errorMessage) setErrorMessage(''); // Hapus pesan error saat pengguna mengetik ulang
              }}
              placeholder="Masukan username"
              required
              leftIcon={<User className="w-4 h-4 text-gray-700 fill-gray-700" />}
            />

            {/* Input Password */}
            <FormInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage(''); // Hapus pesan error saat pengguna mengetik ulang
              }}
              placeholder="Masukan password"
              required
              leftIcon={<KeyRound className="w-4 h-4 text-gray-700 fill-gray-700" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-800 hover:text-black focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4 fill-gray-800 text-white" />
                  )}
                </button>
              }
            />

            {/* Tombol Submit Login */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#0d8a6a] hover:bg-[#0a7358] text-white font-semibold text-xs rounded-xl transition-colors shadow-sm focus:outline-none mt-2 disabled:opacity-70"
            >
              {isLoading ? 'Memproses...' : 'Login'}
            </Button>

          </form>
        </div>

      </div>
    </div>
  );
};