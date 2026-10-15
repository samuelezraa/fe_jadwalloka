import React, { useState } from 'react';
import { User, KeyRound, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { FormInput } from '@/components/ui/FormInput';
import { Button } from '@/components/ui/button';

interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
  isLoading?: boolean;
  errorMessage?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  errorMessage = '',
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const activeError = errorMessage || localError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    onSubmit(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
      {/* Alert Pesan Error jika Username/Password Salah */}
      {activeError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-red-600 dark:text-red-400 text-xs animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{activeError}</span>
        </div>
      )}

      {/* Input Username */}
      <FormInput
        label="Username"
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          if (localError) setLocalError('');
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
          if (localError) setLocalError('');
        }}
        placeholder="Masukan password"
        required
        leftIcon={<KeyRound className="w-4 h-4 text-gray-700 fill-gray-700" />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-700 hover:text-black focus:outline-none transition-colors"
          >
            {showPassword ? (
              <Eye className="w-4 h-4 text-gray-700" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-700" />
            )}
          </button>
        }
      />

      {/* Tombol Submit Login */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-[#0f9468] hover:bg-[#0c7a56] text-white font-semibold text-sm rounded-xl transition-colors shadow-sm focus:outline-none mt-2 disabled:opacity-70"
      >
        {isLoading ? 'Memproses...' : 'Login'}
      </Button>
    </form>
  );
};