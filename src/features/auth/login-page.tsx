import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '../../store';
import { mockAuthService } from '../../services/mock-auth-service';
import { LoginCredentials, UserRole } from '../../types';
import './login-page.scss';

const { Title, Text, Link } = Typography;

interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      
      // Call authentication service
      const credentials: LoginCredentials = {
        email: data.email,
        password: data.password,
      };
      
      const response = await mockAuthService.login(credentials);
      
      // Store user and token in Zustand
      login(response.user, response.token);
      
      message.success('Login successful!');
      
      // Navigate based on user role
      if (response.user.role === UserRole.OFFICER) {
        navigate('/landing');
      } else {
        navigate('/landing');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <img src="/logo.svg" alt="Logo" />
          </div>
          <Title level={3}>Simple KYC Authentication</Title>
        </div>

        <div className="login-card">
          <Title level={4} className="card-title">
            Sign in to platform
          </Title>

          <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className="login-form">
            {/* Email Field */}
            <Form.Item
              label="Your email"
              validateStatus={errors.email ? 'error' : ''}
              help={errors.email?.message}
            >
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  minLength: {
                    value: 8,
                    message: 'Email must be between 8-10 characters',
                  },
                  maxLength: {
                    value: 10,
                    message: 'Email must be between 8-10 characters',
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    prefix={<UserOutlined />}
                    placeholder="name@company.com"
                    size="large"
                    disabled={loading}
                  />
                )}
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              label="Your password"
              validateStatus={errors.password ? 'error' : ''}
              help={errors.password?.message}
            >
              <Controller
                name="password"
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 12,
                    message: 'Password must be between 12-16 characters',
                  },
                  maxLength: {
                    value: 16,
                    message: 'Password must be between 12-16 characters',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#&!])[A-Za-z\d@#&!]{12,16}$/,
                    message:
                      'Password must contain uppercase, lowercase, number, and special character (@, #, &, !)',
                  },
                }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    prefix={<LockOutlined />}
                    placeholder="••••••••"
                    size="large"
                    disabled={loading}
                  />
                )}
              />
            </Form.Item>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value} disabled={loading}>
                    Remember me
                  </Checkbox>
                )}
              />
              <Link href="#" className="forgot-password">
                Lost Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
                className="login-button"
              >
                Login to your account
              </Button>
            </Form.Item>

            {/* Sign Up Link */}
            <div className="signup-link">
              <Text>Forgot password? </Text>
              <Link href="#" strong>
                Sign-up
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
