
import { useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Card, Row, Col, Button, Typography, Avatar, Statistic } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../hooks/use-auth';
import './landing-page.scss';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const DashboardActions = memo(({ isOfficer, handleNavigation }: { isOfficer: boolean; handleNavigation: (path: string) => void }) => (
  <Row gutter={[24, 24]} className="quick-actions">
    {isOfficer ? (
      <>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="action-card" onClick={() => handleNavigation('/clients')}>
            <TeamOutlined className="card-icon" />
            <Title level={4}>Client List</Title>
            <Text type="secondary">View and manage all clients</Text>
            <Statistic value={24} suffix="clients" className="card-stat" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="action-card" onClick={() => handleNavigation('/review')}>
            <CheckCircleOutlined className="card-icon" />
            <Title level={4}>Reviews</Title>
            <Text type="secondary">Review pending KYC applications</Text>
            <Statistic value={8} suffix="pending" className="card-stat" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="action-card" onClick={() => handleNavigation('/profile')}>
            <UserOutlined className="card-icon" />
            <Title level={4}>My Profile</Title>
            <Text type="secondary">View and edit your profile</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="action-card">
            <FileTextOutlined className="card-icon" />
            <Title level={4}>Reports</Title>
            <Text type="secondary">Generate KYC reports</Text>
          </Card>
        </Col>
      </>
    ) : (
      <>
        <Col xs={24} sm={12} lg={8}>
          <Card hoverable className="action-card">
            <UserOutlined className="card-icon" />
            <Title level={4}>My Profile</Title>
            <Text type="secondary">View and update your personal information</Text>
            <Button type="primary" className="card-button" onClick={() => handleNavigation('/profile')}>
              Go to Profile
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card hoverable className="action-card">
            <FileTextOutlined className="card-icon" />
            <Title level={4}>KYC Verification</Title>
            <Text type="secondary">Complete your KYC verification process</Text>
            <Button type="primary" className="card-button" onClick={() => handleNavigation('/kyc')}>
              Start KYC
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card hoverable className="action-card">
            <CheckCircleOutlined className="card-icon" />
            <Title level={4}>Verification Status</Title>
            <Text type="secondary">Check your KYC verification status</Text>
            <Statistic value="Pending" className="card-stat status-pending" />
          </Card>
        </Col>
      </>
    )}
  </Row>
));

const InfoSection = memo(() => (
  <Row gutter={[24, 24]} className="info-section">
    <Col xs={24} lg={16}>
      <Card title="Getting Started" className="info-card">
        <div className="steps-list">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <Title level={5}>Complete Your Profile</Title>
              <Text type="secondary">Fill in your personal information to get started</Text>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <Title level={5}>Submit KYC Documents</Title>
              <Text type="secondary">Upload required identification documents</Text>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <Title level={5}>Wait for Verification</Title>
              <Text type="secondary">Our team will review your documents within 24-48 hours</Text>
            </div>
          </div>
        </div>
      </Card>
    </Col>
    <Col xs={24} lg={8}>
      <Card title="Need Help?" className="info-card help-card">
        <div className="help-content">
          <Text>If you have any questions or need assistance with the KYC process, please contact our support team.</Text>
          <Button type="primary" block className="help-button">Contact Support</Button>
        </div>
      </Card>
    </Col>
  </Row>
));

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, isOfficer, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  return (
    <Layout className="landing-page">
      <Header className="landing-header">
        <div className="header-content">
          <div className="logo-section">
            <FileTextOutlined className="logo" />
            <Title level={5} className="site-title">Simple KYC</Title>
          </div>
          <div className="user-section">
            <Avatar
              size={32}
              icon={<UserOutlined />}
              className="user-avatar"
              onClick={() => handleNavigation('/profile')}
              style={{ cursor: 'pointer' }}
            />
            <div
              className="user-info"
              onClick={() => handleNavigation('/profile')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleNavigation('/profile');
                }
              }}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
              <Text>{user?.name}</Text>
              <Text type="secondary" className="user-role">
                {user?.role === 'OFFICER' ? 'Officer' : 'User'}
              </Text>
            </div>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </Button>
          </div>
        </div>
      </Header>

      <Content className="landing-content">
        <div className="welcome-section">
          <Title level={2}>Welcome back, {user?.personalInfo?.firstName || user?.name}</Title>
          <Text type="secondary" className="subtitle">User KYC control</Text>
        </div>
        <DashboardActions isOfficer={!!isOfficer} handleNavigation={handleNavigation} />
        <InfoSection />
      </Content>

      <Footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="/terms">Terms and Conditions</a>
            <span className="separator">•</span>
            <a href="/privacy">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="/licensing">Licensing</a>
            <span className="separator">•</span>
            <a href="/cookies">Cookie Policy</a>
            <span className="separator">•</span>
            <a href="/contact">Contact</a>
          </div>
          <Text type="secondary" className="copyright">© 2025-2026 KYCAuthentication.com. All rights reserved.</Text>
        </div>
      </Footer>
    </Layout>
  );
};

export default memo(LandingPage);
