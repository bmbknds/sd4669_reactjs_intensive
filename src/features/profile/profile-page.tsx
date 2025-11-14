import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Layout,
  Card,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Upload,
  message,
  Checkbox,
  InputNumber,
} from 'antd';
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  IdcardOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import dayjs from 'dayjs';
import { useAuth } from '../../hooks/use-auth';
import { useAuthStore } from '../../store/auth-store';
import { PersonalInfo } from '../../types';
import './profile-page.scss';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

interface ProfileFormData extends Omit<PersonalInfo, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'age'> {
  dateOfBirth: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user, isOfficer } = useAuth();
  const updateUserProfile = useAuthStore((state) => state.updateUserProfile);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Determine if this is viewing another user's profile (officer viewing client)
  const isViewingOtherProfile = userId && userId !== user?.id;
  const canEdit = !isOfficer && !isViewingOtherProfile;

  // Get default values from user's personal info or use fallback
  const defaultValues: ProfileFormData = user?.personalInfo
    ? {
        firstName: user.personalInfo.firstName,
        middleName: user.personalInfo.middleName,
        lastName: user.personalInfo.lastName,
        dateOfBirth: user.personalInfo.dateOfBirth,
        emails: user.personalInfo.emails,
        phones: user.personalInfo.phones,
        addresses: user.personalInfo.addresses,
        identificationDocuments: user.personalInfo.identificationDocuments,
        occupations: user.personalInfo.occupations,
      }
    : {
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        emails: [{ id: '1', email: user?.email || '', type: 'Personal', preferred: true }],
        phones: [{ id: '1', number: '', type: 'Personal', preferred: true }],
        addresses: [
          {
            id: '1',
            country: '',
            city: '',
            street: '',
            postalCode: '',
            type: 'Mailing',
          },
        ],
        identificationDocuments: {},
        occupations: [{ id: '1', name: '', fromYear: new Date().getFullYear(), toYear: undefined }],
      };

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues,
  });

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({
    control,
    name: 'emails',
  });

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control,
    name: 'phones',
  });

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({
    control,
    name: 'addresses',
  });

  const {
    fields: occupationFields,
    append: appendOccupation,
    remove: removeOccupation,
  } = useFieldArray({
    control,
    name: 'occupations',
  });

  // Calculate age from date of birth
  const dateOfBirth = watch('dateOfBirth');
  const calculatedAge = dateOfBirth
    ? dayjs().diff(dayjs(dateOfBirth), 'year')
    : 0;

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      
      // Calculate age from date of birth
      const age = dayjs().diff(dayjs(data.dateOfBirth), 'year');
      
      // Create updated personal info
      const updatedPersonalInfo: PersonalInfo = {
        id: user?.personalInfo?.id || 'p' + user?.id,
        userId: user?.id || '',
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        age,
        emails: data.emails,
        phones: data.phones,
        addresses: data.addresses,
        identificationDocuments: data.identificationDocuments,
        occupations: data.occupations,
        createdAt: user?.personalInfo?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update user name based on first and last name
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      
      // Update user profile in auth store
      updateUserProfile({
        name: fullName,
        personalInfo: updatedPersonalInfo,
      });

      message.success('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    reset(defaultValues);
  };

  const handleNavigateToKYC = () => {
    navigate('/kyc');
  };

  return (
    <Layout className="profile-page">
      <Header className="profile-header">
        <div className="header-content">
          <div className="header-left">
            <Title level={3}>
              {isViewingOtherProfile ? 'Client Profile' : 'My Profile'}
            </Title>
            <Text type="secondary">
              {isViewingOtherProfile
                ? 'Viewing client information (Read-only)'
                : 'Manage your personal information'}
            </Text>
          </div>
          <Space>
            {canEdit && !editMode && (
              <>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setEditMode(true)}
                  size="large"
                >
                  Edit Profile
                </Button>
                <Button
                  icon={<IdcardOutlined />}
                  onClick={handleNavigateToKYC}
                  size="large"
                >
                  KYC Verification
                </Button>
              </>
            )}
            {editMode && (
              <>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSubmit(onSubmit)}
                  loading={loading}
                  size="large"
                >
                  Save Changes
                </Button>
                <Button icon={<CloseOutlined />} onClick={handleCancel} size="large">
                  Cancel
                </Button>
              </>
            )}
          </Space>
        </div>
      </Header>

      <Content className="profile-content">
        <Form layout="vertical" className="profile-form">
          {/* Basic Information */}
          <Card
            title={
              <Space>
                <UserOutlined />
                <span>Basic Information</span>
              </Space>
            }
            className="profile-card"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="First Name"
                  required
                  validateStatus={errors.firstName ? 'error' : ''}
                  help={errors.firstName?.message}
                >
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: 'First name is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter first name"
                        disabled={!editMode}
                        size="large"
                      />
                    )}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Middle Name">
                  <Controller
                    name="middleName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter middle name (optional)"
                        disabled={!editMode}
                        size="large"
                      />
                    )}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Last Name"
                  required
                  validateStatus={errors.lastName ? 'error' : ''}
                  help={errors.lastName?.message}
                >
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: 'Last name is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter last name"
                        disabled={!editMode}
                        size="large"
                      />
                    )}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Date of Birth"
                  required
                  validateStatus={errors.dateOfBirth ? 'error' : ''}
                  help={errors.dateOfBirth?.message}
                >
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    rules={{ required: 'Date of birth is required' }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => field.onChange(date?.format('YYYY-MM-DD'))}
                        format="DD/MM/YYYY"
                        placeholder="Select date"
                        disabled={!editMode}
                        size="large"
                        style={{ width: '100%' }}
                      />
                    )}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Age">
                  <Input
                    value={calculatedAge}
                    disabled
                    size="large"
                    suffix="years"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Contact Information - Emails */}
          <Card
            title={
              <Space>
                <MailOutlined />
                <span>Email Addresses</span>
              </Space>
            }
            extra={
              editMode && (
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() =>
                    appendEmail({
                      id: Date.now().toString(),
                      email: '',
                      type: 'Personal',
                      preferred: false,
                    })
                  }
                >
                  Add Email
                </Button>
              )
            }
            className="profile-card"
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {emailFields.map((field, index) => (
                <Card key={field.id} type="inner" size="small">
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Email"
                        required
                        validateStatus={errors.emails?.[index]?.email ? 'error' : ''}
                        help={errors.emails?.[index]?.email?.message}
                      >
                        <Controller
                          name={`emails.${index}.email`}
                          control={control}
                          rules={{
                            required: 'Email is required',
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'Invalid email format',
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="email@example.com"
                              disabled={!editMode}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={12} sm={6}>
                      <Form.Item label="Type" required>
                        <Controller
                          name={`emails.${index}.type`}
                          control={control}
                          render={({ field }) => (
                            <Select {...field} disabled={!editMode}>
                              <Option value="Work">Work</Option>
                              <Option value="Personal">Personal</Option>
                            </Select>
                          )}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={12} sm={4}>
                      <Form.Item label="Preferred">
                        <Controller
                          name={`emails.${index}.preferred`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              {...field}
                              checked={field.value}
                              disabled={!editMode}
                            >
                              Primary
                            </Checkbox>
                          )}
                        />
                      </Form.Item>
                    </Col>

                    {editMode && emailFields.length > 1 && (
                      <Col xs={24} sm={2}>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeEmail(index)}
                        />
                      </Col>
                    )}
                  </Row>
                </Card>
              ))}
            </Space>
          </Card>

          {/* Contact Information - Phones */}
          <Card
            title={
              <Space>
                <PhoneOutlined />
                <span>Phone Numbers</span>
              </Space>
            }
            extra={
              editMode && (
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() =>
                    appendPhone({
                      id: Date.now().toString(),
                      number: '',
                      type: 'Personal',
                      preferred: false,
                    })
                  }
                >
                  Add Phone
                </Button>
              )
            }
            className="profile-card"
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {phoneFields.map((field, index) => (
                <Card key={field.id} type="inner" size="small">
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Phone Number"
                        required
                        validateStatus={errors.phones?.[index]?.number ? 'error' : ''}
                        help={errors.phones?.[index]?.number?.message}
                      >
                        <Controller
                          name={`phones.${index}.number`}
                          control={control}
                          rules={{ required: 'Phone number is required' }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="+1 234 567 8900"
                              disabled={!editMode}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={12} sm={6}>
                      <Form.Item label="Type" required>
                        <Controller
                          name={`phones.${index}.type`}
                          control={control}
                          render={({ field }) => (
                            <Select {...field} disabled={!editMode}>
                              <Option value="Work">Work</Option>
                              <Option value="Personal">Personal</Option>
                            </Select>
                          )}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={12} sm={4}>
                      <Form.Item label="Preferred">
                        <Controller
                          name={`phones.${index}.preferred`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              {...field}
                              checked={field.value}
                              disabled={!editMode}
                            >
                              Primary
                            </Checkbox>
                          )}
                        />
                      </Form.Item>
                    </Col>

                    {editMode && phoneFields.length > 1 && (
                      <Col xs={24} sm={2}>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removePhone(index)}
                        />
                      </Col>
                    )}
                  </Row>
                </Card>
              ))}
            </Space>
          </Card>

          {/* Addresses */}
          <Card
            title={
              <Space>
                <HomeOutlined />
                <span>Addresses</span>
              </Space>
            }
            extra={
              editMode && (
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() =>
                    appendAddress({
                      id: Date.now().toString(),
                      country: '',
                      city: '',
                      street: '',
                      postalCode: '',
                      type: 'Mailing',
                    })
                  }
                >
                  Add Address
                </Button>
              )
            }
            className="profile-card"
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {addressFields.map((field, index) => (
                <Card key={field.id} type="inner" size="small">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Country"
                        required
                        validateStatus={errors.addresses?.[index]?.country ? 'error' : ''}
                        help={errors.addresses?.[index]?.country?.message}
                      >
                        <Controller
                          name={`addresses.${index}.country`}
                          control={control}
                          rules={{ required: 'Country is required' }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter country"
                              disabled={!editMode}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="City"
                        required
                        validateStatus={errors.addresses?.[index]?.city ? 'error' : ''}
                        help={errors.addresses?.[index]?.city?.message}
                      >
                        <Controller
                          name={`addresses.${index}.city`}
                          control={control}
                          rules={{ required: 'City is required' }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter city"
                              disabled={!editMode}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Street"
                        required
                        validateStatus={errors.addresses?.[index]?.street ? 'error' : ''}
                        help={errors.addresses?.[index]?.street?.message}
                      >
                        <Controller
                          name={`addresses.${index}.street`}
                          control={control}
                          rules={{ required: 'Street is required' }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter street address"
                              disabled={!editMode}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={6}>
                      <Form.Item label="Postal Code">
                        <Controller
                          name={`addresses.${index}.postalCode`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Optional"
                              disabled={!editMode}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={12} sm={4}>
                      <Form.Item label="Type" required>
                        <Controller
                          name={`addresses.${index}.type`}
                          control={control}
                          render={({ field }) => (
                            <Select {...field} disabled={!editMode}>
                              <Option value="Mailing">Mailing</Option>
                              <Option value="Work">Work</Option>
                            </Select>
                          )}
                        />
                      </Form.Item>
                    </Col>

                    {editMode && addressFields.length > 1 && (
                      <Col xs={24} sm={2}>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeAddress(index)}
                          style={{ marginTop: 30 }}
                        />
                      </Col>
                    )}
                  </Row>
                </Card>
              ))}
            </Space>
          </Card>

          {/* Identification Documents */}
          <Card
            title={
              <Space>
                <IdcardOutlined />
                <span>Identification Documents</span>
              </Space>
            }
            className="profile-card"
          >
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              Upload at least one identification document (Passport, National ID, or Driver's
              License)
            </Text>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Form.Item label="Passport">
                  <Controller
                    name="identificationDocuments.passport"
                    control={control}
                    render={() => (
                      <Upload
                        disabled={!editMode}
                        maxCount={1}
                        listType="picture-card"
                        beforeUpload={() => false}
                      >
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      </Upload>
                    )}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item label="National ID">
                  <Controller
                    name="identificationDocuments.nationalId"
                    control={control}
                    render={() => (
                      <Upload
                        disabled={!editMode}
                        maxCount={1}
                        listType="picture-card"
                        beforeUpload={() => false}
                      >
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      </Upload>
                    )}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item label="Driver's License">
                  <Controller
                    name="identificationDocuments.driverLicense"
                    control={control}
                    render={() => (
                      <Upload
                        disabled={!editMode}
                        maxCount={1}
                        listType="picture-card"
                        beforeUpload={() => false}
                      >
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      </Upload>
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Occupation and Employment */}
          <Card
            title={
              <Space>
                <ProjectOutlined />
                <span>Occupation and Employment Information</span>
              </Space>
            }
            extra={
              editMode && (
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() =>
                    appendOccupation({
                      id: Date.now().toString(),
                      name: '',
                      fromYear: new Date().getFullYear(),
                      toYear: undefined,
                    })
                  }
                >
                  Add Occupation
                </Button>
              )
            }
            className="profile-card"
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {occupationFields.map((field, index) => (
                <Card key={field.id} type="inner" size="small">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Employer/Position Name"
                        required
                        validateStatus={errors.occupations?.[index]?.name ? 'error' : ''}
                        help={errors.occupations?.[index]?.name?.message}
                      >
                        <Controller
                          name={`occupations.${index}.name`}
                          control={control}
                          rules={{ required: 'Occupation name is required' }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter employer or position"
                              disabled={!editMode}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={12} sm={5}>
                      <Form.Item
                        label="From Year (YYYY)"
                        required
                        validateStatus={errors.occupations?.[index]?.fromYear ? 'error' : ''}
                        help={errors.occupations?.[index]?.fromYear?.message}
                      >
                        <Controller
                          name={`occupations.${index}.fromYear`}
                          control={control}
                          rules={{
                            required: 'From year is required',
                            min: { value: 1900, message: 'Invalid year' },
                            max: {
                              value: new Date().getFullYear(),
                              message: 'Year cannot be in the future',
                            },
                          }}
                          render={({ field }) => (
                            <InputNumber
                              {...field}
                              placeholder="YYYY"
                              disabled={!editMode}
                              style={{ width: '100%' }}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={12} sm={5}>
                      <Form.Item
                        label="To Year (YYYY)"
                        validateStatus={errors.occupations?.[index]?.toYear ? 'error' : ''}
                        help={errors.occupations?.[index]?.toYear?.message}
                      >
                        <Controller
                          name={`occupations.${index}.toYear`}
                          control={control}
                          rules={{
                            validate: (value) => {
                              const fromYear = watch(`occupations.${index}.fromYear`);
                              if (value && fromYear && value <= fromYear) {
                                return 'To year must be greater than from year';
                              }
                              return true;
                            },
                          }}
                          render={({ field }) => (
                            <InputNumber
                              {...field}
                              placeholder="Optional"
                              disabled={!editMode}
                              style={{ width: '100%' }}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>

                    {editMode && (
                      <Col xs={24} sm={2}>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeOccupation(index)}
                          style={{ marginTop: 30 }}
                        />
                      </Col>
                    )}
                  </Row>
                </Card>
              ))}
            </Space>
          </Card>
        </Form>
      </Content>
    </Layout>
  );
};

export default ProfilePage;
