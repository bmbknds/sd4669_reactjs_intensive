import { useEffect, useMemo } from 'react';
import { Layout, Card, Table, Typography } from 'antd';
import { useFetch } from '../../hooks/use-fetch';
import { reviewService } from '../../services/review-service';
import { clientService } from '../../services/client-service';

const { Header, Content } = Layout;
const { Title } = Typography;

const ResultsPage = () => {
  const { data: reviews, loading: loadingReviews } = useFetch(reviewService.getAllReviews);
  const { data: clients, loading: loadingClients } = useFetch(clientService.getAllClients);

  const clientMap = useMemo(() => {
    const map: Record<string, string> = {};
    (clients || []).forEach((c) => { map[c.id] = c.name; });
    return map;
  }, [clients]);

  const data = useMemo(() => (reviews || []).map(r => ({
    key: r.id,
    name: clientMap[r.userId] || r.userId,
    date: new Date(r.reviewedAt).toLocaleString(),
    status: r.status,
  })), [reviews, clientMap]);

  return (
    <Layout className="review-results-page">
      <Header className="results-header">
        <Title level={3}>Reviewed Results</Title>
      </Header>
      <Content className="results-content">
        <Card>
          <Table
            loading={loadingReviews || loadingClients}
            dataSource={data}
            columns={[
              { title: 'Name', dataIndex: 'name' },
              { title: 'Date', dataIndex: 'date' },
              { title: 'Final Status', dataIndex: 'status' },
            ]}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default ResultsPage;
