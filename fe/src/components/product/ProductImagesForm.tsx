import React from 'react';
import { Form, Input, Row, Col, Alert } from 'antd';

const { TextArea } = Input;

const ProductImagesForm: React.FC = () => {
  return (
    <Row gutter={[24, 16]}>
      <Col span={24}>
        <Form.Item name="images" label="Hình ảnh sản phẩm">
          <TextArea
            rows={4}
            placeholder="Nhập URL hình ảnh, mỗi URL trên một dòng"
            showCount
            maxLength={2000}
          />
        </Form.Item>
      </Col>

      <Col span={24}>
        <Form.Item name="thumbnail" label="Ảnh đại diện">
          <Input placeholder="Nhập URL ảnh đại diện" />
        </Form.Item>
      </Col>

      <Col span={24}>
        <Alert
          message="Hướng dẫn hình ảnh"
          description={
            <div>
              <p>• Hình ảnh nên có tỷ lệ 1:1 hoặc 4:3 để hiển thị đẹp</p>
              <p>• Kích thước tối thiểu: 400x400px</p>
              <p>• Định dạng: JPG, PNG, WebP</p>
              <p>• Ảnh đại diện sẽ được hiển thị trong danh sách sản phẩm</p>
            </div>
          }
          type="info"
          showIcon
        />
      </Col>
    </Row>
  );
};

export default ProductImagesForm;
