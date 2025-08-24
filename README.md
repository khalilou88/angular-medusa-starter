# Angular Medusa Storefront Starter

A modern, open-source e-commerce storefront built with Angular and Tailwind CSS for Medusa backends.

## Features

- 🛍️ Product catalog with search and filtering
- 🛒 Shopping cart functionality
- 👤 Customer authentication and profiles
- 💳 Checkout process with payment integration
- 📱 Responsive design with Tailwind CSS
- 🚀 Server-side rendering support
- 🔍 SEO optimized
- ♿ Accessibility compliant

## Prerequisites

- Node.js (v16 or higher)
- Angular CLI (v15+)
- Running Medusa backend server
- npm or yarn package manager

## Installation

```bash
# Clone the repository
git clone https://github.com/khalilou88/angular-medusa-starter.git
cd angular-medusa-starter

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

## Environment Configuration

Create a `.env.local` file with your Medusa backend URL:

```env
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Common components (header, footer, etc.)
│   │   ├── product/        # Product-related components
│   │   └── cart/           # Cart components
│   ├── pages/              # Page components
│   │   ├── home/           # Homepage
│   │   ├── products/       # Product listing and details
│   │   ├── cart/           # Shopping cart
│   │   └── checkout/       # Checkout process
│   ├── services/           # Angular services
│   │   ├── medusa.service.ts
│   │   ├── cart.service.ts
│   │   └── auth.service.ts
│   ├── models/             # TypeScript interfaces
│   ├── guards/             # Route guards
│   └── interceptors/       # HTTP interceptors
├── assets/                 # Static assets
└── styles/                # Global styles and Tailwind config
```

## Key Components

### 1. Medusa Service
Central service for API communication with Medusa backend.

### 2. Product Components
- Product grid/list view
- Product detail page
- Product search and filters
- Product variants selector

### 3. Cart Management
- Add/remove items
- Update quantities
- Persist cart state
- Cart sidebar/modal

### 4. Customer Features
- Registration and login
- Profile management
- Order history
- Address book

### 5. Checkout Flow
- Shipping information
- Payment processing
- Order confirmation
- Email notifications

## Styling with Tailwind CSS

The storefront uses Tailwind CSS for styling with a custom design system:

- **Colors**: Brand colors and semantic color palette
- **Typography**: Consistent font scales and weights
- **Components**: Pre-built component classes
- **Responsive**: Mobile-first responsive design
- **Dark Mode**: Optional dark mode support

## API Integration

### Medusa Client Setup
```typescript
// services/medusa.service.ts
import Medusa from "@medusajs/medusa-js"

@Injectable({
  providedIn: 'root'
})
export class MedusaService {
  private client: Medusa

  constructor() {
    this.client = new Medusa({
      baseUrl: environment.medusaUrl,
      maxRetries: 3,
    })
  }

  // Product methods
  getProducts(params?: any) {
    return this.client.products.list(params)
  }

  getProduct(id: string) {
    return this.client.products.retrieve(id)
  }

  // Cart methods
  createCart() {
    return this.client.carts.create()
  }

  addToCart(cartId: string, item: any) {
    return this.client.carts.lineItems.create(cartId, item)
  }
}
```

## Development Scripts

```bash
# Start development server
ng serve

# Build for production
ng build

# Run tests
ng test

# Run e2e tests
ng e2e

# Lint code
ng lint

# Format code
npm run format
```

## Deployment

### Netlify
1. Build the project: `ng build`
2. Deploy the `dist/` folder to Netlify
3. Configure environment variables in Netlify dashboard

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Configure environment variables in Vercel dashboard

### Docker
```dockerfile
FROM node:16-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN ng build

EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0"]
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Medusa Documentation](https://docs.medusajs.com)
- 💬 [Discord Community](https://discord.gg/medusajs)
- 🐛 [GitHub Issues](https://github.com/yourusername/angular-medusa-starter/issues)

## Roadmap

- [ ] Advanced filtering and search
- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Multi-language support
- [ ] Advanced SEO features
- [ ] Performance optimizations
- [ ] PWA support