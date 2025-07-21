// Nhập các hàm React để tạo context và sử dụng context trong component
import React, { createContext, useContext } from 'react';

// Nhập hàm loadStripe để khởi tạo kết nối với Stripe và kiểu dữ liệu Stripe
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Elements là component bao quanh toàn bộ phần thanh toán để Stripe hoạt động
import { Elements } from '@stripe/react-stripe-js';

// Khởi tạo stripePromise chỉ một lần duy nhất từ public key
// Biến môi trường chứa khóa công khai của Stripe (từ Vite)
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

// Định nghĩa kiểu dữ liệu cho context stripe để kiểm soát dễ hơn với TypeScript
interface StripeContextType {
  stripe: Promise<Stripe | null>; // có thể là Stripe hoặc null nếu chưa load xong
}

// Tạo Context để chia sẻ stripePromise cho toàn bộ ứng dụng
const StripeContext = createContext<StripeContextType | undefined>(undefined);

// Hook tùy chỉnh để truy cập Stripe từ bất kỳ component nào trong app
export const useStripe = () => {
  const context = useContext(StripeContext);
  if (context === undefined) {
    // Nếu hook được gọi bên ngoài StripeProvider thì thông báo lỗi
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context; // Trả về stripe context đã được cung cấp
};

// Kiểu dữ liệu cho các component con nằm trong StripeProvider
interface StripeProviderProps {
  children: React.ReactNode; // Cho phép truyền các component con như CheckoutForm, App,...
}

// Component StripeProvider giúp cung cấp stripe context và bọc <Elements>
export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const value = {
    stripe: stripePromise, // Gán promise stripe vào context
  };

  return (
    // Cung cấp giá trị stripe cho các component con thông qua context
    <StripeContext.Provider value={value}>
      {/* Bọc tất cả các form thanh toán bên trong <Elements> để Stripe hoạt động */}
      <Elements stripe={stripePromise}>
        {children} {/* Hiển thị các component con */}
      </Elements>
    </StripeContext.Provider>
  );
};

// Cho phép các file khác import StripeProvider mặc định
export default StripeProvider;



// import React, { createContext, useContext } from 'react';
// import { loadStripe, Stripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';

// const stripePromise = loadStripe(
//   import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
// );

// interface StripeContextType {
//   stripe: Promise<Stripe | null>;
// }

// const StripeContext = createContext<StripeContextType | undefined>(undefined);

// export const useStripe = () => {
//   const context = useContext(StripeContext);
//   if (context === undefined) {
//     throw new Error('useStripe must be used within a StripeProvider');
//   }
//   return context;
// };

// interface StripeProviderProps {
//   children: React.ReactNode;
// }

// export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
//   const value = {
//     stripe: stripePromise,
//   };

//   return (
//     <StripeContext.Provider value={value}>
//       <Elements stripe={stripePromise}>{children}</Elements>
//     </StripeContext.Provider>
//   );
// };

// export default StripeProvider;
