import { useState, useEffect, useRef } from 'react';
import { Form, FormInstance, message } from 'antd';
import { ProductFormData } from '@/types/product';

interface UseProductFormProps {
  form: FormInstance;
  initialValues?: Partial<ProductFormData>;
  onSubmit: (values: ProductFormData) => Promise<void>;
  isSubmitting: boolean;
  onStepComplete?: (step: string, isComplete: boolean) => void;
  attributes?: any[];
  variants?: any[];
  isEditMode?: boolean; // Thêm prop để phân biệt edit vs create
}

export const useProductForm = ({
  form,
  initialValues,
  onSubmit,
  isSubmitting,
  onStepComplete,
  attributes = [],
  variants = [],
  isEditMode = false,
}: UseProductFormProps) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Hàm validation độc lập
  const performValidation = () => {
    const values = form.getFieldsValue();
    const errors = form.getFieldsError();

    // Validate và cập nhật completion cho từng step
    const validateStep = (step: string) => {
      let isStepValid = false;

      switch (step) {
        case 'basic':
          const basicRequiredFields = [
            'name',
            'shortDescription',
            'description',
          ];
          isStepValid = basicRequiredFields.every((field) => {
            const value = values[field];
            return (
              value !== undefined &&
              value !== null &&
              value !== '' &&
              (typeof value === 'string' ? value.trim() !== '' : true)
            );
          });
          break;
        case 'attributes':
          // Kiểm tra có ít nhất 1 thuộc tính
          isStepValid = attributes.length > 0;
          break;
        case 'variants':
          // Kiểm tra có ít nhất 1 biến thể
          isStepValid = variants.length > 0;
          break;
        case 'pricing':
          const pricingRequiredFields = ['price', 'stockQuantity'];
          isStepValid = pricingRequiredFields.every((field) => {
            const value = values[field];
            return (
              value !== undefined &&
              value !== null &&
              value !== '' &&
              value >= 0
            );
          });
          break;
        case 'category':
          const categoryValue = values['categoryIds'];
          isStepValid =
            categoryValue &&
            Array.isArray(categoryValue) &&
            categoryValue.length > 0;
          break;
        case 'images':
          // Images không bắt buộc
          isStepValid = true;
          break;
        case 'seo':
          // SEO không bắt buộc
          isStepValid = true;
          break;
        default:
          isStepValid = false;
      }

      // Cập nhật completion status cho step
      if (onStepComplete) {
        onStepComplete(step, isStepValid);
      }

      return isStepValid;
    };

    // Validate tất cả các steps
    const allSteps = [
      'basic',
      'attributes',
      'variants',
      'pricing',
      'category',
      'images',
      'seo',
    ];
    allSteps.forEach((step) => validateStep(step));

    // Validate step hiện tại
    const currentStepValid = validateStep(activeTab);

    // Check if there are any validation errors
    const hasErrors = errors.some(
      (error) => error.errors && error.errors.length > 0
    );

    // Form chỉ valid khi không có lỗi
    const isValid = !hasErrors;
    setIsFormValid(isValid);

    return currentStepValid;
  };

  // Theo dõi sự thay đổi của activeTab, attributes, variants
  useEffect(() => {
    // Khi tab thay đổi, kiểm tra tính hợp lệ của form
    performValidation();
  }, [activeTab, attributes, variants]);

  // Set initial values
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  // Watch for form value changes to update validation
  const watchFormValues = Form.useWatch([], form);

  // Sử dụng useRef để tránh vòng lặp vô hạn
  const isFirstRender = useRef(true);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Skip validation on first render to avoid unnecessary validation
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Clear previous timeout to avoid multiple validations
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    // Use a local validation function instead of calling validateForm directly
    // to avoid the dependency cycle
    const validateFormValues = () => {
      const values = form.getFieldsValue();
      const errors = form.getFieldsError();

      // Check if all required fields are filled
      const requiredFields = [
        'name',
        'shortDescription',
        'description',
        'price',
        'stockQuantity',
        'categoryIds',
        // Thêm thuộc tính và biến thể vào danh sách trường bắt buộc
        // 'attributes',
        // 'variants',
      ];

      const isFieldsFilled = requiredFields.every((field) => {
        const value = values[field];
        if (field === 'categoryIds') {
          return value && Array.isArray(value) && value.length > 0;
        }
        if (field === 'price' || field === 'stockQuantity') {
          return (
            value !== undefined && value !== null && value !== '' && value >= 0
          );
        }
        // Kiểm tra thuộc tính và biến thể nếu cần
        // if (field === 'attributes') {
        //   // Kiểm tra xem có thuộc tính nào không
        //   return value && Array.isArray(value) && value.length > 0;
        // }
        // if (field === 'variants') {
        //   // Kiểm tra xem có biến thể nào không
        //   return value && Array.isArray(value) && value.length > 0;
        // }
        return (
          value !== undefined &&
          value !== null &&
          value !== '' &&
          (typeof value === 'string' ? value.trim() !== '' : true)
        );
      });

      // Check if there are any validation errors
      const hasErrors = errors.some(
        (error) => error.errors && error.errors.length > 0
      );

      const isValid = isFieldsFilled && !hasErrors;
      setIsFormValid(isValid);
    };

    // Sử dụng setTimeout để tránh quá nhiều validation liên tục
    validationTimeoutRef.current = setTimeout(() => {
      validateFormValues();
    }, 100);

    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, [watchFormValues, form]);

  // Validate form - this is now used for manual validation
  // (e.g. when called from outside the hook)
  const validateForm = () => {
    return performValidation();
  };

  // Get missing required fields for display
  const getMissingFields = () => {
    const values = form.getFieldsValue();
    console.log('getMissingFields - attributes:', attributes);
    console.log('getMissingFields - variants:', variants);
    console.log('getMissingFields - isEditMode:', isEditMode);

    const fieldLabels = {
      name: 'Tên sản phẩm',
      shortDescription: 'Mô tả ngắn',
      description: 'Mô tả chi tiết',
      price: 'Giá bán',
      stockQuantity: 'Số lượng tồn kho',
      categoryIds: 'Danh mục',
      attributes: 'Thuộc tính sản phẩm',
      variants: 'Biến thể sản phẩm',
    };

    // Chỉ kiểm tra các trường form cơ bản, không kiểm tra attributes và variants
    // vì chúng được quản lý trong state riêng biệt
    const requiredFields = [
      'name',
      'shortDescription',
      'description',
      'price',
      'stockQuantity',
      'categoryIds',
    ];

    const missingFields = requiredFields.filter((field) => {
      const value = values[field];
      if (field === 'categoryIds') {
        return !value || !Array.isArray(value) || value.length === 0;
      }
      if (field === 'price' || field === 'stockQuantity') {
        return (
          value === undefined || value === null || value === '' || value < 0
        );
      }
      return (
        value === undefined ||
        value === null ||
        value === '' ||
        (typeof value === 'string' && value.trim() === '')
      );
    });

    // Thêm attributes và variants vào missing fields nếu chúng trống
    // Nhưng chỉ khi đang ở CreateProductPage (không phải EditProductPage)
    if (!isEditMode) {
      if (attributes.length === 0) {
        missingFields.push('attributes');
      }
      if (variants.length === 0) {
        missingFields.push('variants');
      }
    }

    return missingFields.map(
      (field) => fieldLabels[field as keyof typeof fieldLabels]
    );
  };

  // Fill example data
  const fillExampleData = () => {
    form.setFieldsValue({
      name: 'iPhone 15 Pro Max 256GB',
      description:
        'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP và màn hình Super Retina XDR 6.7 inch sắc nét.',
      shortDescription: 'Flagship mới nhất từ Apple với hiệu năng vượt trội',
      price: 29990000,
      compareAtPrice: 32990000,
      stockQuantity: 100,
      sku: 'IP15PM-256-TIT',
      status: 'active',
      featured: true,
      categoryIds: [1], // Thêm category mặc định
      searchKeywords: 'iphone, apple, smartphone, 15 pro max',
      seoTitle: 'iPhone 15 Pro Max 256GB - Chính hãng Apple',
      seoDescription:
        'Mua iPhone 15 Pro Max 256GB chính hãng với giá tốt nhất. Bảo hành 12 tháng.',
      seoKeywords: 'iphone 15 pro max, apple, smartphone, điện thoại',
    });

    // Trigger validation sau khi fill data
    setTimeout(() => {
      performValidation();
    }, 100);
  };

  // Handle form submission
  const handleSubmit = async (values: ProductFormData) => {
    // Nếu đang ở chế độ chỉnh sửa (EditProductPage), cho phép submit mà không cần kiểm tra đầy đủ
    if (isEditMode) {
      try {
        await onSubmit(values);
      } catch (error: any) {
        console.error('Form submission failed:', error);
        message.error('Có lỗi xảy ra khi lưu sản phẩm. Vui lòng thử lại.');
      }
      return;
    }

    // Nếu đang ở chế độ tạo mới (CreateProductPage), kiểm tra các trường bắt buộc
    const missingFieldNames = getMissingFields();

    if (missingFieldNames.length > 0) {
      // Hiển thị thông báo về các trường còn thiếu
      message.error(
        `Vui lòng điền đầy đủ thông tin: ${missingFieldNames.join(', ')}`
      );
      return;
    }

    try {
      await onSubmit(values);
    } catch (error: any) {
      console.error('Form submission failed:', error);
      message.error('Có lỗi xảy ra khi lưu sản phẩm. Vui lòng thử lại.');
    }
  };

  return {
    isFormValid,
    setIsFormValid,
    activeTab,
    setActiveTab,
    validateForm,
    getMissingFields,
    fillExampleData,
    handleSubmit,
    isSubmitting,
  };
};
