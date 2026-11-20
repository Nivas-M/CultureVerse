import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please verify that both passwords are identical.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      toast({
        title: 'Account created',
        description: 'Welcome to CultureVerse.',
      });
      navigate('/', { replace: true });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F0E7] px-4 py-12 text-[#2B211B]">
      <div className="w-full max-w-md bg-white border border-[#D8CEBE] p-8 sm:p-10 rounded-sm shadow-sm space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-[#24170F] text-[#F5F0E7] rounded-sm flex items-center justify-center">
              <span className="font-serif text-2xl">ॐ</span>
            </div>
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#C9562D] block">
            CultureVerse Sanctuary
          </span>
          <h1 className="text-3xl font-serif font-light text-[#24170F]">Join CultureVerse</h1>
          <p className="text-xs text-[#756B62]">Create an account to book experiences, track festivals, and save temple journeys</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs font-mono uppercase tracking-wider text-[#756B62]">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xs bg-[#F5F0E7] border-[#D8CEBE] rounded-sm text-[#2B211B] h-10"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-[#756B62]">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-xs bg-[#F5F0E7] border-[#D8CEBE] rounded-sm text-[#2B211B] h-10"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-xs font-mono uppercase tracking-wider text-[#756B62]">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-xs bg-[#F5F0E7] border-[#D8CEBE] rounded-sm text-[#2B211B] h-10 pr-10"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#756B62] hover:text-[#24170F]"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword" className="text-xs font-mono uppercase tracking-wider text-[#756B62]">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="text-xs bg-[#F5F0E7] border-[#D8CEBE] rounded-sm text-[#2B211B] h-10"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#C9562D] hover:bg-[#B24722] text-white text-xs font-medium py-3 rounded-sm transition-colors mt-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#D8CEBE] space-y-3 text-center text-xs">
          <p className="text-[#756B62]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C9562D] hover:underline font-medium">
              Sign In
            </Link>
          </p>
          <p>
            <Link to="/" className="inline-flex items-center gap-1.5 text-[#756B62] hover:text-[#24170F] font-mono text-[11px] uppercase tracking-wider">
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Sanctum Home</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
