import LoginForm from '@/components/Authentication/LoginForm';
import AuthLayout from '@/components/Authentication/AuthLayout';

const Login: React.FC = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;