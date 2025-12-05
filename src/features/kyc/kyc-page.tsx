import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout, Card, Form, Input, Select, DatePicker, Upload, Button, Typography, Row, Col, message, Space, Statistic, InputNumber } from 'antd';
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { UploadOutlined, IdcardOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '../../hooks/use-auth';
import { useClientStore } from '../../store';
import { kycService } from '../../services/kyc-service';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

type DocumentType = 'Passport' | 'National ID' | 'Driver License';

interface KYCFormData {
  documentType: DocumentType;
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  issuingCountry: string;
  proofOfAddress?: string;
  incomes: { id: string; type: 'Salary' | 'Investment' | 'Others'; amount: number }[];
  assets: { id: string; type: 'Bond' | 'Liquidity' | 'Real Estate' | 'Others'; amount: number }[];
  liabilities: { id: string; type: 'Personal Loan' | 'Real Estate Loan' | 'Others'; amount: number }[];
  sourceOfWealth: { id: string; type: 'Inheritance' | 'Donation' | 'Others'; amount: number }[];
  experience: '< 5 years' | '> 5 and < 10 years' | '> 10 years';
  riskTolerance: '10%' | '30%' | 'All-in';
}

const KYCPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user, isOfficer } = useAuth();
  const { selectedClient } = useClientStore();
  const [loading, setLoading] = useState(false);

  // Determine target user: if userId param exists, use selectedClient; otherwise use current user
  const targetUser = userId && selectedClient ? selectedClient : user;

  const readOnly = !!isOfficer;

  const { control, handleSubmit, formState: { errors } } = useForm<KYCFormData>({
    defaultValues: {
      documentType: 'Passport',
      documentNumber: '',
      issueDate: '',
      expiryDate: '',
      issuingCountry: '',
      proofOfAddress: '',
      incomes: [{ id: 'inc-1', type: 'Salary', amount: 0 }],
      assets: [{ id: 'ass-1', type: 'Liquidity', amount: 0 }],
      liabilities: [{ id: 'lia-1', type: 'Personal Loan', amount: 0 }],
      sourceOfWealth: [{ id: 'sw-1', type: 'Inheritance', amount: 0 }],
      experience: '< 5 years',
      riskTolerance: '10%',
    },
  });

  // Dynamic arrays
  const incomesArray = useFieldArray({ control, name: 'incomes' });
  const assetsArray = useFieldArray({ control, name: 'assets' });
  const liabilitiesArray = useFieldArray({ control, name: 'liabilities' });
  const sowArray = useFieldArray({ control, name: 'sourceOfWealth' });

  // Compute net worth (A + B + C + D) per assignment
  const watchIncomes = useWatch({ control, name: 'incomes' });
  const watchAssets = useWatch({ control, name: 'assets' });
  const watchLiabilities = useWatch({ control, name: 'liabilities' });
  const watchSow = useWatch({ control, name: 'sourceOfWealth' });

  const sum = (arr?: { amount: number }[]) => (arr || []).reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
  const totals = useMemo(() => ({
    A: sum(watchIncomes),
    B: sum(watchAssets),
    C: sum(watchLiabilities),
    D: sum(watchSow),
  }), [watchIncomes, watchAssets, watchLiabilities, watchSow]);
  const netWorth = totals.A + totals.B + totals.C + totals.D;

  const onSubmit = async (data: KYCFormData) => {
    try {
      setLoading(true);
      // Simulate submit
      await new Promise((r) => setTimeout(r, 800));
      message.success('KYC submitted successfully');
      navigate(isOfficer ? '/clients' : '/profile');
    } catch (e) {
      message.error('Failed to submit KYC');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="kyc-page">
      <Header className="kyc-header">
        <div className="header-content">
          <Title level={3}>KYC Verification</Title>
          <Text type="secondary">Submit identity documents for {targetUser?.name}</Text>
        </div>
      </Header>
      <Content className="kyc-content">
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* Personal Information snapshot */}
          <Card title={<><UserOutlined /> Personal Information</>} className="kyc-card">
            <Row gutter={[16,16]}>
              <Col xs={24} md={6}><Text strong>First Name:</Text> <br />{targetUser?.personalInfo?.firstName || '-'}</Col>
              <Col xs={24} md={6}><Text strong>Last Name:</Text> <br />{targetUser?.personalInfo?.lastName || '-'}</Col>
              <Col xs={24} md={6}><Text strong>DOB:</Text> <br />{targetUser?.personalInfo?.dateOfBirth || '-'}</Col>
              <Col xs={24} md={6}><Text strong>Age:</Text> <br />{targetUser?.personalInfo?.age || '-'}</Col>
            </Row>
            {!readOnly && (
              <Button type="link" onClick={() => navigate('/profile')} style={{ paddingLeft: 0, marginTop: 8 }}>Edit in Profile</Button>
            )}
          </Card>

          {/* Document Information */}
          <Card title={<><IdcardOutlined /> Document Information</>} className="kyc-card">
            <Row gutter={[16,16]}>
              <Col xs={24} md={12}>
                <Form.Item label="Document Type" required validateStatus={errors.documentType ? 'error' : ''} help={errors.documentType?.message}>
                  <Controller name="documentType" control={control} rules={{ required: 'Document type is required' }} render={({ field }) => (
                    <Select {...field} size="large" disabled={readOnly} options={[{value:'Passport',label:'Passport'},{value:'National ID',label:'National ID'},{value:'Driver License',label:'Driver License'}]} />
                  )} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Document Number" required validateStatus={errors.documentNumber ? 'error' : ''} help={errors.documentNumber?.message}>
                  <Controller name="documentNumber" control={control} rules={{ required: 'Document number is required', minLength: { value: 6, message: 'At least 6 characters' } }} render={({ field }) => (
                    <Input {...field} placeholder="Enter document number" size="large" disabled={readOnly} />
                  )} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Issue Date" required validateStatus={errors.issueDate ? 'error' : ''} help={errors.issueDate?.message}>
                  <Controller name="issueDate" control={control} rules={{ required: 'Issue date is required' }} render={({ field }) => (
                    <DatePicker {...field} value={field.value ? dayjs(field.value) : null} onChange={(d)=>field.onChange(d?.format('YYYY-MM-DD'))} format="DD/MM/YYYY" size="large" style={{width:'100%'}} disabled={readOnly} />
                  )} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Expiry Date" required validateStatus={errors.expiryDate ? 'error' : ''} help={errors.expiryDate?.message}>
                  <Controller name="expiryDate" control={control} rules={{ required: 'Expiry date is required' }} render={({ field }) => (
                    <DatePicker {...field} value={field.value ? dayjs(field.value) : null} onChange={(d)=>field.onChange(d?.format('YYYY-MM-DD'))} format="DD/MM/YYYY" size="large" style={{width:'100%'}} disabled={readOnly} />
                  )} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Issuing Country" required validateStatus={errors.issuingCountry ? 'error' : ''} help={errors.issuingCountry?.message}>
                  <Controller name="issuingCountry" control={control} rules={{ required: 'Country is required' }} render={({ field }) => (
                    <Input {...field} placeholder="Enter issuing country" size="large" disabled={readOnly} />
                  )} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Proof of Address">
                  <Upload beforeUpload={() => false} maxCount={1}>
                    <Button icon={<UploadOutlined />} size="large" disabled={readOnly}>Upload (optional)</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Financial Status */}
          <Card title={<><DollarOutlined /> Financial Status</>} className="kyc-card">
            {/* Incomes (A) */}
            <Card type="inner" title="Incomes (A)" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {incomesArray.fields.map((f, index) => (
                  <Row gutter={12} key={f.id}>
                    <Col xs={24} md={8}>
                      <Form.Item label="Type">
                        <Controller name={`incomes.${index}.type`} control={control} render={({ field }) => (
                          <Select {...field} disabled={readOnly} options={[{value:'Salary',label:'Salary'},{value:'Investment',label:'Investment'},{value:'Others',label:'Others'}]} />
                        )} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Amount">
                        <Controller name={`incomes.${index}.amount`} control={control} rules={{ min: { value: 0, message: 'Must be >= 0' } }} render={({ field }) => (
                          <InputNumber {...field} disabled={readOnly} style={{ width: '100%' }} prefix="$" min={0} />
                        )} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      {!readOnly && (
                        <Button danger onClick={() => incomesArray.remove(index)}>Remove</Button>
                      )}
                    </Col>
                  </Row>
                ))}
                {!readOnly && (
                  <Button onClick={() => incomesArray.append({ id: `inc-${Date.now()}`, type: 'Salary', amount: 0 })}>Add Income</Button>
                )}
                <Statistic title="Total (A)" value={totals.A} precision={2} prefix="$" />
              </Space>
            </Card>

            {/* Assets (B) */}
            <Card type="inner" title="Assets (B)" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {assetsArray.fields.map((f, index) => (
                  <Row gutter={12} key={f.id}>
                    <Col xs={24} md={8}>
                      <Form.Item label="Type">
                        <Controller name={`assets.${index}.type`} control={control} render={({ field }) => (
                          <Select {...field} disabled={readOnly} options={[{value:'Bond',label:'Bond'},{value:'Liquidity',label:'Liquidity'},{value:'Real Estate',label:'Real Estate'},{value:'Others',label:'Others'}]} />
                        )} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Amount">
                        <Controller name={`assets.${index}.amount`} control={control} rules={{ min: { value: 0, message: 'Must be >= 0' } }} render={({ field }) => (
                          <InputNumber {...field} disabled={readOnly} style={{ width: '100%' }} prefix="$" min={0} />
                        )} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      {!readOnly && (
                        <Button danger onClick={() => assetsArray.remove(index)}>Remove</Button>
                      )}
                    </Col>
                  </Row>
                ))}
                {!readOnly && (
                  <Button onClick={() => assetsArray.append({ id: `ass-${Date.now()}`, type: 'Liquidity', amount: 0 })}>Add Asset</Button>
                )}
                <Statistic title="Total (B)" value={totals.B} precision={2} prefix="$" />
              </Space>
            </Card>

            {/* Liabilities (C) */}
            <Card type="inner" title="Liabilities (C)" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {liabilitiesArray.fields.map((f, index) => (
                  <Row gutter={12} key={f.id}>
                    <Col xs={24} md={8}>
                      <Form.Item label="Type">
                        <Controller name={`liabilities.${index}.type`} control={control} render={({ field }) => (
                          <Select {...field} disabled={readOnly} options={[{value:'Personal Loan',label:'Personal Loan'},{value:'Real Estate Loan',label:'Real Estate Loan'},{value:'Others',label:'Others'}]} />
                        )} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Amount">
                        <Controller name={`liabilities.${index}.amount`} control={control} rules={{ min: { value: 0, message: 'Must be >= 0' } }} render={({ field }) => (
                          <InputNumber {...field} disabled={readOnly} style={{ width: '100%' }} prefix="$" min={0} />
                        )} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      {!readOnly && (
                        <Button danger onClick={() => liabilitiesArray.remove(index)}>Remove</Button>
                      )}
                    </Col>
                  </Row>
                ))}
                {!readOnly && (
                  <Button onClick={() => liabilitiesArray.append({ id: `lia-${Date.now()}`, type: 'Personal Loan', amount: 0 })}>Add Liability</Button>
                )}
                <Statistic title="Total (C)" value={totals.C} precision={2} prefix="$" />
              </Space>
            </Card>

            {/* Source of Wealth (D) */}
            <Card type="inner" title="Source of Wealth (D)" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {sowArray.fields.map((f, index) => (
                  <Row gutter={12} key={f.id}>
                    <Col xs={24} md={8}>
                      <Form.Item label="Type">
                        <Controller name={`sourceOfWealth.${index}.type`} control={control} render={({ field }) => (
                          <Select {...field} disabled={readOnly} options={[{value:'Inheritance',label:'Inheritance'},{value:'Donation',label:'Donation'},{value:'Others',label:'Others'}]} />
                        )} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Amount">
                        <Controller name={`sourceOfWealth.${index}.amount`} control={control} rules={{ min: { value: 0, message: 'Must be >= 0' } }} render={({ field }) => (
                          <InputNumber {...field} disabled={readOnly} style={{ width: '100%' }} prefix="$" min={0} />
                        )} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      {!readOnly && (
                        <Button danger onClick={() => sowArray.remove(index)}>Remove</Button>
                      )}
                    </Col>
                  </Row>
                ))}
                {!readOnly && (
                  <Button onClick={() => sowArray.append({ id: `sw-${Date.now()}`, type: 'Inheritance', amount: 0 })}>Add Source</Button>
                )}
                <Statistic title="Total (D)" value={totals.D} precision={2} prefix="$" />
              </Space>
            </Card>

            {/* Net Worth */}
            <Row>
              <Col>
                <Statistic title="Client Net Worth (A + B + C + D)" value={netWorth} precision={2} prefix="$" />
              </Col>
            </Row>
          </Card>

          {/* Investment Experience & Objectives */}
          <Card title="Investment Experience and Objectives" className="kyc-card">
            <Row gutter={[16,16]}>
              <Col xs={24} md={12}>
                <Form.Item label="Experience in financial markets" required validateStatus={errors.experience ? 'error' : ''} help={errors.experience?.toString()}>
                  <Controller name="experience" control={control} rules={{ required: 'Experience is required' }} render={({ field }) => (
                    <Select {...field} disabled={readOnly} options={[
                      { value: '< 5 years', label: '< 5 years' },
                      { value: '> 5 and < 10 years', label: '> 5 and < 10 years' },
                      { value: '> 10 years', label: '> 10 years' },
                    ]} />
                  )} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Risk Tolerance" required validateStatus={errors.riskTolerance ? 'error' : ''} help={errors.riskTolerance?.toString()}>
                  <Controller name="riskTolerance" control={control} rules={{ required: 'Risk tolerance is required' }} render={({ field }) => (
                    <Select {...field} disabled={readOnly} options={[
                      { value: '10%', label: '10%' },
                      { value: '30%', label: '30%' },
                      { value: 'All-in', label: 'All-in' },
                    ]} />
                  )} />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {!readOnly && (
            <Row justify="end" style={{ marginTop: 16 }}>
              <Col>
                <Button type="primary" htmlType="submit" loading={loading} size="large">Submit KYC</Button>
              </Col>
            </Row>
          )}
        </Form>
      </Content>
    </Layout>
  );
};

export default KYCPage;
