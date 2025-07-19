# 🤖 AI Chatbot Integration Guide - Hướng dẫn tích hợp ChatBot AI

## 📋 Tổng quan

Website bán hàng mini đã tích hợp **Gemini AI Chatbot** - một trợ lý thông minh có khả năng hiểu ngôn ngữ tự nhiên, tư vấn sản phẩm, và hỗ trợ khách hàng 24/7. Chatbot sử dụng **Google Gemini 2.0 Flash** model để cung cấp trải nghiệm tương tác thông minh và tự nhiên.

## 🏗️ Kiến trúc hệ thống

### Frontend (React + TypeScript)

- **Chat Widget**: Giao diện người dùng hiện đại với drag & resize
- **AI Status Indicator**: Hiển thị trạng thái AI (Active/Demo Mode)
- **Real-time Communication**: Giao tiếp với backend qua REST API
- **State Management**: Zustand store cho chat state

### Backend (Node.js + Express)

- **Gemini AI Service**: Xử lý tương tác với Google Gemini API
- **Product Intelligence**: Tích hợp database sản phẩm cho gợi ý thông minh
- **Context Management**: Quản lý ngữ cảnh cuộc trò chuyện
- **Analytics Tracking**: Theo dõi hiệu suất chatbot

## 🚀 Cài đặt và Cấu hình

### 1. Cài đặt dependencies

```bash
# Backend dependencies
npm install @google/generative-ai

# Frontend dependencies đã có sẵn trong dự án
```

### 2. Cấu hình API Key

#### Backend (.env)

```env
# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

#### Lấy Gemini API Key:

1. Truy cập [Google AI Studio](https://makersuite.google.com/)
2. Đăng nhập bằng Google Account
3. Tạo API Key mới
4. Sao chép và dán vào file `.env`

### 3. Khởi tạo dịch vụ

#### Backend Service Initialization

```javascript
// backend/src/services/geminiChatbot.service.js
class GeminiChatbotService {
  constructor() {
    this.initializeGemini();
  }

  initializeGemini() {
    if (
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== 'demo-key'
    ) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
      });
      console.info('✅ Gemini AI initialized successfully');
    } else {
      console.warn('⚠️  Gemini API key not found, using fallback responses');
    }
  }
}
```

## 🎯 Tích hợp Frontend

### 1. Import Chat Widget

```tsx
// App.tsx hoặc component chính
import ChatWidget from '@/features/ai/components/ChatWidget';

function App() {
  return (
    <div>
      {/* Your app content */}
      <ChatWidget />
    </div>
  );
}
```

### 2. Sử dụng Chat Hook

```tsx
// Component tùy chỉnh
import { useChat } from '@/features/ai/hooks/useChat';

function MyComponent() {
  const { messages, sendMessage, isLoading, clearMessages } = useChat();

  const handleSend = async (message: string) => {
    await sendMessage(message);
  };

  return <div>{/* Custom chat UI */}</div>;
}
```

### 3. API Integration

```tsx
// services/chatbotApi.ts
import { api } from '@/services/api';

export const chatbotApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendChatbotMessage: builder.mutation({
      query: (message) => ({
        url: '/chatbot/message',
        method: 'POST',
        body: message,
      }),
    }),

    aiProductSearch: builder.mutation({
      query: (searchRequest) => ({
        url: '/chatbot/products/search',
        method: 'POST',
        body: searchRequest,
      }),
    }),
  }),
});
```

## 🎨 Customization

### 1. Tùy chỉnh giao diện

```tsx
// constants/chatWidget.ts
export const CHAT_WIDGET_CONFIG = {
  defaultSize: { width: 400, height: 600 },
  minSize: { width: 320, height: 400 },
  maxSize: { width: 800, height: 800 },
  position: { bottom: 24, right: 24 },

  // Theme customization
  theme: {
    primary: '#3B82F6',
    secondary: '#10B981',
    background: '#FFFFFF',
    text: '#1F2937',
  },
};
```

### 2. Tùy chỉnh AI Status

```tsx
// components/AIStatusIndicator.tsx
interface AIStatusProps {
  isAIActive: boolean;
  className?: string;
}

export function AIStatusIndicator({ isAIActive, className }: AIStatusProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`w-2 h-2 rounded-full ${
          isAIActive ? 'bg-green-500' : 'bg-yellow-500'
        }`}
      />
      <span className="text-xs">
        {isAIActive ? 'Gemini AI Active' : 'Demo Mode'}
      </span>
    </div>
  );
}
```

## 📝 Prompt Engineering

### 1. System Prompt chính

```javascript
// backend/src/services/geminiChatbot.service.js
createPrompt(userMessage, products, context) {
  return `
Bạn là một trợ lý AI thông minh cho cửa hàng thời trang Shopmini.

KHẢ NĂNG CỦA BẠN:
1. Tìm kiếm và gợi ý sản phẩm
2. Trả lời câu hỏi về chính sách, dịch vụ
3. Hỗ trợ khách hàng với mọi thắc mắc
4. Tư vấn thời trang và phong cách
5. Xử lý khiếu nại và phản hồi
6. Trò chuyện thân thiện, tự nhiên
7. Trả lời câu hỏi kiến thức chung một cách thông minh

DANH SÁCH SẢN PHẨM:
${productList}

THÔNG TIN CỬA HÀNG:
- Tên: Shopmini - Cửa hàng thời trang trực tuyến
- Chuyên: Áo thun, giày thể thao, balo, túi xách
- Chính sách: Đổi trả trong 7 ngày, miễn phí vận chuyển >500k
- Thanh toán: COD, chuyển khoản, thẻ tín dụng
- Giao hàng: 1-3 ngày nội thành, 3-7 ngày ngoại thành

TIN NHẮN: "${userMessage}"
CONTEXT: ${JSON.stringify(context)}

HƯỚNG DẪN TRẢ LỜI:
- Sản phẩm: Tìm và gợi ý phù hợp
- Giá cả: So sánh và tư vấn
- Chính sách: Giải thích rõ ràng
- Khiếu nại: Thể hiện quan tâm
- Câu hỏi chung: Trả lời thông minh, hướng về sản phẩm

Response format JSON:
{
  "response": "Câu trả lời thân thiện",
  "matchedProducts": ["sản phẩm 1", "sản phẩm 2"],
  "suggestions": ["gợi ý 1", "gợi ý 2"],
  "intent": "product_search|pricing|policy|support"
}
`;
}
```

### 2. Prompt Templates

```typescript
// frontend/src/features/ai/services/promptTemplates.ts

export const getProductSuggestionPrompt = (query: string) => {
  return `Bạn là trợ lý mua sắm cho cửa hàng thời trang.
  Khách hàng tìm kiếm: "${query}".
  Hãy gợi ý sản phẩm phù hợp và đặt câu hỏi làm rõ.
  Trả lời thân thiện và tự nhiên.`;
};

export const getGeneralHelpPrompt = (
  query: string,
  type: 'order' | 'return' | 'general' = 'general'
) => {
  let basePrompt = `Bạn là trợ lý cửa hàng thời trang.
  Khách hàng hỏi: "${query}".`;

  switch (type) {
    case 'order':
      basePrompt += `
      Cung cấp thông tin về quy trình đặt hàng, 
      thanh toán, vận chuyển, theo dõi đơn hàng.`;
      break;
    case 'return':
      basePrompt += `
      Giải thích chính sách đổi trả, hoàn tiền, 
      liên hệ chăm sóc khách hàng.`;
      break;
    default:
      basePrompt += `
      Cung cấp thông tin hữu ích về cửa hàng, 
      sản phẩm, chính sách. Giữ câu trả lời ngắn gọn.`;
  }

  return basePrompt;
};
```

## 🔧 Backend Integration

### 1. API Endpoints

```javascript
// backend/src/routes/chatbot.routes.js

// Send message to chatbot
router.post('/message', chatbotController.handleMessage);

// AI product search
router.post('/products/search', chatbotController.aiProductSearch);

// Get recommendations
router.get('/recommendations', chatbotController.getRecommendations);

// Track analytics
router.post('/analytics', chatbotController.trackAnalytics);

// Add to cart via chatbot
router.post('/cart/add', authenticate, chatbotController.addToCart);
```

### 2. Controller Logic

```javascript
// backend/src/controllers/chatbot.controller.js
class ChatbotController {
  async handleMessage(req, res) {
    try {
      const { message, userId, sessionId, context } = req.body;

      // Use Gemini AI service
      const response = await geminiChatbotService.handleMessage(message, {
        userId,
        sessionId,
        context,
      });

      res.json({
        status: 'success',
        data: response,
      });
    } catch (error) {
      console.error('Chatbot error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }

  async aiProductSearch(req, res) {
    try {
      const { query, userId, limit = 10 } = req.body;

      // Enhanced product search with AI
      const products = await this.searchProductsWithAI(query, userId, limit);

      res.json({
        status: 'success',
        data: { products },
      });
    } catch (error) {
      console.error('AI product search error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Search failed',
      });
    }
  }
}
```

### 3. Service Layer

```javascript
// backend/src/services/geminiChatbot.service.js
class GeminiChatbotService {
  async handleMessage(message, context = {}) {
    try {
      // Get products from database
      const allProducts = await this.getAllProducts();

      // Generate AI response
      const aiResponse = await this.getAIResponse(
        message,
        allProducts,
        context
      );

      return aiResponse;
    } catch (error) {
      console.error('Gemini chatbot error:', error);
      return this.getFallbackResponse(message);
    }
  }

  async getAIResponse(userMessage, products, context) {
    if (!this.model) {
      return this.getFallbackResponse(userMessage);
    }

    try {
      const prompt = this.createPrompt(userMessage, products, context);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const aiText = response.text();

      return this.parseAIResponse(aiText, products);
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }
}
```

## 📊 Analytics & Tracking

### 1. Event Tracking

```javascript
// Track user interactions
await chatbotService.trackAnalytics({
  event: 'message_sent',
  userId: user.id,
  sessionId: session.id,
  metadata: {
    message_length: message.length,
    intent: response.intent,
    products_shown: response.products.length,
  },
});
```

### 2. Performance Monitoring

```javascript
// Monitor AI response time
const startTime = Date.now();
const aiResponse = await geminiChatbotService.handleMessage(message);
const responseTime = Date.now() - startTime;

console.log(`AI Response Time: ${responseTime}ms`);
```

## 🚀 Advanced Features

### 1. Context Management

```javascript
// Maintain conversation context
const conversationContext = {
  userId: user.id,
  sessionId: generateSessionId(),
  previousMessages: chatHistory.slice(-5),
  currentPage: req.headers.referer,
  cartItems: await getCartItems(user.id),
  userPreferences: await getUserPreferences(user.id),
};
```

### 2. Product Intelligence

```javascript
// Smart product matching
async simpleKeywordMatch(userMessage, products) {
  const searchTerms = userMessage.toLowerCase().split(' ');
  const keywordMapping = {
    balo: ['balo', 'backpack', 'bag'],
    giày: ['giày', 'shoes', 'sneaker'],
    áo: ['áo', 'shirt', 'tshirt'],
  };

  // Expand search terms
  const expandedTerms = [...searchTerms];
  Object.keys(keywordMapping).forEach((viTerm) => {
    if (userMessage.includes(viTerm)) {
      expandedTerms.push(...keywordMapping[viTerm]);
    }
  });

  // Score and rank products
  const scoredProducts = products.map(product => ({
    ...product,
    score: this.calculateRelevanceScore(product, expandedTerms)
  })).filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score);

  return scoredProducts.slice(0, 5);
}
```

### 3. Multi-intent Handling

```javascript
// Handle multiple intents in one message
parseUserIntent(message) {
  const intents = [];

  if (message.includes('giá') || message.includes('price')) {
    intents.push('pricing');
  }

  if (message.includes('khuyến mãi') || message.includes('sale')) {
    intents.push('deals');
  }

  if (message.includes('đổi trả') || message.includes('return')) {
    intents.push('return_policy');
  }

  return intents.length > 0 ? intents : ['general'];
}
```

## 🔒 Security & Best Practices

### 1. Input Validation

```javascript
// Validate and sanitize user input
const validateChatMessage = (message) => {
  if (!message || typeof message !== 'string') {
    throw new Error('Invalid message format');
  }

  if (message.length > 1000) {
    throw new Error('Message too long');
  }

  // Sanitize HTML and scripts
  return DOMPurify.sanitize(message);
};
```

### 2. Rate Limiting

```javascript
// Implement rate limiting
const rateLimit = require('express-rate-limit');

const chatbotLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: 'Too many chat messages, please try again later',
});

router.post('/message', chatbotLimiter, chatbotController.handleMessage);
```

### 3. Error Handling

```javascript
// Comprehensive error handling
async handleMessage(req, res) {
  try {
    const { message } = req.body;

    // Validate input
    if (!message) {
      return res.status(400).json({
        status: 'error',
        message: 'Message is required',
      });
    }

    const response = await geminiChatbotService.handleMessage(message);

    res.json({
      status: 'success',
      data: response,
    });
  } catch (error) {
    console.error('Chatbot error:', error);

    // Different error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }

    if (error.name === 'AIServiceError') {
      return res.status(503).json({
        status: 'error',
        message: 'AI service temporarily unavailable',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}
```

## 🎯 Testing

### 1. Unit Tests

```javascript
// Test AI service
describe('GeminiChatbotService', () => {
  it('should handle product search queries', async () => {
    const service = new GeminiChatbotService();
    const response = await service.handleMessage('Tôi muốn mua áo thun');

    expect(response.intent).toBe('product_search');
    expect(response.products).toHaveLength.greaterThan(0);
  });

  it('should fallback gracefully when AI fails', async () => {
    const service = new GeminiChatbotService();
    // Mock AI failure
    service.model = null;

    const response = await service.handleMessage('Hello');
    expect(response.response).toContain('Xin chào');
  });
});
```

### 2. Integration Tests

```javascript
// Test API endpoints
describe('Chatbot API', () => {
  it('should respond to chat messages', async () => {
    const response = await request(app)
      .post('/api/chatbot/message')
      .send({ message: 'Hello' })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data.response).toBeDefined();
  });
});
```

## 🚀 Deployment

### 1. Environment Setup

```bash
# Production environment
NODE_ENV=production
GEMINI_API_KEY=your_production_key
DATABASE_URL=your_database_url

# Optional: Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

### 2. Performance Optimization

```javascript
// Cache frequently accessed data
const NodeCache = require('node-cache');
const productCache = new NodeCache({ stdTTL: 300 }); // 5 minutes

async getAllProducts() {
  const cacheKey = 'all_products';
  let products = productCache.get(cacheKey);

  if (!products) {
    products = await Product.findAll({
      where: { status: 'active' },
      attributes: ['id', 'name', 'price', 'thumbnail'],
    });
    productCache.set(cacheKey, products);
  }

  return products;
}
```

### 3. Monitoring

```javascript
// Health check endpoint
router.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      gemini: !!process.env.GEMINI_API_KEY,
      database: true, // Add DB health check
    },
  };

  res.json(health);
});
```

## 📈 Performance Metrics

### Key Performance Indicators (KPIs)

1. **Response Time**: < 2 seconds average
2. **Success Rate**: > 95% successful responses
3. **User Engagement**: Average session duration
4. **Conversion Rate**: Chat to purchase ratio
5. **Customer Satisfaction**: User ratings

### Monitoring Dashboard

```javascript
// Analytics tracking
const analytics = {
  totalMessages: 0,
  successfulResponses: 0,
  averageResponseTime: 0,
  popularIntents: {},
  userSatisfaction: 0,
};

// Update metrics
function updateMetrics(event, data) {
  switch (event) {
    case 'message_sent':
      analytics.totalMessages++;
      break;
    case 'response_generated':
      analytics.successfulResponses++;
      break;
  }
}
```

## 🔮 Future Enhancements

### 1. Voice Integration

```javascript
// Voice recognition support
const speechRecognition = new SpeechRecognition();
speechRecognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  sendMessage(transcript);
};
```

### 2. Multi-language Support

```javascript
// Language detection and translation
const detectLanguage = (text) => {
  // Use language detection service
  return 'vi'; // Vietnamese
};

const translateMessage = async (text, targetLang) => {
  // Use translation service
  return translatedText;
};
```

### 3. Advanced AI Features

```javascript
// Sentiment analysis
const analyzeSentiment = (message) => {
  // Analyze user sentiment
  return {
    score: 0.8,
    label: 'positive',
    confidence: 0.95,
  };
};

// Personalization
const personalizeResponse = (response, userProfile) => {
  // Customize response based on user history
  return personalizedResponse;
};
```

## 💡 Troubleshooting

### Common Issues

1. **AI không phản hồi**

   - Kiểm tra GEMINI_API_KEY
   - Verify internet connection
   - Check API quota limits

2. **Phản hồi chậm**

   - Optimize prompt length
   - Implement response caching
   - Check server resources

3. **Sản phẩm không được gợi ý**
   - Update product database
   - Verify search keywords
   - Check product status

### Debug Mode

```javascript
// Enable debug mode
if (process.env.NODE_ENV !== 'production') {
  console.log('🤖 Debug mode enabled');
  console.log('📝 User message:', message);
  console.log('🔍 Search terms:', searchTerms);
  console.log('✅ Matched products:', matchedProducts.length);
}
```

---

## 🎉 Kết luận

AI Chatbot với Gemini integration đã được tích hợp thành công vào website bán hàng, cung cấp trải nghiệm mua sắm thông minh và tự nhiên. Hệ thống có khả năng:

- ✅ Tự động tư vấn sản phẩm
- ✅ Xử lý câu hỏi chính sách
- ✅ Hỗ trợ khách hàng 24/7
- ✅ Tích hợp với giỏ hàng
- ✅ Theo dõi hiệu suất

Với architecture linh hoạt và có thể mở rộng, chatbot sẵn sàng cho các tính năng nâng cao trong tương lai!

**Contact**: Để được hỗ trợ thêm về tích hợp AI Chatbot, vui lòng liên hệ team phát triển.
