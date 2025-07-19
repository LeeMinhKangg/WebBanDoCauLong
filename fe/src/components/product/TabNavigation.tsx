import React from 'react';
import { Button, Space, Alert } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabOrder: string[];
  isLastTab?: boolean;
  completedSteps?: Record<string, boolean>;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
  tabOrder,
  isLastTab = false,
  completedSteps = {},
}) => {
  const currentIndex = tabOrder.indexOf(activeTab);
  const nextTab =
    currentIndex < tabOrder.length - 1 ? tabOrder[currentIndex + 1] : null;

  const prevTab = currentIndex > 0 ? tabOrder[currentIndex - 1] : null;

  const handleNext = () => {
    // Chỉ cho phép chuyển sang bước tiếp theo nếu bước hiện tại đã hoàn thành
    if (nextTab && completedSteps[activeTab]) {
      setActiveTab(nextTab);
    } else if (nextTab) {
      // Hiển thị thông báo nếu bước hiện tại chưa hoàn thành
      alert('Vui lòng hoàn thành bước hiện tại trước khi tiếp tục');
    }
  };

  const handlePrev = () => {
    if (prevTab) {
      setActiveTab(prevTab);
    }
  };

  // Nếu là tab cuối cùng, không hiển thị nút "Tiếp theo"
  if (isLastTab || !nextTab) {
    return null;
  }

  // Kiểm tra xem bước hiện tại đã hoàn thành chưa
  const isCurrentStepCompleted = completedSteps[activeTab] || false;

  return (
    <div style={{ marginTop: 24, textAlign: 'right' }}>
      <Alert
        message={
          isCurrentStepCompleted
            ? 'Bước này đã hoàn thành'
            : 'Hoàn thành bước này trước khi tiếp tục'
        }
        description={
          isCurrentStepCompleted
            ? 'Bạn có thể tiếp tục sang bước tiếp theo.'
            : 'Vui lòng điền đầy đủ thông tin ở bước này trước khi chuyển sang bước tiếp theo.'
        }
        type={isCurrentStepCompleted ? 'success' : 'info'}
        showIcon
        style={{ marginBottom: 16 }}
      />
      <Space>
        {prevTab && (
          <Button
            onClick={handlePrev}
            icon={<ArrowLeftOutlined />}
            size="large"
          >
            Quay lại
          </Button>
        )}
        <Button
          type="primary"
          onClick={handleNext}
          icon={<ArrowRightOutlined />}
          size="large"
          disabled={!isCurrentStepCompleted}
        >
          Tiếp theo
        </Button>
      </Space>
    </div>
  );
};

export default TabNavigation;
