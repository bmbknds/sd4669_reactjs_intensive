import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './error-message.scss';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  onRetry?: () => void;
}

export const ErrorMessage = ({
  title = 'Something went wrong',
  message = 'An error occurred. Please try again.',
  showBackButton = true,
  onRetry,
}: ErrorMessageProps) => {
  const navigate = useNavigate();

  return (
    <div className="error-message-container">
      <Result
        status="error"
        title={title}
        subTitle={message}
        extra={[
          onRetry && (
            <Button type="primary" key="retry" onClick={onRetry}>
              Retry
            </Button>
          ),
          showBackButton && (
            <Button key="back" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          ),
        ]}
      />
    </div>
  );
};
