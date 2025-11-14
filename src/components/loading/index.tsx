import { Spin } from 'antd';
import './loading.scss';

interface LoadingProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  fullscreen?: boolean;
}

export const Loading = ({ size = 'default', tip, fullscreen = false }: LoadingProps) => {
  if (fullscreen) {
    return (
      <div className="loading-container fullscreen">
        <Spin size={size} tip={tip} />
      </div>
    );
  }

  return (
    <div className="loading-container">
      <Spin size={size} tip={tip} />
    </div>
  );
};
