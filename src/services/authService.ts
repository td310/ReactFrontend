import { useDispatch } from 'react-redux';
import { setCredentials, logout as logoutAction } from '@/store/authSlice';
import { useLoginMutation, useLogoutMutation } from '@/api/authApi';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const [logoutApi] = useLogoutMutation();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login({ email, password }).unwrap();
      dispatch(setCredentials({ token: response.token, user: response.user }));
      navigate('/home');
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message;
      throw new Error(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logoutAction());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { handleLogin, handleLogout };
};