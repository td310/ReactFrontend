import { useState } from 'react';
import { ZodError } from 'zod';
import { useAuth } from '@/services/AuthService/authService';
import { loginSchema, type LoginFormData } from '@/validation/auth/login.schema';

const MailIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <svg className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {visible ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    )}
    {!visible && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

interface FormErrors {
  email?: string;
  password?: string;
}

interface TouchedFields {
  email: boolean;
  password: boolean;
}

const formatZodErrors = (error: ZodError<LoginFormData>): FormErrors => {
  const formattedErrors: FormErrors = {};
  
  error.issues.forEach((issue) => {
    const path = issue.path[0] as keyof FormErrors;
    if (path) {
      formattedErrors[path] = issue.message;
    }
  });
  
  return formattedErrors;
};

const validateField = (field: keyof LoginFormData, value: string): string | undefined => {
  try {
    loginSchema.shape[field].parse(value);
    return undefined;
  } catch (error) {
    if (error instanceof ZodError) {
      return error.issues[0]?.message;
    }
    return undefined;
  }
};

const LoginForm: React.FC = () => {
  const { handleLogin } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [touched, setTouched] = useState<TouchedFields>({
    email: false,
    password: false,
  });

  const handleChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field] && errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (generalError) {
      setGeneralError(null);
    }
  };

  const handleBlur = (field: keyof LoginFormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateForm = (): boolean => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors(formatZodErrors(error as ZodError<LoginFormData>));
      }
      setTouched({ email: true, password: true });
      return false;
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await handleLogin(formData.email, formData.password);
    } catch (err: any) {
      if (err?.data?.errors) {
        const serverErrors = err.data.errors;
        setErrors({
          email: serverErrors.email?.[0] || errors.email,
          password: serverErrors.password?.[0] || errors.password,
        });
      } else {
        const errorMessage = err?.message || err?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
        setGeneralError(errorMessage);
        console.error('Login error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 w-full max-w-sm mx-auto">
      {generalError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600 danger flex items-center gap-2">
            <ErrorIcon />
            {generalError}
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block ml-1">
          Email
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MailIcon />
          </div>
          <input
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:ring-4 transition-all duration-200 outline-none text-gray-800 placeholder-gray-400 ${
              errors.email
                ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600 ml-1 mt-1 flex items-center gap-1">
            <ErrorIcon />
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center ml-1">
          <label className="text-sm font-semibold text-gray-700">
            Mật khẩu
          </label>
        </div>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LockIcon />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange('password')}
            onBlur={handleBlur('password')}
            className={`w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:ring-4 transition-all duration-200 outline-none text-gray-800 placeholder-gray-400 ${
              errors.password
                ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'
            }`}
          />
          <div 
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            <EyeIcon visible={showPassword} />
          </div>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600 ml-1 mt-1 flex items-center gap-1">
            <ErrorIcon />
            {errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Đang xử lý...</span>
          </div>
        ) : (
          'Đăng nhập ngay'
        )}
      </button>
    </form>
  );
};

export default LoginForm;
