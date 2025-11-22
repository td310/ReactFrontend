import LoginForm from '@/components/LoginForm';
import AuthLayout from '@/components/AuthLayout';

const Login: React.FC = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;