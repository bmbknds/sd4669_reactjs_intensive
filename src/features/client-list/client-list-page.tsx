import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Table, Card, Typography, Button, Avatar } from 'antd';
import { FileTextOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useClientStore } from '../../store';
import { useAuth } from '../../hooks/use-auth';
import { useFetch } from '../../hooks/use-fetch';
import { clientService } from '../../services/client-service';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const ClientListPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { clients, setClients, setSelectedClient } = useClientStore();

  const { data, loading } = useFetch(clientService.getAllClients);

  useEffect(() => {
    if (data && data.length) setClients(data);
  }, [data, setClients]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  return (
    <Layout className="client-list-page">
      <Header className="landing-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingInline: 24 }}>
        <div className="header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className="logo-section" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileTextOutlined style={{ fontSize: 24, color: 'white' }} />
            <Title level={5} className="site-title" style={{ color: 'white', margin: 0 }}>Simple KYC</Title>
          </div>
          <div className="user-section" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar
              size={32}
              icon={<UserOutlined />}
              onClick={() => handleNavigation('/profile')}
              style={{ cursor: 'pointer' }}
            />
            <div onClick={() => handleNavigation('/profile')} role="button" tabIndex={0} style={{ cursor: 'pointer', color: 'white' }}>
              <Text style={{ color: 'white' }}>{user?.name}</Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.65)', display: 'block', fontSize: 12 }}>Officer</Text>
            </div>
            <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout} style={{ color: 'white' }} />
          </div>
        </div>
      </Header>
      <Content className="client-list-content">
        <Card>
          <Table
            rowKey={(r) => r.id}
            loading={loading}
            dataSource={clients}
            columns={[
              { title: 'Name', dataIndex: 'name' },
              { title: 'Email', dataIndex: 'email' },
              { title: 'Role', dataIndex: 'role' },
              {
                title: 'Actions',
                render: (_, record) => (
                  <>
                    <Button onClick={() => { setSelectedClient(record); navigate(`/profile/${record.id}`); }}>Profile</Button>
                    <Button style={{ marginLeft: 8 }} onClick={() => { setSelectedClient(record); navigate(`/kyc/${record.id}`); }}>KYC</Button>
                    <Button style={{ marginLeft: 8 }} onClick={() => { setSelectedClient(record); navigate(`/review/${record.id}`); }}>Review</Button>
                  </>
                ),
              },
            ]}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default ClientListPage;
