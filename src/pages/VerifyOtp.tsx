import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth-store';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = (location.state as { phone?: string })?.phone || '';
  const { loginWithOtp, isAuthenticated, user } = useAuthStore();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    if (!phone) {
      navigate('/login');
    }
  }, [phone, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'admin' ? '/admin' : '/account');
    }
  }, [isAuthenticated, user, navigate]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter a 6-digit code.');
      return;
    }
    if (code !== '123456') {
      setError('Invalid code. Try 123456.');
      return;
    }
    loginWithOtp(phone);
  };

  const handleResend = () => {
    setResendTimer(30);
    setError('');
  };

  return (
    <Layout>
      <div className="container max-w-md py-20">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold">Verify Your Phone</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            We sent a 6-digit code to <span className="text-foreground font-medium">{phone}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                setError('');
              }}
              className="text-center text-2xl tracking-[0.5em] font-heading font-bold h-14"
            />
            {error && <p className="text-destructive text-sm text-center">{error}</p>}
          </div>

          <Button type="submit" className="w-full h-12 font-heading font-semibold">
            Verify Code
          </Button>

          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-sm text-muted-foreground">
                Resend code in <span className="text-foreground font-medium">{resendTimer}s</span>
              </p>
            ) : (
              <button type="button" onClick={handleResend} className="text-sm text-primary hover:underline">
                Resend Code
              </button>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Mock OTP: <span className="text-primary font-mono">123456</span>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default VerifyOtp;
