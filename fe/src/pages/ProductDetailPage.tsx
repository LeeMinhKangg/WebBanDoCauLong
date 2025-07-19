import { PremiumButton } from '@/components/common';
import Badge from '@/components/common/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Rating } from '@/components/common/Rating';
import ProductCard from '@/components/features/ProductCard';
import ProductReviews from '@/components/features/ProductReviews';
import { productApi } from '@/services/productApi';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RootState } from '@/store';
import { v4 as uuidv4 } from 'uuid';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import { addItem, setServerCart } from '@/features/cart/cartSlice';
import { addNotification } from '@/features/ui/uiSlice';
import { useAddToCartMutation } from '@/services/cartApi';
import {
  getVariantStock,
  findVariantByAttributes,
  getAttributeValuesWithStock,
  areAllAttributesSelected,
  getVariantPrice,
  formatStockText,
  getStockStatusColor,
  hasVariants,
} from '@/utils/productHelpers';

const ProductDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Lấy thông tin đăng nhập từ Redux store
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  // API hooks
  const {
    data: productData,
    isLoading,
    error,
  } = productApi.useGetProductByIdQuery(productId || '', {
    skip: !productId,
  });

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const { data: relatedProductsData } = productApi.useGetRelatedProductsQuery(
    productData?.data?.id || '',
    {
      skip: !productData?.data?.id,
    }
  );

  const product = productData?.data;
  const relatedProducts = relatedProductsData?.data || [];

  useEffect(() => {
    if (error) {
      navigate('/404');
    }
  }, [error, navigate]);

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  // Handle image navigation
  const handlePrevImage = () => {
    if (!product?.images.length) return;
    setSelectedImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!product?.images.length) return;
    setSelectedImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  // Handle attribute selection with toggle functionality
  const handleAttributeChange = (name: string, value: string) => {
    setSelectedAttributes((prev) => {
      const newAttributes = { ...prev };

      // If clicking on the same value, unselect it
      if (newAttributes[name] === value) {
        delete newAttributes[name];
      } else {
        // Otherwise, select the new value
        newAttributes[name] = value;
      }

      return newAttributes;
    });

    // Reset quantity to 1 when changing attributes
    setQuantity(1);
  };

  // Add to cart
  const handleAddToCart = async () => {
    if (!product) return;

    // Check if all required attributes are selected
    if (product.attributes && product.attributes.length > 0) {
      const allSelected = areAllAttributesSelected(
        product.attributes,
        selectedAttributes
      );
      if (!allSelected) {
        const missingAttributes = product.attributes
          .filter((attr) => !selectedAttributes[attr.name])
          .map((attr) => attr.name);

        dispatch(
          addNotification({
            type: 'error',
            message: `Vui lòng chọn: ${missingAttributes.join(', ')}`,
          })
        );
        return;
      }
    }

    // Check stock availability
    const availableStock = getVariantStock(product, selectedAttributes);
    if (availableStock === 0) {
      dispatch(
        addNotification({
          type: 'error',
          message: 'Sản phẩm này đã hết hàng',
        })
      );
      return;
    }

    if (quantity > availableStock) {
      dispatch(
        addNotification({
          type: 'error',
          message: `Chỉ còn ${availableStock} sản phẩm trong kho`,
        })
      );
      return;
    }

    // Find variant ID based on selected attributes
    let variantId: string | undefined;
    if (hasVariants(product) && Object.keys(selectedAttributes).length > 0) {
      const selectedVariant = findVariantByAttributes(
        product.variants!,
        selectedAttributes
      );
      variantId = selectedVariant?.id;
    }

    console.log('🔐 isAuthenticated trong handleAddToCart:', isAuthenticated);

    if (isAuthenticated) {
      // Nếu đã đăng nhập, sử dụng API
      try {
        console.log('🚀 Đã đăng nhập, gọi API để thêm vào giỏ hàng:', {
          productId: product.id,
          variantId,
          quantity,
        });

        const serverCart = await addToCart({
          productId: product.id,
          variantId,
          quantity,
        }).unwrap();

        console.log('✅ API success, server cart:', serverCart);

        // Update Redux store with server response
        dispatch(setServerCart(serverCart));

        dispatch(
          addNotification({
            message: `${product.name} đã được thêm vào giỏ hàng`,
            type: 'success',
            duration: 3000,
          })
        );
      } catch (error: any) {
        console.error('❌ API thất bại:', error);

        // Fallback to localStorage if API fails
        const newItem = {
          id: uuidv4(),
          productId: product.id,
          name: product.name,
          price: getVariantPrice(product, selectedAttributes),
          quantity,
          image: product.thumbnail,
          variantId,
          attributes:
            Object.keys(selectedAttributes).length > 0
              ? selectedAttributes
              : undefined,
        };

        dispatch(addItem(newItem));

        dispatch(
          addNotification({
            message:
              error?.data?.message ||
              `${product.name} đã được thêm vào giỏ hàng (offline)`,
            type: error?.data?.message ? 'error' : 'success',
            duration: 3000,
          })
        );
      }
    } else {
      // Nếu chưa đăng nhập, KHÔNG gọi API, chỉ lưu vào localStorage
      console.log('🔐 Chưa đăng nhập, chỉ lưu vào localStorage');

      const newItem = {
        id: uuidv4(),
        productId: product.id,
        name: product.name,
        price: getVariantPrice(product, selectedAttributes),
        quantity,
        image: product.thumbnail,
        variantId,
        attributes:
          Object.keys(selectedAttributes).length > 0
            ? selectedAttributes
            : undefined,
      };

      // Chỉ thêm vào Redux store, cartSlice sẽ tự động cập nhật localStorage
      dispatch(addItem(newItem));

      // Debug: Check if localStorage was updated
      console.log(
        '🔍 localStorage after add:',
        localStorage.getItem('cartItems')
      );

      dispatch(
        addNotification({
          message: `${product.name} đã được thêm vào giỏ hàng`,
          type: 'success',
          duration: 3000,
        })
      );
    }
  };

  // Buy now
  const handleBuyNow = async () => {
    try {
      if (!product) return;

      // Tìm variant ID dựa trên thuộc tính đã chọn
      let variantId: string | undefined;
      if (product.variants && Object.keys(selectedAttributes).length > 0) {
        const selectedVariant = product.variants.find((variant) => {
          if (!variant.attributes) return false;
          return Object.entries(selectedAttributes).every(
            ([key, value]) => variant.attributes[key] === value
          );
        });
        variantId = selectedVariant?.id;
      }

      // Thêm sản phẩm vào giỏ hàng và đợi hoàn thành
      if (isAuthenticated) {
        // Nếu đã đăng nhập, sử dụng API
        await addToCart({
          productId: product.id,
          variantId: variantId,
          quantity,
        }).unwrap();
      } else {
        // Nếu chưa đăng nhập, thêm vào local cart
        dispatch(
          addItem({
            id: uuidv4(),
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.thumbnail,
            attributes:
              Object.keys(selectedAttributes).length > 0
                ? selectedAttributes
                : undefined,
          })
        );
      }

      // Thông báo thành công
      dispatch(
        addNotification({
          message: `${product.name} đã được thêm vào giỏ hàng`,
          type: 'success',
          duration: 3000,
        })
      );

      // Tạo một đối tượng chứa thông tin sản phẩm để mua ngay
      const buyNowItem = {
        id: uuidv4(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.thumbnail,
        attributes:
          Object.keys(selectedAttributes).length > 0
            ? selectedAttributes
            : undefined,
      };

      // Lưu thông tin sản phẩm vào sessionStorage
      sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
      sessionStorage.setItem('buyNowAction', 'true');

      // Đảm bảo localStorage được cập nhật ngay lập tức nếu không đăng nhập
      if (!isAuthenticated) {
        // Lưu giỏ hàng vào localStorage ngay lập tức
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        const existingItemIndex = cartItems.findIndex(
          (item: any) =>
            item.productId === product.id &&
            JSON.stringify(item.attributes || {}) ===
              JSON.stringify(selectedAttributes || {})
        );

        if (existingItemIndex >= 0) {
          // Nếu sản phẩm đã tồn tại, cập nhật số lượng
          cartItems[existingItemIndex].quantity += quantity;
        } else {
          // Nếu sản phẩm chưa tồn tại, thêm mới
          cartItems.push(buyNowItem);
        }

        // Lưu giỏ hàng vào localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      }

      // Chuyển hướng ngay lập tức, không cần setTimeout
      navigate('/checkout?buyNow=true');
    } catch (error: any) {
      console.error('Error buying now:', error);
      dispatch(
        addNotification({
          message:
            error?.data?.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
          Product Not Found
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <PremiumButton
          variant="primary"
          size="large"
          iconType="arrow-right"
          onClick={() => navigate('/shop')}
        >
          Continue Shopping
        </PremiumButton>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-8">
        <ol className="flex text-sm">
          <li className="flex items-center">
            <Link
              to="/"
              className="text-neutral-500 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400"
            >
              Home
            </Link>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mx-2 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </li>
          <li className="flex items-center">
            <Link
              to={`/categories/${product.categoryId}`}
              className="text-neutral-500 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400"
            >
              {product.categoryName}
            </Link>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mx-2 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </li>
          <li className="text-neutral-800 dark:text-neutral-200 truncate">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Product details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product images */}
        <div>
          <div className="relative mb-4">
            <div className="aspect-w-1 aspect-h-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden flex justify-center items-center">
              <img
                src={product.images[selectedImage] || product.thumbnail}
                alt={product.name}
                className="max-w-full max-h-[500px] object-contain"
              />
            </div>

            {/* Navigation buttons */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/80 rounded-full p-2 shadow-md transition-all"
                  aria-label="Previous image"
                >
                  <LeftOutlined className="text-lg text-neutral-700 dark:text-neutral-200" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/80 rounded-full p-2 shadow-md transition-all"
                  aria-label="Next image"
                >
                  <RightOutlined className="text-lg text-neutral-700 dark:text-neutral-200" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail gallery */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden border-2 ${
                    selectedImage === index
                      ? 'border-primary-500 dark:border-primary-400'
                      : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-full object-center object-contain max-h-[80px]"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center mb-4">
              {(() => {
                const currentPrice = getVariantPrice(
                  product,
                  selectedAttributes
                );
                const selectedVariant = hasVariants(product)
                  ? findVariantByAttributes(
                      product.variants!,
                      selectedAttributes
                    )
                  : null;

                return (
                  <>
                    <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                      {parseFloat(currentPrice.toString()).toLocaleString(
                        'vi-VN'
                      )}
                      đ
                    </span>

                    {product.compareAtPrice && (
                      <span className="ml-3 text-lg text-neutral-500 dark:text-neutral-400 line-through">
                        {parseFloat(
                          product.compareAtPrice.toString()
                        ).toLocaleString('vi-VN')}
                        đ
                      </span>
                    )}

                    {product.compareAtPrice && (
                      <Badge variant="secondary" className="ml-3">
                        {Math.round(
                          ((product.compareAtPrice - currentPrice) /
                            product.compareAtPrice) *
                            100
                        )}
                        % OFF
                      </Badge>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Ratings */}
            {product.ratings && (
              <div className="flex items-center mb-4">
                <Rating
                  value={product.ratings.average}
                  showCount={true}
                  count={product.ratings.count}
                />
                <Link
                  to="#reviews"
                  className="ml-2 text-sm text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Xem đánh giá
                </Link>
              </div>
            )}

            {/* Stock status */}
            <div className="mb-4">
              {(() => {
                const availableStock = getVariantStock(
                  product,
                  selectedAttributes
                );
                const stockText = formatStockText(availableStock);
                const stockColor = getStockStatusColor(availableStock);

                return (
                  <div className="flex items-center gap-2">
                    <Badge variant={availableStock > 0 ? 'success' : 'error'}>
                      {availableStock > 0 ? 'Còn hàng' : 'Hết hàng'}
                    </Badge>
                    <span className={`text-sm font-medium ${stockColor}`}>
                      {stockText}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Short description */}
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              {product.shortDescription ||
                product.description.substring(0, 150) + '...'}
            </p>
          </div>

          {/* Attributes */}
          {product.attributes && product.attributes.length > 0 && (
            <div className="mb-6 space-y-4">
              {product.attributes.map((attribute) => {
                const attributeValuesWithStock = getAttributeValuesWithStock(
                  product,
                  attribute.name,
                  selectedAttributes
                );

                return (
                  <div key={attribute.id}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {attribute.name}
                      </h3>
                      {selectedAttributes[attribute.name] && (
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          (Click lại để bỏ chọn)
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {attributeValuesWithStock.map(
                        ({ value, stock, available }) => (
                          <button
                            key={value}
                            disabled={!available}
                            className={`px-3 py-1 border rounded-md text-sm transition-all duration-200 ${
                              selectedAttributes[attribute.name] === value
                                ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-900/30 dark:text-primary-400'
                                : available
                                  ? 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-500'
                                  : 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-600'
                            }`}
                            onClick={() =>
                              handleAttributeChange(attribute.name, value)
                            }
                          >
                            <span className="flex items-center gap-1">
                              {value}
                              {hasVariants(product) && (
                                <span
                                  className={`text-xs ${getStockStatusColor(stock)}`}
                                >
                                  {stock > 0 ? `(${stock})` : '(0)'}
                                </span>
                              )}
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Số lượng
            </h3>
            {(() => {
              const maxStock = getVariantStock(product, selectedAttributes);

              return (
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-l-md border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={maxStock}
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value) || 1)
                    }
                    className="w-16 h-10 border-t border-b border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-center focus:outline-none focus:ring-0"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-r-md border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity >= maxStock}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              );
            })()}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <PremiumButton
              variant="primary"
              size="large"
              iconType="cart"
              isProcessing={isAddingToCart}
              processingText="Đang thêm..."
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full h-14"
            >
              {t('product.addToCart')}
            </PremiumButton>
            <PremiumButton
              variant="secondary"
              size="large"
              iconType="check"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="w-full h-14"
            >
              {t('product.buyNow')}
            </PremiumButton>
          </div>

          {/* Additional info */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 space-y-4">
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Secure payment
              </span>
            </div>
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Free shipping on orders over $50
              </span>
            </div>
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                30-day return policy
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product description */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">
          Product Description
        </h2>
        <div
          className="prose prose-neutral dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>

      {/* Reviews section */}
      <div id="reviews" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">
          Đánh giá từ khách hàng
        </h2>

        {/* Reviews section */}
        {product?.id && (
          <ProductReviews
            productId={product.id}
            averageRating={product.ratings?.average || 0}
            totalReviews={product.ratings?.count || 0}
          />
        )}
      </div>

      {/* Related products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">
            Sản phẩm liên quan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
