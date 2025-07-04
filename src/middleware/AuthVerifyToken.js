import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthVerifyToken = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = Cookies.get('token');

      if (!token) {
        // kalau gak ada token dan bukan di halaman login, redirect ke login
        if (location.pathname !== '/auth/login') {
          navigate('/auth/login');
        }
        return;
      }

      try {
        const response = await axios.get('http://localhost:5001/api/user/claim', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const userData = response.data.data;
          localStorage.setItem('claim', JSON.stringify(userData));
        } else {
          throw new Error('Unauthorized');
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        Cookies.remove('token');
        localStorage.removeItem('claim');
        navigate('/auth/login');
      }
    };

    // jangan panggil verifikasi saat di halaman login
    if (location.pathname !== '/auth/login') {
      verifyToken();
    }
  }, [location.pathname, navigate]);

  return null;
};

export default AuthVerifyToken;
