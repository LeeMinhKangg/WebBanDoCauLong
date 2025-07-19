const {
  Product,
  Category,
  ProductAttribute,
  ProductVariant,
  OrderItem,
  CartItem,
  sequelize,
} = require('../src/models');
const { v4: uuidv4 } = require('uuid');

const sampleProducts = [
  // === QUẦN ÁO ===
  {
    name: 'Áo Sơ Mi Nữ Oversize',
    shortDescription:
      'Áo sơ mi nữ phong cách oversize, chất liệu cotton mềm mại',
    description:
      'Áo sơ mi nữ thiết kế oversize thời trang, chất liệu cotton 100% cao cấp, thoáng mát và dễ chăm sóc. Phù hợp cho mọi dịp từ công sở đến dạo phố.',
    price: 350000,
    compareAtPrice: 450000,
    thumbnail:
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1594633313593-bab3ac28187d?w=800&h=800&fit=crop',
    ],
    category: 'Thời trang nữ',
    tags: ['áo sơ mi', 'oversize', 'cotton', 'thời trang'],
    status: 'active',
    featured: true,
    attributes: [
      { name: 'Kích thước', values: ['S', 'M', 'L', 'XL'] },
      { name: 'Màu sắc', values: ['Trắng', 'Đen', 'Xanh Navy'] },
    ],
    variants: [
      {
        name: 'Size S - Trắng',
        attributes: { 'Kích thước': 'S', 'Màu sắc': 'Trắng' },
        price: 350000,
        stock: 10,
      },
      {
        name: 'Size M - Trắng',
        attributes: { 'Kích thước': 'M', 'Màu sắc': 'Trắng' },
        price: 350000,
        stock: 15,
      },
      {
        name: 'Size L - Trắng',
        attributes: { 'Kích thước': 'L', 'Màu sắc': 'Trắng' },
        price: 350000,
        stock: 20,
      },
      {
        name: 'Size XL - Trắng',
        attributes: { 'Kích thước': 'XL', 'Màu sắc': 'Trắng' },
        price: 350000,
        stock: 8,
      },
      {
        name: 'Size S - Đen',
        attributes: { 'Kích thước': 'S', 'Màu sắc': 'Đen' },
        price: 350000,
        stock: 12,
      },
      {
        name: 'Size M - Đen',
        attributes: { 'Kích thước': 'M', 'Màu sắc': 'Đen' },
        price: 350000,
        stock: 18,
      },
      {
        name: 'Size L - Đen',
        attributes: { 'Kích thước': 'L', 'Màu sắc': 'Đen' },
        price: 350000,
        stock: 25,
      },
      {
        name: 'Size XL - Đen',
        attributes: { 'Kích thước': 'XL', 'Màu sắc': 'Đen' },
        price: 350000,
        stock: 5,
      },
      {
        name: 'Size M - Xanh Navy',
        attributes: { 'Kích thước': 'M', 'Màu sắc': 'Xanh Navy' },
        price: 370000,
        stock: 10,
      },
      {
        name: 'Size L - Xanh Navy',
        attributes: { 'Kích thước': 'L', 'Màu sắc': 'Xanh Navy' },
        price: 370000,
        stock: 15,
      },
    ],
  },

  {
    name: 'Quần Jeans Slim Fit Nam',
    shortDescription: 'Quần jeans nam form slim fit, chất liệu denim cao cấp',
    description:
      'Quần jeans nam thiết kế slim fit ôm dáng, chất liệu denim cotton co giãn, bền đẹp theo thời gian. Phù hợp cho mọi phong cách từ casual đến smart casual.',
    price: 420000,
    compareAtPrice: 550000,
    thumbnail:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=800&fit=crop',
    ],
    category: 'Thời trang nam',
    tags: ['quần jeans', 'slim fit', 'denim', 'thời trang nam'],
    status: 'active',
    featured: true,
    attributes: [
      { name: 'Kích thước', values: ['29', '30', '31', '32', '33', '34'] },
      { name: 'Màu sắc', values: ['Xanh Đậm', 'Xanh Nhạt', 'Đen'] },
    ],
    variants: [
      {
        name: 'Size 30 - Xanh Đậm',
        attributes: { 'Kích thước': '30', 'Màu sắc': 'Xanh Đậm' },
        price: 420000,
        stock: 8,
      },
      {
        name: 'Size 31 - Xanh Đậm',
        attributes: { 'Kích thước': '31', 'Màu sắc': 'Xanh Đậm' },
        price: 420000,
        stock: 12,
      },
      {
        name: 'Size 32 - Xanh Đậm',
        attributes: { 'Kích thước': '32', 'Màu sắc': 'Xanh Đậm' },
        price: 420000,
        stock: 15,
      },
      {
        name: 'Size 33 - Xanh Đậm',
        attributes: { 'Kích thước': '33', 'Màu sắc': 'Xanh Đậm' },
        price: 420000,
        stock: 10,
      },
      {
        name: 'Size 31 - Đen',
        attributes: { 'Kích thước': '31', 'Màu sắc': 'Đen' },
        price: 450000,
        stock: 6,
      },
      {
        name: 'Size 32 - Đen',
        attributes: { 'Kích thước': '32', 'Màu sắc': 'Đen' },
        price: 450000,
        stock: 8,
      },
    ],
  },

  // === LAPTOP ===
  {
    name: 'MacBook Pro 14-inch M3',
    shortDescription:
      'MacBook Pro 14-inch với chip M3 mạnh mẽ, hiệu năng vượt trội',
    description:
      'MacBook Pro 14-inch với chip M3 thế hệ mới, màn hình Liquid Retina XDR 14.2 inch, pin 18 giờ, phù hợp cho work từ nhà, thiết kế đồ họa và phát triển phần mềm.',
    price: 52990000,
    compareAtPrice: 59990000,
    thumbnail:
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',
    ],
    category: 'Laptop',
    tags: ['macbook', 'laptop', 'apple', 'M3', 'pro'],
    status: 'active',
    featured: true,
    attributes: [
      { name: 'RAM', values: ['8GB', '16GB', '32GB'] },
      { name: 'Dung lượng', values: ['256GB', '512GB', '1TB'] },
      { name: 'Màu sắc', values: ['Space Gray', 'Silver'] },
    ],
    variants: [
      {
        name: '8GB - 256GB - Space Gray',
        attributes: {
          RAM: '8GB',
          'Dung lượng': '256GB',
          'Màu sắc': 'Space Gray',
        },
        price: 52990000,
        stock: 5,
      },
      {
        name: '8GB - 512GB - Space Gray',
        attributes: {
          RAM: '8GB',
          'Dung lượng': '512GB',
          'Màu sắc': 'Space Gray',
        },
        price: 59990000,
        stock: 3,
      },
      {
        name: '16GB - 512GB - Space Gray',
        attributes: {
          RAM: '16GB',
          'Dung lượng': '512GB',
          'Màu sắc': 'Space Gray',
        },
        price: 69990000,
        stock: 2,
      },
      {
        name: '16GB - 1TB - Space Gray',
        attributes: {
          RAM: '16GB',
          'Dung lượng': '1TB',
          'Màu sắc': 'Space Gray',
        },
        price: 79990000,
        stock: 1,
      },
      {
        name: '8GB - 256GB - Silver',
        attributes: { RAM: '8GB', 'Dung lượng': '256GB', 'Màu sắc': 'Silver' },
        price: 52990000,
        stock: 4,
      },
      {
        name: '16GB - 512GB - Silver',
        attributes: { RAM: '16GB', 'Dung lượng': '512GB', 'Màu sắc': 'Silver' },
        price: 69990000,
        stock: 2,
      },
    ],
  },

  {
    name: 'Dell XPS 13 Plus',
    shortDescription:
      'Dell XPS 13 Plus với thiết kế premium, hiệu năng mạnh mẽ',
    description:
      'Dell XPS 13 Plus với bộ vi xử lý Intel Core i7 thế hệ 12, màn hình 13.4 inch 4K+, thiết kế không viền, trọng lượng chỉ 1.23kg. Hoàn hảo cho doanh nhân và sinh viên.',
    price: 35990000,
    compareAtPrice: 42990000,
    thumbnail:
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop',
    ],
    category: 'Laptop',
    tags: ['dell', 'laptop', 'xps', 'intel', 'business'],
    status: 'active',
    featured: false,
    attributes: [
      { name: 'RAM', values: ['16GB', '32GB'] },
      { name: 'Dung lượng', values: ['512GB', '1TB'] },
      { name: 'Màu sắc', values: ['Platinum Silver', 'Graphite'] },
    ],
    variants: [
      {
        name: '16GB - 512GB - Platinum Silver',
        attributes: {
          RAM: '16GB',
          'Dung lượng': '512GB',
          'Màu sắc': 'Platinum Silver',
        },
        price: 35990000,
        stock: 6,
      },
      {
        name: '16GB - 1TB - Platinum Silver',
        attributes: {
          RAM: '16GB',
          'Dung lượng': '1TB',
          'Màu sắc': 'Platinum Silver',
        },
        price: 42990000,
        stock: 4,
      },
      {
        name: '32GB - 1TB - Graphite',
        attributes: { RAM: '32GB', 'Dung lượng': '1TB', 'Màu sắc': 'Graphite' },
        price: 52990000,
        stock: 2,
      },
    ],
  },

  // === Ô TÔ ===
  {
    name: 'Honda Civic 2024',
    shortDescription: 'Honda Civic 2024 - Sedan hạng C với thiết kế thể thao',
    description:
      'Honda Civic 2024 với thiết kế hoàn toàn mới, động cơ 1.5L VTEC Turbo, hộp số CVT, hệ thống an toàn Honda SENSING. Phù hợp cho gia đình trẻ và doanh nhân.',
    price: 75000000,
    compareAtPrice: 85000000,
    thumbnail:
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=800&fit=crop',
    ],
    category: 'Ô tô',
    tags: ['honda', 'civic', 'sedan', 'ô tô', '2024'],
    status: 'active',
    featured: true,
    attributes: [
      { name: 'Phiên bản', values: ['G', 'L', 'RS'] },
      {
        name: 'Màu sắc',
        values: ['Trắng Ngọc Trai', 'Đen Ánh Kim', 'Xanh Dương', 'Đỏ Cherry'],
      },
    ],
    variants: [
      {
        name: 'G - Trắng Ngọc Trai',
        attributes: { 'Phiên bản': 'G', 'Màu sắc': 'Trắng Ngọc Trai' },
        price: 75000000,
        stock: 2,
      },
      {
        name: 'L - Trắng Ngọc Trai',
        attributes: { 'Phiên bản': 'L', 'Màu sắc': 'Trắng Ngọc Trai' },
        price: 82000000,
        stock: 1,
      },
      {
        name: 'RS - Đen Ánh Kim',
        attributes: { 'Phiên bản': 'RS', 'Màu sắc': 'Đen Ánh Kim' },
        price: 92000000,
        stock: 1,
      },
      {
        name: 'G - Đỏ Cherry',
        attributes: { 'Phiên bản': 'G', 'Màu sắc': 'Đỏ Cherry' },
        price: 75000000,
        stock: 1,
      },
      {
        name: 'L - Xanh Dương',
        attributes: { 'Phiên bản': 'L', 'Màu sắc': 'Xanh Dương' },
        price: 82000000,
        stock: 1,
      },
    ],
  },

  {
    name: 'Toyota Vios 2024',
    shortDescription: 'Toyota Vios 2024 - Sedan phổ thông tin cậy',
    description:
      'Toyota Vios 2024 với động cơ 1.5L VVT-i, hộp số CVT, thiết kế trẻ trung và tiết kiệm nhiên liệu. Lựa chọn lý tưởng cho gia đình Việt.',
    price: 45800000,
    compareAtPrice: 52000000,
    thumbnail:
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop',
    ],
    category: 'Ô tô',
    tags: ['toyota', 'vios', 'sedan', 'ô tô', 'tiết kiệm'],
    status: 'active',
    featured: false,
    attributes: [
      { name: 'Phiên bản', values: ['E', 'G'] },
      { name: 'Màu sắc', values: ['Trắng', 'Bạc', 'Đen', 'Đỏ'] },
    ],
    variants: [
      {
        name: 'E - Trắng',
        attributes: { 'Phiên bản': 'E', 'Màu sắc': 'Trắng' },
        price: 45800000,
        stock: 3,
      },
      {
        name: 'G - Trắng',
        attributes: { 'Phiên bản': 'G', 'Màu sắc': 'Trắng' },
        price: 52000000,
        stock: 2,
      },
      {
        name: 'G - Bạc',
        attributes: { 'Phiên bản': 'G', 'Màu sắc': 'Bạc' },
        price: 52000000,
        stock: 1,
      },
      {
        name: 'G - Đen',
        attributes: { 'Phiên bản': 'G', 'Màu sắc': 'Đen' },
        price: 52000000,
        stock: 1,
      },
    ],
  },

  // === ĐIỆN THOẠI ===
  {
    name: 'iPhone 15 Pro',
    shortDescription: 'iPhone 15 Pro với chip A17 Pro, camera pro 48MP',
    description:
      'iPhone 15 Pro với chip A17 Pro 3nm, camera chính 48MP, zoom quang học 3x, khung titanium cao cấp, cổng USB-C. Đỉnh cao của công nghệ smartphone.',
    price: 28990000,
    compareAtPrice: 34990000,
    thumbnail:
      'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&h=800&fit=crop',
    ],
    category: 'Điện thoại',
    tags: ['iphone', 'apple', 'smartphone', 'pro', 'titanium'],
    status: 'active',
    featured: true,
    attributes: [
      { name: 'Dung lượng', values: ['128GB', '256GB', '512GB', '1TB'] },
      {
        name: 'Màu sắc',
        values: ['Titan Tự Nhiên', 'Titan Xanh', 'Titan Trắng', 'Titan Đen'],
      },
    ],
    variants: [
      {
        name: '128GB - Titan Tự Nhiên',
        attributes: { 'Dung lượng': '128GB', 'Màu sắc': 'Titan Tự Nhiên' },
        price: 28990000,
        stock: 8,
      },
      {
        name: '256GB - Titan Tự Nhiên',
        attributes: { 'Dung lượng': '256GB', 'Màu sắc': 'Titan Tự Nhiên' },
        price: 32990000,
        stock: 6,
      },
      {
        name: '256GB - Titan Xanh',
        attributes: { 'Dung lượng': '256GB', 'Màu sắc': 'Titan Xanh' },
        price: 32990000,
        stock: 4,
      },
      {
        name: '512GB - Titan Trắng',
        attributes: { 'Dung lượng': '512GB', 'Màu sắc': 'Titan Trắng' },
        price: 38990000,
        stock: 2,
      },
      {
        name: '1TB - Titan Đen',
        attributes: { 'Dung lượng': '1TB', 'Màu sắc': 'Titan Đen' },
        price: 44990000,
        stock: 1,
      },
    ],
  },

  // === GIÀY ===
  {
    name: 'Nike Air Max 270',
    shortDescription: 'Nike Air Max 270 - Giày thể thao với đệm khí lớn nhất',
    description:
      'Nike Air Max 270 với đệm khí Air Max lớn nhất từ trước đến nay, thiết kế hiện đại, phù hợp cho việc tập luyện và đi bộ hàng ngày.',
    price: 3200000,
    compareAtPrice: 4200000,
    thumbnail:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop',
    ],
    category: 'Giày dép',
    tags: ['nike', 'air max', 'giày thể thao', 'running'],
    status: 'active',
    featured: true,
    attributes: [
      { name: 'Kích thước', values: ['39', '40', '41', '42', '43', '44'] },
      { name: 'Màu sắc', values: ['Trắng-Đen', 'Xanh-Trắng', 'Đen-Đỏ'] },
    ],
    variants: [
      {
        name: 'Size 40 - Trắng-Đen',
        attributes: { 'Kích thước': '40', 'Màu sắc': 'Trắng-Đen' },
        price: 3200000,
        stock: 12,
      },
      {
        name: 'Size 41 - Trắng-Đen',
        attributes: { 'Kích thước': '41', 'Màu sắc': 'Trắng-Đen' },
        price: 3200000,
        stock: 15,
      },
      {
        name: 'Size 42 - Trắng-Đen',
        attributes: { 'Kích thước': '42', 'Màu sắc': 'Trắng-Đen' },
        price: 3200000,
        stock: 18,
      },
      {
        name: 'Size 43 - Trắng-Đen',
        attributes: { 'Kích thước': '43', 'Màu sắc': 'Trắng-Đen' },
        price: 3200000,
        stock: 10,
      },
      {
        name: 'Size 41 - Xanh-Trắng',
        attributes: { 'Kích thước': '41', 'Màu sắc': 'Xanh-Trắng' },
        price: 3200000,
        stock: 8,
      },
      {
        name: 'Size 42 - Xanh-Trắng',
        attributes: { 'Kích thước': '42', 'Màu sắc': 'Xanh-Trắng' },
        price: 3200000,
        stock: 6,
      },
      {
        name: 'Size 42 - Đen-Đỏ',
        attributes: { 'Kích thước': '42', 'Màu sắc': 'Đen-Đỏ' },
        price: 3400000,
        stock: 4,
      },
    ],
  },

  // === ĐIỆN TỬ ===
  {
    name: 'Samsung Galaxy Watch 6',
    shortDescription: 'Samsung Galaxy Watch 6 - Đồng hồ thông minh cao cấp',
    description:
      'Samsung Galaxy Watch 6 với màn hình Super AMOLED 1.5 inch, theo dõi sức khỏe toàn diện, pin 2 ngày, kháng nước 5ATM. Phù hợp cho lifestyle hiện đại.',
    price: 7990000,
    compareAtPrice: 9990000,
    thumbnail:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop',
    ],
    category: 'Điện tử',
    tags: ['samsung', 'galaxy watch', 'smartwatch', 'wearable'],
    status: 'active',
    featured: false,
    attributes: [
      { name: 'Kích thước', values: ['40mm', '44mm'] },
      { name: 'Màu sắc', values: ['Bạc', 'Đen', 'Vàng'] },
      { name: 'Dây đeo', values: ['Thể thao', 'Da', 'Thép'] },
    ],
    variants: [
      {
        name: '40mm - Bạc - Thể thao',
        attributes: {
          'Kích thước': '40mm',
          'Màu sắc': 'Bạc',
          'Dây đeo': 'Thể thao',
        },
        price: 7990000,
        stock: 5,
      },
      {
        name: '44mm - Bạc - Thể thao',
        attributes: {
          'Kích thước': '44mm',
          'Màu sắc': 'Bạc',
          'Dây đeo': 'Thể thao',
        },
        price: 8990000,
        stock: 3,
      },
      {
        name: '44mm - Đen - Da',
        attributes: { 'Kích thước': '44mm', 'Màu sắc': 'Đen', 'Dây đeo': 'Da' },
        price: 9490000,
        stock: 2,
      },
      {
        name: '44mm - Vàng - Thép',
        attributes: {
          'Kích thước': '44mm',
          'Màu sắc': 'Vàng',
          'Dây đeo': 'Thép',
        },
        price: 11990000,
        stock: 1,
      },
    ],
  },
];

async function importProducts() {
  try {
    console.log('🚀 Bắt đầu import sản phẩm...');

    // Xóa dữ liệu cũ theo thứ tự để tránh foreign key constraint
    await OrderItem.destroy({ where: {} });
    await CartItem.destroy({ where: {} });
    await ProductVariant.destroy({ where: {} });
    await ProductAttribute.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });

    console.log('🗑️ Đã xóa dữ liệu cũ');

    // Tạo categories
    const categories = [
      {
        name: 'Thời trang nữ',
        slug: 'thoi-trang-nu',
        description: 'Thời trang dành cho phụ nữ',
      },
      {
        name: 'Thời trang nam',
        slug: 'thoi-trang-nam',
        description: 'Thời trang dành cho nam giới',
      },
      { name: 'Laptop', slug: 'laptop', description: 'Máy tính xách tay' },
      { name: 'Ô tô', slug: 'o-to', description: 'Xe hơi các loại' },
      {
        name: 'Điện thoại',
        slug: 'dien-thoai',
        description: 'Điện thoại thông minh',
      },
      {
        name: 'Giày dép',
        slug: 'giay-dep',
        description: 'Giày dép thời trang',
      },
      { name: 'Điện tử', slug: 'dien-tu', description: 'Thiết bị điện tử' },
    ];

    const createdCategories = await Category.bulkCreate(categories);
    console.log(`📁 Đã tạo ${createdCategories.length} danh mục`);

    // Tạo products với attributes và variants
    for (const productData of sampleProducts) {
      // Tìm category
      const category = createdCategories.find(
        (cat) => cat.name === productData.category
      );

      // Tạo product
      const product = await Product.create({
        name: productData.name,
        description: productData.description,
        shortDescription: productData.shortDescription,
        price: productData.price,
        compareAtPrice: productData.compareAtPrice,
        images: productData.images,
        thumbnail: productData.thumbnail,
        inStock: true,
        stockQuantity: 0, // Sẽ được tính từ variants
        sku: `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: productData.status,
        featured: productData.featured,
        searchKeywords: productData.tags,
        seoTitle: productData.name,
        seoDescription: productData.shortDescription,
        seoKeywords: productData.tags,
      });

      // Gán category
      if (category) {
        await product.setCategories([category.id]);
      }

      // Tạo attributes
      const createdAttributes = [];
      for (const attr of productData.attributes) {
        const attribute = await ProductAttribute.create({
          productId: product.id,
          name: attr.name,
          values: attr.values,
        });
        createdAttributes.push(attribute);
      }

      // Tạo variants
      const createdVariants = [];
      for (const variant of productData.variants) {
        const variantSku = `${product.sku}-${Object.values(variant.attributes).join('-').toUpperCase().replace(/\s+/g, '')}`;

        const productVariant = await ProductVariant.create({
          productId: product.id,
          name: variant.name,
          sku: variantSku,
          attributes: variant.attributes,
          price: variant.price,
          stockQuantity: variant.stock,
          images: [],
        });
        createdVariants.push(productVariant);
      }

      // Cập nhật tổng stock cho product
      const totalStock = createdVariants.reduce(
        (sum, variant) => sum + variant.stockQuantity,
        0
      );
      await product.update({
        stockQuantity: totalStock,
        inStock: totalStock > 0,
      });

      console.log(
        `✅ Đã tạo sản phẩm: ${product.name} (${createdAttributes.length} attributes, ${createdVariants.length} variants, ${totalStock} stock)`
      );
    }

    console.log('🎉 Import thành công!');
    console.log(`📊 Tổng kết:`);
    console.log(`   - ${sampleProducts.length} sản phẩm`);
    console.log(`   - ${createdCategories.length} danh mục`);
    console.log(
      `   - Tổng variants: ${sampleProducts.reduce((sum, p) => sum + p.variants.length, 0)}`
    );
  } catch (error) {
    console.error('❌ Lỗi import:', error);
  }
}

// Chạy import
importProducts().then(() => {
  console.log('🏁 Hoàn tất import');
  process.exit(0);
});
