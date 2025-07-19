import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Card,
  Tabs,
  Divider,
  Typography,
  Row,
  Col,
  Button,
  message,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

// Custom hooks
import { useProductForm } from '@/hooks/useProductForm';
import { useProductAttributes } from '@/hooks/useProductAttributes';
import { useProductVariants } from '@/hooks/useProductVariants';

// API hooks
import { useCreateProductMutation } from '@/services/adminProductApi';
import { useGetAllCategoriesQuery } from '@/services/categoryApi';

// Components
import ProductBasicInfoForm from '@/components/product/ProductBasicInfoForm';
import ProductPricingForm from '@/components/product/ProductPricingForm';
import ProductCategoryForm from '@/components/product/ProductCategoryForm';
import ProductImagesForm from '@/components/product/ProductImagesForm';
import ProductAttributesSection from '@/components/product/ProductAttributesSection';
import ProductVariantsSection from '@/components/product/ProductVariantsSection';
import ProductSeoForm from '@/components/product/ProductSeoForm';
import ValidationAlerts from '@/components/product/ValidationAlerts';
import FormActions from '@/components/product/FormActions';
import TabNavigation from '@/components/product/TabNavigation';
import AttributeModal from '@/components/modals/AttributeModal';
import VariantModal from '@/components/modals/VariantModal';

// Types
import { ProductFormData } from '@/types/product';

const { Title, Text } = Typography;

const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // State để theo dõi các bước đã hoàn thành
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(
    {
      basic: false,
      attributes: false,
      variants: false,
      pricing: false,
      category: false,
      images: false,
      seo: false,
    }
  );

  // API hooks
  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useGetAllCategoriesQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  const {
    attributes,
    attributeModalVisible,
    editingAttribute,
    handleAddAttribute,
    handleDeleteAttribute,
    openAttributeModal,
    closeAttributeModal,
  } = useProductAttributes();

  const {
    variants,
    variantModalVisible,
    editingVariant,
    handleAddVariant,
    handleDeleteVariant,
    openVariantModal,
    closeVariantModal,
  } = useProductVariants([], form);

  // Debug: Log attributes whenever they change
  useEffect(() => {
    console.log('Current attributes in CreateProductPage:', attributes);
  }, [attributes]);

  // Debug: Log variants whenever they change
  useEffect(() => {
    console.log('Current variants in CreateProductPage:', variants);
  }, [variants]);

  // Custom hooks
  const {
    isFormValid,
    activeTab,
    setActiveTab,
    validateForm,
    getMissingFields,
    fillExampleData,
    handleSubmit,
  } = useProductForm({
    form,
    initialValues: {
      status: 'active',
      featured: false,
      stockQuantity: 0,
      price: 0,
    },
    attributes,
    variants,
    onStepComplete: (step, isComplete) => {
      setCompletedSteps((prev) => ({
        ...prev,
        [step]: isComplete,
      }));
    },
    onSubmit: async (values: ProductFormData) => {
      try {
        const productData = {
          name: values.name,
          shortDescription: values.shortDescription,
          description: values.description,
          price: parseFloat(values.price ? values.price.toString() : '0') || 0,
          comparePrice:
            parseFloat(
              values.compareAtPrice ? values.compareAtPrice.toString() : '0'
            ) || undefined,
          stock:
            parseInt(
              values.stockQuantity ? values.stockQuantity.toString() : '0'
            ) || 0,
          sku: values.sku || `PROD-${Date.now()}`,
          status: values.status || 'active',
          featured: values.featured, // Thêm trường featured
          categoryIds: values.categoryIds || [],
          images: values.images
            ? typeof values.images === 'string'
              ? values.images.split('\n').filter((img: string) => img.trim())
              : Array.isArray(values.images)
                ? values.images
                : []
            : [],
          attributes:
            attributes.length > 0
              ? attributes.map((attr) => ({
                  name: attr.name,
                  value: attr.value,
                }))
              : [],
          variants:
            variants.length > 0
              ? variants.map((variant) => ({
                  name: variant.name,
                  price: variant.price || 0,
                  stock: variant.stock,
                  sku:
                    variant.sku ||
                    `VAR-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                  attributes: variant.attributes || {},
                }))
              : [],
          // Thêm các trường SEO - chỉ thêm nếu có giá trị
          ...(values.seoTitle ? { seoTitle: values.seoTitle } : {}),
          ...(values.seoDescription
            ? { seoDescription: values.seoDescription }
            : {}),
          ...(values.seoKeywords
            ? {
                seoKeywords:
                  typeof values.seoKeywords === 'string'
                    ? values.seoKeywords.split(',').map((kw) => kw.trim())
                    : Array.isArray(values.seoKeywords)
                      ? values.seoKeywords
                      : [],
              }
            : { seoKeywords: [] }),
        };

        console.log('Sending product data to server:', productData);
        await createProduct(productData).unwrap();
        message.success('Tạo sản phẩm thành công!');
        navigate('/admin/products');
      } catch (error: any) {
        console.error('Failed to create product:', error);
        const errorMessage = formatErrorMessage(error);
        message.error(errorMessage);
      }
    },
    isSubmitting: isCreating,
  });

  // Helper function to format error messages
  const formatErrorMessage = (error: any): string => {
    if (error?.data?.message) {
      return error.data.message;
    }

    if (error?.data?.errors && error.data.errors.length > 0) {
      if (error.data.errors.length === 1) {
        return (
          error.data.errors[0].message ||
          `${error.data.errors[0].field}: Lỗi validation`
        );
      }

      // Multiple errors - format nicely
      const errorList = error.data.errors
        .map((err: any) => err.message || `${err.field}: Lỗi validation`)
        .join('\n• ');
      return `Có ${error.data.errors.length} lỗi cần khắc phục:\n• ${errorList}`;
    }

    if (error?.message) {
      return error.message;
    }

    return 'Tạo sản phẩm thất bại. Vui lòng thử lại.';
  };

  const categories = categoriesResponse?.data || [];

  // Hàm kiểm tra xem tab có được phép truy cập không
  const isTabAccessible = (tabKey: string): boolean => {
    const tabOrder = [
      'basic',
      'attributes',
      'variants',
      'pricing',
      'category',
      'images',
      'seo',
    ];

    const targetIndex = tabOrder.indexOf(tabKey);

    // Tab đầu tiên luôn có thể truy cập
    if (targetIndex === 0) return true;

    // Kiểm tra xem tất cả các tab trước đó đã hoàn thành chưa
    for (let i = 0; i < targetIndex; i++) {
      const stepKey = tabOrder[i];
      if (!completedSteps[stepKey]) {
        return false;
      }
    }

    return true;
  };

  // Hàm xử lý khi thay đổi tab
  const handleTabChange = (key: string) => {
    if (!isTabAccessible(key)) {
      // Hiển thị thông báo nếu tab chưa được phép truy cập
      alert('Vui lòng hoàn thành các bước trước đó trước khi truy cập tab này');
      return;
    }
    setActiveTab(key);
  };

  const tabItems = [
    {
      key: 'basic',
      label: (
        <span
          style={{
            color: completedSteps.basic
              ? '#52c41a'
              : isTabAccessible('basic')
                ? '#000'
                : '#999',
          }}
        >
          1. Thông tin cơ bản {completedSteps.basic ? '✓' : ''}
        </span>
      ),
      disabled: !isTabAccessible('basic'),
      children: (
        <>
          <ProductBasicInfoForm fillExampleData={fillExampleData} />
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabOrder={[
              'basic',
              'attributes',
              'variants',
              'pricing',
              'category',
              'images',
              'seo',
            ]}
            completedSteps={completedSteps}
          />
        </>
      ),
    },
    {
      key: 'attributes',
      label: (
        <span
          style={{
            color: completedSteps.attributes
              ? '#52c41a'
              : isTabAccessible('attributes')
                ? '#000'
                : '#999',
          }}
        >
          2. Thuộc tính <span style={{ color: '#ff4d4f' }}>*</span>{' '}
          {completedSteps.attributes ? '✓' : ''}
        </span>
      ),
      disabled: !isTabAccessible('attributes'),
      children: (
        <>
          <ProductAttributesSection
            attributes={attributes}
            onAddAttribute={() => openAttributeModal()}
            onEditAttribute={(attribute) => openAttributeModal(attribute)}
            onDeleteAttribute={handleDeleteAttribute}
          />
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabOrder={[
              'basic',
              'attributes',
              'variants',
              'pricing',
              'category',
              'images',
              'seo',
            ]}
            completedSteps={completedSteps}
          />
        </>
      ),
    },
    {
      key: 'variants',
      label: (
        <span
          style={{
            color: completedSteps.variants
              ? '#52c41a'
              : isTabAccessible('variants')
                ? '#000'
                : '#999',
          }}
        >
          3. Biến thể <span style={{ color: '#ff4d4f' }}>*</span>{' '}
          {completedSteps.variants ? '✓' : ''}
        </span>
      ),
      disabled: !isTabAccessible('variants'),
      children: (
        <>
          <ProductVariantsSection
            variants={variants}
            onAddVariant={() => openVariantModal()}
            onEditVariant={(variant) => openVariantModal(variant)}
            onDeleteVariant={handleDeleteVariant}
          />
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabOrder={[
              'basic',
              'attributes',
              'variants',
              'pricing',
              'category',
              'images',
              'seo',
            ]}
            completedSteps={completedSteps}
          />
        </>
      ),
    },
    {
      key: 'pricing',
      label: (
        <span
          style={{
            color: completedSteps.pricing
              ? '#52c41a'
              : isTabAccessible('pricing')
                ? '#000'
                : '#999',
          }}
        >
          4. Giá & Kho hàng {completedSteps.pricing ? '✓' : ''}
        </span>
      ),
      disabled: !isTabAccessible('pricing'),
      children: (
        <>
          <ProductPricingForm hasVariants={variants.length > 0} />
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabOrder={[
              'basic',
              'attributes',
              'variants',
              'pricing',
              'category',
              'images',
              'seo',
            ]}
            completedSteps={completedSteps}
          />
        </>
      ),
    },
    {
      key: 'category',
      label: (
        <span
          style={{
            color: completedSteps.category
              ? '#52c41a'
              : isTabAccessible('category')
                ? '#000'
                : '#999',
          }}
        >
          5. Phân loại {completedSteps.category ? '✓' : ''}
        </span>
      ),
      disabled: !isTabAccessible('category'),
      children: (
        <>
          <ProductCategoryForm
            categories={categories}
            isLoading={isCategoriesLoading}
          />
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabOrder={[
              'basic',
              'attributes',
              'variants',
              'pricing',
              'category',
              'images',
              'seo',
            ]}
            completedSteps={completedSteps}
          />
        </>
      ),
    },
    {
      key: 'images',
      label: (
        <span
          style={{
            color: completedSteps.images
              ? '#52c41a'
              : isTabAccessible('images')
                ? '#000'
                : '#999',
          }}
        >
          6. Hình ảnh {completedSteps.images ? '✓' : ''}
        </span>
      ),
      disabled: !isTabAccessible('images'),
      children: (
        <>
          <ProductImagesForm />
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabOrder={[
              'basic',
              'attributes',
              'variants',
              'pricing',
              'category',
              'images',
              'seo',
            ]}
            completedSteps={completedSteps}
          />
        </>
      ),
    },
    {
      key: 'seo',
      label: (
        <span
          style={{
            color: completedSteps.seo
              ? '#52c41a'
              : isTabAccessible('seo')
                ? '#000'
                : '#999',
          }}
        >
          7. SEO {completedSteps.seo ? '✓' : ''}
        </span>
      ),
      disabled: !isTabAccessible('seo'),
      children: (
        <>
          <ProductSeoForm />
          {/* Không cần TabNavigation ở tab cuối cùng */}
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Tạo sản phẩm mới
            </Title>
            <Text type="secondary">
              Tạo sản phẩm mới với thông tin chi tiết
            </Text>
          </Col>
          <Col>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/admin/products')}
              style={{ marginRight: 8 }}
            >
              Quay lại
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Form */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onFieldsChange={validateForm}
          initialValues={{
            status: 'active',
            featured: false,
            stockQuantity: 0,
            price: 0,
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={tabItems}
            style={{ minHeight: 400 }}
          />

          <Divider />

          <ValidationAlerts
            isFormValid={isFormValid}
            missingFields={getMissingFields()}
          />

          <FormActions
            isFormValid={isFormValid}
            isSubmitting={isCreating}
            submitText="Tạo sản phẩm"
            loadingText="Đang tạo..."
            onCancel={() => navigate('/admin/products')}
          />
        </Form>
      </Card>

      {/* Modals */}
      {attributeModalVisible && (
        <AttributeModal
          visible={attributeModalVisible}
          onClose={closeAttributeModal}
          attribute={editingAttribute}
          onSave={handleAddAttribute}
        />
      )}

      {variantModalVisible && (
        <VariantModal
          visible={variantModalVisible}
          onClose={closeVariantModal}
          variant={editingVariant}
          onSave={handleAddVariant}
          attributes={attributes}
        />
      )}
    </div>
  );
};

export default CreateProductPage;
