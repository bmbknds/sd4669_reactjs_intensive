import { useNavigate } from 'react-router-dom';
import { Layout, Card, Table, Typography, Button, message } from 'antd';
import { useFetch } from '../../hooks/use-fetch';
import { clientService } from '../../services/client-service';
import { reviewService } from '../../services/review-service';
import { useClientStore } from '../../store';

const { Header, Content } = Layout;
const { Title } = Typography;

// Preview (Officer): list of pending review with inline actions
const ReviewPage = () => {
  const navigate = useNavigate();
  const { setSelectedClient } = useClientStore();
  const { data: clients, loading, refetch } = useFetch(clientService.getAllClients);

  const pending = (clients || []).filter((c) => c.kycStatus === 'pending');

  const approve = async (userId: string) => {
    try {
      await reviewService.submitReview({ userId, kycId: 'kyc-' + userId, reviewerId: 'officer', status: 'approved', comments: 'Approved' });
      message.success('Approved');
      refetch();
    } catch (e) {
      message.error('Failed to approve');
    }
  };
  const reject = async (userId: string) => {
    try {
      await reviewService.submitReview({ userId, kycId: 'kyc-' + userId, reviewerId: 'officer', status: 'rejected', comments: 'Rejected' });
      message.success('Rejected');
      refetch();
    } catch (e) {
      message.error('Failed to reject');
    }
  };

  return (
    <Layout className="review-preview-page">
      <Header className="review-header">
        <Title level={3}>Pending Reviews</Title>
      </Header>
      <Content className="review-content">
        <Card>
          <Table
            rowKey={(r) => r.id}
            loading={loading}
            dataSource={pending}
            columns={[
              { title: 'Name', dataIndex: 'name' },
              { title: 'Email', dataIndex: 'email' },
              { title: 'Date', dataIndex: 'lastUpdated' },
              {
                title: 'Actions',
                render: (_, record) => (
                  <>
                    <Button onClick={() => { setSelectedClient(record); navigate(`/profile/${record.id}`); }}>Preview Profile</Button>
                    <Button type="primary" style={{ marginLeft: 8 }} onClick={() => approve(record.id)}>Approve</Button>
                    <Button danger style={{ marginLeft: 8 }} onClick={() => reject(record.id)}>Reject</Button>
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

export default ReviewPage;
