import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth-store';
import { useT } from '@/store/lang-store';

const Login = () => {
  const navigate = useNavigate();
  const { loginWithFacebook, isAuthenticated, user } = useAuthStore();
  const [phone, setPhone] = useState('');
  const t = useT();

  if (isAuthenticated && user) {
    navigate(user.role === 'admin' ? '/admin' : '/account');
    return null;
  }

  const handleFacebook = () => {
    loginWithFacebook();
    navigate('/account');
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) {
      navigate('/verify-otp', { state: { phone } });
    }
  };

  return (
    <Layout>
      <div className="container max-w-md py-20">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold">{t('login.title')} <span className="text-primary">FROG</span>WARD</h1>
          <p className="text-muted-foreground mt-2 text-sm">{t('login.desc')}</p>
        </div>

        <div className="space-y-6">
          <Button
            onClick={handleFacebook}
            className="w-full h-12 font-heading font-semibold bg-[hsl(220,60%,50%)] hover:bg-[hsl(220,60%,45%)] text-foreground"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            {t('login.facebook')}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-4 text-muted-foreground uppercase tracking-wider">{t('login.or')}</span>
            </div>
          </div>

          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t('login.phoneLabel')}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+976 9911 2233"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" variant="outline" className="w-full h-12 font-heading font-semibold">
              {t('login.phoneOtp')}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Admin: <span className="text-primary font-mono">99112233</span> · OTP: <span className="text-primary font-mono">123456</span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
