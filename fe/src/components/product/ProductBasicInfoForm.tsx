import React from 'react';
import { Form, Input, Select, Row, Col, Button, Alert } from 'antd';
import { ProductFormData } from '@/types/product';

const { TextArea } = Input;
const { Option } = Select;

interface ProductBasicInfoFormProps {
  fillExampleData: () => void;
}

const ProductBasicInfoForm: React.FC<ProductBasicInfoFormProps> = ({
  fillExampleData,
}) => {
  return (
    <Row gutter={[24, 16]}>
      <Col span={24}>
        <Form.Item
          name="name"
          label="Tên sản phẩm"
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
        >
          <Input placeholder="Nhập tên sản phẩm" size="large" />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          name="sku"
          label="Mã sản phẩm (SKU)"
          rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm!' }]}
        >
          <Input placeholder="Nhập mã sản phẩm hoặc để trống để tự tạo" />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="status" label="Trạng thái" initialValue="active">
          <Select placeholder="Chọn trạng thái">
            <Option value="active">✅ Hoạt động</Option>
            <Option value="inactive">⏸️ Không hoạt động</Option>
            <Option value="draft">📝 Bản nháp</Option>
          </Select>
        </Form.Item>
      </Col>

      <Col span={24}>
        <Form.Item
          name="shortDescription"
          label="Mô tả ngắn"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả ngắn!' },
            { min: 5, message: 'Mô tả ngắn phải có ít nhất 5 ký tự' },
          ]}
        >
          <TextArea
            rows={3}
            placeholder="Nhập mô tả ngắn về sản phẩm"
            showCount
            maxLength={200}
          />
        </Form.Item>
      </Col>

      <Col span={24}>
        <Form.Item
          name="description"
          label="Mô tả chi tiết"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả chi tiết!' },
            { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự' },
          ]}
        >
          <TextArea
            rows={6}
            placeholder="Nhập mô tả chi tiết về sản phẩm"
            showCount
            maxLength={1000}
          />
        </Form.Item>
      </Col>

      <Col span={24}>
        <Alert
          message="Mẹo tạo sản phẩm"
          description={
            <div>
              <p>• Chỉ cần điền các trường bắt buộc để tạo sản phẩm nhanh</p>
              <p>• Để trống SKU để hệ thống tự tạo mã duy nhất</p>
              <p>
                • Bạn có thể{' '}
                <Button type="link" size="small" onClick={fillExampleData}>
                  điền dữ liệu mẫu
                </Button>{' '}
                để xem ví dụ
              </p>
            </div>
          }
          type="info"
          showIcon
        />
      </Col>
    </Row>
  );
};

export default ProductBasicInfoForm;
