import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  UserPlus,
  KeyRound,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Laptop,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

// Helper to decode JWT token from Google Identity Services
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const DEFAULT_GOOGLE_CLIENT_ID = '557881796569-q9udr8e620tvmu0428iihv11eakesk93.apps.googleusercontent.com';

const Login = ({ defaultRole = 'staff' }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  // Determine role based on route (/admin-login vs /login) or search params
  const isAdminRoute = location.pathname.includes('admin') || searchParams.get('role') === 'admin' || defaultRole === 'admin';
  const role = isAdminRoute ? 'admin' : 'staff';

  // Auth Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState('login');

  // Sign-In State (Pre-filled with respective demo account for seamless viva demonstration)
  const [email, setEmail] = useState(isAdminRoute ? 'admin@shop.com' : 'staff@shop.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  // Registration State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Status messages
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Saved Device Google Account (for 1-click automatic login on this device)
  const [deviceGoogleUser, setDeviceGoogleUser] = useState(() => {
    try {
      const saved = localStorage.getItem('stockpilot_device_google_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Google OAuth Client ID (from .env, localStorage, or configured default)
  const [googleClientId, setGoogleClientId] = useState(() => {
    return (
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      localStorage.getItem('stockpilot_google_client_id') ||
      DEFAULT_GOOGLE_CLIENT_ID
    );
  });

  // Google Modal State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showClientIdConfig, setShowClientIdConfig] = useState(false);
  const [tempClientId, setTempClientId] = useState(
    import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('stockpilot_google_client_id') || ''
  );

  // Forgot Password Modal State
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Synchronize role and credentials when route or query parameters change
  useEffect(() => {
    const qMode = searchParams.get('mode');
    if (qMode && (qMode === 'login' || qMode === 'register')) {
      setAuthMode(qMode);
    }
    if (isAdminRoute) {
      setEmail('admin@shop.com');
      setPassword('password123');
    } else {
      setEmail('staff@shop.com');
      setPassword('password123');
    }
    setError('');
    setSuccessMsg('');
  }, [location.pathname, searchParams, isAdminRoute]);

  // 1. Handle Sign-In Submit with Strict Role-Based Validation
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const loggedInRole = result.user?.role;

      // Strict RBAC Separation: Check if user role matches the current portal
      if (role === 'admin' && loggedInRole !== 'admin') {
        setError('Access denied. This portal is strictly for Store Administrators. Staff members must use the Staff Login portal.');
        return;
      }

      if (role === 'staff' && loggedInRole === 'admin') {
        setError('This account has Administrator privileges. Please use the Admin Login portal.');
        return;
      }

      // Successful verification: Navigate to Dashboard
      navigate('/');
    } else {
      setError(result.message || 'Invalid credentials. Please check your email and password.');
    }
  };

  // 2. Handle Registration Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/auth/register', {
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword,
        role: role // 'admin' or 'staff' depending on current portal
      });

      if (res.data.success) {
        const savedEmail = regEmail.trim();
        setEmail(savedEmail);
        setPassword('');

        // Clear registration fields
        setRegName('');
        setRegEmail('');
        setRegPhone('');
        setRegPassword('');
        setRegConfirmPassword('');
        setShowRegPassword(false);
        setShowRegConfirmPassword(false);

        // Switch to login tab and prompt user
        setAuthMode('login');
        setSuccessMsg(
          `${role === 'admin' ? 'Administrator' : 'Staff'} account registered successfully. Please sign in with your password.`
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try a different email address.');
    } finally {
      setLoading(false);
    }
  };

  // Initialize Google Identity Services (GIS) / One Tap if Client ID is configured
  useEffect(() => {
    if (!googleClientId || typeof window === 'undefined' || !window.google?.accounts?.id) return;

    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (response?.credential) {
            const decoded = parseJwt(response.credential);
            if (decoded && decoded.email) {
              const userInfo = {
                email: decoded.email,
                name: decoded.name || decoded.email.split('@')[0],
                avatar: decoded.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${decoded.name || decoded.email}`,
                googleId: decoded.sub
              };
              localStorage.setItem('stockpilot_device_google_user', JSON.stringify(userInfo));
              setDeviceGoogleUser(userInfo);
              await handleGoogleSignIn(userInfo.email, userInfo.name, userInfo.googleId, userInfo.avatar, response.credential);
            }
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });

      if (authMode === 'login') {
        window.google.accounts.id.prompt();
      }
    } catch (err) {
      console.warn('Google Identity Services notice:', err);
    }
  }, [googleClientId, authMode]);

  // 3. Google Sign-In Execution
  const handleGoogleSignIn = async (gEmail, gName, gId, gAvatar, gCredential) => {
    setGoogleLoading(true);
    setError('');

    const cleanEmail = (gEmail || '').trim().toLowerCase();
    const cleanName = (gName || '').trim() || cleanEmail.split('@')[0];

    const payload = {
      email: cleanEmail,
      name: cleanName,
      role: role,
      googleId: gId || 'g_' + Math.floor(10000000 + Math.random() * 90000000),
      avatar: gAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${cleanName}`,
      credential: gCredential || undefined
    };

    const res = await googleLogin(payload);
    setGoogleLoading(false);
    setIsGoogleModalOpen(false);

    if (res.success) {
      if (rememberDevice) {
        const toSave = {
          email: cleanEmail,
          name: cleanName,
          avatar: payload.avatar,
          googleId: payload.googleId
        };
        localStorage.setItem('stockpilot_device_google_user', JSON.stringify(toSave));
        setDeviceGoogleUser(toSave);
      }
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  // Trigger official Google OAuth 2.0 Account Chooser Popup (TokenClient)
  const triggerGoogleOAuthPopup = () => {
    setError('');
    setGoogleLoading(true);

    if (window.google?.accounts?.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse?.error) {
              console.error('Google OAuth token response error:', tokenResponse);
              setError(
                tokenResponse.error_description ||
                  'Google Sign-In failed or was closed. Please ensure http://localhost:5173 is added to Authorized JavaScript Origins in Google Cloud Console.'
              );
              setGoogleLoading(false);
              return;
            }

            if (tokenResponse?.access_token) {
              try {
                // Fetch authenticated Google profile
                const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`
                  }
                });

                if (!userRes.ok) {
                  throw new Error('Failed to retrieve user profile from Google.');
                }

                const profile = await userRes.json();
                await handleGoogleSignIn(
                  profile.email,
                  profile.name,
                  profile.sub,
                  profile.picture
                );
              } catch (profileErr) {
                console.error('Error fetching Google userinfo:', profileErr);
                setError(profileErr.message || 'Failed to retrieve profile from Google.');
                setGoogleLoading(false);
              }
            } else {
              setGoogleLoading(false);
            }
          },
          error_callback: (nonOAuthError) => {
            console.error('Google token client nonOAuthError:', nonOAuthError);
            setError(
              'Google popup failed. If an ad-blocker is active, please disable it, and verify http://localhost:5173 is in Authorized JavaScript Origins in Google Cloud.'
            );
            setGoogleLoading(false);
          }
        });

        // Trigger Google account chooser popup window directly!
        tokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.error('initTokenClient exception:', err);
      }
    }

    // Fallback: If TokenClient is not ready, try One Tap prompt or modal
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setIsGoogleModalOpen(true);
    }
    setGoogleLoading(false);
  };

  // Main Google Button Click handler
  const handleGoogleButtonClick = () => {
    // If real Google Client ID is configured, open official Google popup!
    if (googleClientId) {
      triggerGoogleOAuthPopup();
      return;
    }

    // If a saved device Google account exists:
    if (deviceGoogleUser && deviceGoogleUser.email) {
      handleGoogleSignIn(
        deviceGoogleUser.email,
        deviceGoogleUser.name,
        deviceGoogleUser.googleId,
        deviceGoogleUser.avatar
      );
      return;
    }

    // Otherwise open connect modal
    setIsGoogleModalOpen(true);
  };

  // 4. Send Gmail OTP for Password Recovery (Step 1 -> Step 2)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    setForgotLoading(true);

    try {
      const res = await API.post('/auth/forgot-password', { email: forgotEmail.trim() });
      if (res.data.success) {
        setForgotSuccess(res.data.message);
        setForgotStep(2);
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || 'No registered account found with this email address.');
    } finally {
      setForgotLoading(false);
    }
  };

  // 5. Verify OTP code (Step 2 -> Step 3)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!otp || otp.trim().length !== 6) {
      setForgotError('Please enter the 6-digit verification code.');
      return;
    }

    setForgotLoading(true);

    try {
      const res = await API.post('/auth/verify-otp', {
        email: forgotEmail.trim(),
        otp: otp.trim()
      });
      if (res.data.success) {
        setForgotSuccess(res.data.message);
        setForgotStep(3);
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setForgotLoading(false);
    }
  };

  // 6. Reset Password using OTP (Step 3 -> Done)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (newPassword !== confirmPassword) {
      setForgotError('New passwords do not match. Please verify both fields.');
      return;
    }

    if (newPassword.length < 6) {
      setForgotError('Password must contain at least 6 characters.');
      return;
    }

    setForgotLoading(true);

    try {
      const res = await API.post('/auth/reset-password-otp', {
        email: forgotEmail.trim(),
        otp: otp.trim(),
        newPassword
      });

      if (res.data.success) {
        setForgotSuccess('Password updated successfully! Redirecting to login...');
        setEmail(forgotEmail.trim());
        setPassword(newPassword);
        setTimeout(() => {
          setIsForgotOpen(false);
          setForgotStep(1);
          setForgotSuccess('');
          setOtp('');
          setNewPassword('');
          setConfirmPassword('');
        }, 1500);
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to update password. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Skip handler (closes modal without resetting password)
  const handleSkipForgot = () => {
    setIsForgotOpen(false);
    setForgotStep(1);
    setForgotError('');
    setForgotSuccess('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 selection:bg-emerald-600 selection:text-white relative overflow-hidden font-sans">
      {/* Subtle ambient gradient wash matching unified brand theme */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-emerald-100/30 via-slate-50/20 to-transparent pointer-events-none" />

      <div className="max-w-md w-full mx-auto relative z-10">
        {/* Navigation back to Landing Page */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition" />
            <span>Back to Landing Page</span>
          </Link>
        </div>

        {/* Minimalist Portal Header */}
        <div className="text-center mb-6">
          {/* Zoho-style 4-tile brand logo */}
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
              <span className="w-2 h-2 rounded-2xs bg-red-500"></span>
              <span className="w-2 h-2 rounded-2xs bg-emerald-500"></span>
              <span className="w-2 h-2 rounded-2xs bg-blue-500"></span>
              <span className="w-2 h-2 rounded-2xs bg-amber-500"></span>
            </div>
            <span className="text-sm font-black text-slate-900 tracking-tight">StockPilot</span>
          </div>

          {/* Role Status Pill */}
          <div className="flex justify-center mb-2">
            {role === 'admin' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Store Administrator Portal</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs">
                <User className="w-3.5 h-3.5 text-slate-600" />
                <span>Staff Member Portal</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {role === 'admin' ? 'Administrator Login' : 'Staff Login'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            {role === 'admin'
              ? 'Executive access for inventory analytics, profit margins, staff management, and system configuration.'
              : 'Sign in to access POS billing, counter sales, barcode lookup, and stock replenishment operations.'}
          </p>
        </div>

        {/* Crisp White Card Container */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm shadow-slate-200/60">
          {/* Clean Segmented Tab Control */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200/60">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setError('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                authMode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setError('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-slate-500" />
              <span>{role === 'admin' ? 'Register Admin' : 'Register New Staff'}</span>
            </button>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <div className="flex-1">
                <span>{error}</span>
                {error.includes('Admin Login portal') && (
                  <Link to="/admin-login" className="block mt-1 font-bold underline text-red-800">
                    Switch to Admin Portal &rarr;
                  </Link>
                )}
                {error.includes('Staff Login portal') && (
                  <Link to="/login" className="block mt-1 font-bold underline text-red-800">
                    Switch to Staff Portal &rarr;
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Google Sign-In Button (Shown on Login Mode) */}
          {authMode === 'login' && (
            <div className="mb-5">
              <button
                type="button"
                disabled={googleLoading}
                onClick={handleGoogleButtonClick}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-xl border border-slate-300 shadow-2xs transition flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer"
              >
                {googleLoading ? (
                  <div className="flex items-center gap-2 text-slate-700">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    <span>Signing in with Google ({deviceGoogleUser?.email || 'device account'})...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>
                      {deviceGoogleUser?.email
                        ? `Continue as ${deviceGoogleUser.name || deviceGoogleUser.email.split('@')[0]}`
                        : 'Continue with Google'}
                    </span>
                  </>
                )}
              </button>

              {/* Saved Device Account Pill & Quick Switch Option */}
              {deviceGoogleUser?.email && (
                <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-slate-500">
                  <span className="truncate max-w-[250px] flex items-center gap-1.5" title={deviceGoogleUser.email}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0"></span>
                    <span className="text-slate-400">Device Gmail:</span>
                    <strong className="text-slate-700 font-medium truncate">{deviceGoogleUser.email}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomGoogleEmail(deviceGoogleUser.email);
                      setCustomGoogleName(deviceGoogleUser.name || '');
                      setIsGoogleModalOpen(true);
                    }}
                    className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline shrink-0 ml-2"
                  >
                    Switch Account
                  </button>
                </div>
              )}

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  <span className="bg-white px-3">or continue with email</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= 1. SIGN IN FORM ================= */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {role === 'admin' ? 'Administrator Email' : 'Staff Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === 'admin' ? 'admin@shop.com' : 'staff@shop.com'}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition shadow-2xs outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setIsForgotOpen(true);
                    }}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50/50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition shadow-2xs outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition disabled:opacity-50 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <span>
                  {loading
                    ? 'Authenticating...'
                    : role === 'admin'
                    ? 'Sign In to Admin Dashboard'
                    : 'Sign In as Staff'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Autofill Demo Credentials Helper */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    if (role === 'admin') {
                      setEmail('admin@shop.com');
                      setPassword('password123');
                    } else {
                      setEmail('staff@shop.com');
                      setPassword('password123');
                    }
                  }}
                  className="text-[11px] text-slate-400 hover:text-slate-700 transition font-medium"
                >
                  Click to autofill demo {role === 'admin' ? 'Admin' : 'Staff'} credentials
                </button>
              </div>
            </form>
          )}

          {/* ================= 2. SIGN UP FORM ================= */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={role === 'admin' ? 'e.g. Narayan (Store Owner)' : 'e.g. Rahul Sharma'}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition shadow-2xs outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder={role === 'admin' ? 'admin@company.com' : 'staff@company.com'}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition shadow-2xs outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition shadow-2xs outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full pl-3 pr-8 py-2 text-xs bg-slate-50/50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100 transition outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 transition"
                      title={showRegPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Confirm"
                      className="w-full pl-3 pr-8 py-2 text-xs bg-slate-50/50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100 transition outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 transition"
                      title={showRegConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition disabled:opacity-50 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <UserPlus className="w-4 h-4" />
                <span>
                  {loading
                    ? 'Creating Account...'
                    : role === 'admin'
                    ? 'Register Administrator Account'
                    : 'Register Staff Account'}
                </span>
              </button>
            </form>
          )}
        </div>

        {/* Cross-Portal Switcher Link */}
        <div className="text-center mt-5 text-xs text-slate-600">
          {role === 'staff' ? (
            <p>
              Are you a Store Administrator?{' '}
              <Link to="/admin-login" className="font-bold text-slate-900 hover:text-emerald-700 transition underline">
                Go to Admin Login &rarr;
              </Link>
            </p>
          ) : (
            <p>
              Store Staff Member?{' '}
              <Link to="/login" className="font-bold text-emerald-700 hover:text-emerald-800 transition underline">
                Go to Staff Login &rarr;
              </Link>
            </p>
          )}
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-6">
          StockPilot Inventory Management System • Enterprise Cloud Edition
        </p>
      </div>

      {/* ================= GOOGLE SIGN-IN SELECTOR & DEVICE GMAIL MODAL ================= */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Continue with Google
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Connect your device's Gmail for automatic 1-click login
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Current Device Account Card if already connected */}
              {deviceGoogleUser?.email && (
                <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                      <Laptop className="w-3 h-3 text-emerald-600" />
                      Active On This Device
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem('stockpilot_device_google_user');
                        setDeviceGoogleUser(null);
                        setCustomGoogleEmail('');
                        setCustomGoogleName('');
                      }}
                      className="text-[11px] text-red-600 hover:underline font-semibold cursor-pointer"
                    >
                      Disconnect
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={deviceGoogleUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${deviceGoogleUser.email}`}
                      alt={deviceGoogleUser.name}
                      className="w-9 h-9 rounded-full border border-emerald-200 bg-white shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {deviceGoogleUser.name || deviceGoogleUser.email.split('@')[0]}
                      </p>
                      <p className="text-[11px] text-slate-600 truncate">{deviceGoogleUser.email}</p>
                    </div>
                    <button
                      type="button"
                      disabled={googleLoading}
                      onClick={() =>
                        handleGoogleSignIn(
                          deviceGoogleUser.email,
                          deviceGoogleUser.name,
                          deviceGoogleUser.googleId,
                          deviceGoogleUser.avatar
                        )
                      }
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition shrink-0 shadow-xs cursor-pointer"
                    >
                      {googleLoading ? 'Signing in...' : 'Log In Now'}
                    </button>
                  </div>
                </div>
              )}

              {/* Form to enter / switch device Gmail */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  {deviceGoogleUser?.email ? 'Or Switch to Another Gmail Account' : 'Enter Your Device Gmail Account'}
                </label>
                <p className="text-[11px] text-slate-500 mb-2.5">
                  Enter your personal or business Gmail address. It will be remembered on this device so clicking "Continue with Google" logs in automatically.
                </p>

                <div className="space-y-2.5">
                  <div>
                    <input
                      type="email"
                      required
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-hidden transition text-slate-900"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={customGoogleName}
                      onChange={(e) => setCustomGoogleName(e.target.value)}
                      placeholder="Your Full Name (optional)"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-hidden transition text-slate-900"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="w-3.5 h-3.5 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500"
                    />
                    <span>Remember on this device for 1-click automatic login</span>
                  </label>

                  <button
                    type="button"
                    disabled={!customGoogleEmail || googleLoading}
                    onClick={() => handleGoogleSignIn(customGoogleEmail, customGoogleName)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition disabled:opacity-50 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {googleLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Signing In to Google...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue with this Gmail</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Presets for Quick Demo */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                  Or Demo Shortcuts
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={googleLoading}
                    onClick={() => {
                      setRememberDevice(true);
                      handleGoogleSignIn('admin@shop.com', 'Narayan (Admin)');
                    }}
                    className="p-2 text-left bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition text-[11px] cursor-pointer"
                  >
                    <p className="font-bold text-slate-800">Admin Demo</p>
                    <p className="text-slate-500 truncate text-[10px]">admin@shop.com</p>
                  </button>
                  <button
                    type="button"
                    disabled={googleLoading}
                    onClick={() => {
                      setRememberDevice(true);
                      handleGoogleSignIn('staff@shop.com', 'Rahul (Staff)');
                    }}
                    className="p-2 text-left bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition text-[11px] cursor-pointer"
                  >
                    <p className="font-bold text-slate-800">Staff Demo</p>
                    <p className="text-slate-500 truncate text-[10px]">staff@shop.com</p>
                  </button>
                </div>
              </div>

              {/* Real Google Cloud OAuth Client ID configuration toggle */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowClientIdConfig(!showClientIdConfig)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center justify-between w-full font-medium cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Settings className="w-3 h-3 text-slate-400" />
                    <span>Real Google Cloud OAuth Client ID (Optional)</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    {googleClientId ? 'Configured' : showClientIdConfig ? 'Hide' : 'Configure'}
                  </span>
                </button>

                {showClientIdConfig && (
                  <div className="mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      To open Google's native popup dialog (<code className="bg-slate-200 px-1 rounded text-[10px]">accounts.google.com</code>), enter your Google Cloud OAuth 2.0 Client ID:
                    </p>
                    <input
                      type="text"
                      value={tempClientId}
                      onChange={(e) => setTempClientId(e.target.value)}
                      placeholder="e.g. 123456789-xyz.apps.googleusercontent.com"
                      className="w-full px-2.5 py-1.5 text-[11px] border border-slate-300 rounded-lg bg-white"
                    />
                    <div className="flex justify-end gap-2">
                      {googleClientId && (
                        <button
                          type="button"
                          onClick={() => {
                            localStorage.removeItem('stockpilot_google_client_id');
                            setGoogleClientId('');
                            setTempClientId('');
                          }}
                          className="px-2.5 py-1 text-[11px] text-red-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (tempClientId) {
                            localStorage.setItem('stockpilot_google_client_id', tempClientId.trim());
                            setGoogleClientId(tempClientId.trim());
                            setShowClientIdConfig(false);
                          }
                        }}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-lg transition cursor-pointer"
                      >
                        Save Client ID
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= FORGOT PASSWORD GMAIL OTP MODAL (3-STEP WITH SKIP) ================= */}
      {isForgotOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <KeyRound className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Reset Account Password</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Step {forgotStep} of 3</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSkipForgot}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper Indicator */}
            <div className="px-6 pt-4">
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold">
                <div
                  className={`py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1 transition ${
                    forgotStep === 1
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : forgotStep > 1
                      ? 'bg-slate-50 border-slate-200 text-emerald-600'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <span>1. Gmail</span>
                </div>
                <div
                  className={`py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1 transition ${
                    forgotStep === 2
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : forgotStep > 2
                      ? 'bg-slate-50 border-slate-200 text-emerald-600'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <span>2. Code</span>
                </div>
                <div
                  className={`py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1 transition ${
                    forgotStep === 3
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <span>3. Password</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Error Alert */}
              {forgotError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{forgotError}</span>
                </div>
              )}

              {/* Success Alert */}
              {forgotSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{forgotSuccess}</span>
                </div>
              )}

              {/* STEP 1: Enter Gmail Address */}
              {forgotStep === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Registered Gmail / Email Address *
                    </label>
                    <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                      Enter the email linked to your account. A <strong>6-digit verification code</strong> will be sent to your Gmail inbox.
                    </p>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-hidden transition text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {forgotLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Sending OTP to Gmail...</span>
                        </>
                      ) : (
                        <>
                          <span>Send 6-Digit Code</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: Enter 6-Digit Code */}
              {forgotStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Enter 6-Digit OTP Code *
                      </label>
                      <button
                        type="button"
                        onClick={() => setForgotStep(1)}
                        className="text-[11px] font-semibold text-emerald-600 hover:underline cursor-pointer"
                      >
                        Change Email
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-2.5">
                      Code sent to: <strong className="text-slate-800">{forgotEmail}</strong>
                    </p>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full py-3 text-center text-xl font-mono font-black tracking-[0.3em] border border-slate-300 bg-slate-50/50 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-hidden transition text-slate-900"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Didn't receive the code?</span>
                    <button
                      type="button"
                      disabled={forgotLoading}
                      onClick={handleSendOtp}
                      className="font-semibold text-emerald-600 hover:underline cursor-pointer"
                    >
                      Resend Code
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={forgotLoading || otp.length !== 6}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {forgotLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying OTP Code...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify Code & Continue</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: Create New Password */}
              {forgotStep === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-3.5">
                  <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                    Set a new password for <strong className="text-slate-800">{forgotEmail}</strong>:
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">New Password *</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full pl-3.5 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-hidden transition text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        title={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password *</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full pl-3.5 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-hidden transition text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {forgotLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <span>Save Password & Log In</span>
                          <CheckCircle className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
