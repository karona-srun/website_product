# LumaStore Frontend

Modern product showcase website built with Vue 3, TypeScript, Tailwind CSS, Vue Router, and Pinia.

## Run Locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Data Source Strategy

This app supports two catalog sources:

- **Mock mode (default):** uses in-project data from `src/data/`
- **API mode:** enabled when `VITE_API_BASE_URL` is set

The source is resolved in `src/services/productService.ts`.

### Enable API Mode

Create `.env` in the project root:

```bash
VITE_API_BASE_URL=https://your-api-base-url.com
```

When this value exists, the frontend requests:

- `GET ${VITE_API_BASE_URL}/products`

If the request fails, the app gracefully falls back to mock data.

## Expected API Contract

`GET /products` must return:

```json
{
  "products": [
    {
      "id": 1,
      "name": "AeroBook Pro 14",
      "slug": "aerobook-pro-14",
      "description": "Ultra-light laptop with all-day battery life.",
      "price": 1399,
      "images": ["https://..."],
      "category": {
        "id": 1,
        "name": "Electronics",
        "slug": "electronics",
        "icon": "💻",
        "image": "https://..."
      },
      "tags": ["new", "laptop"],
      "rating": 4.8,
      "reviewCount": 312,
      "stock": 13,
      "specs": {
        "CPU": "M2",
        "RAM": "16GB",
        "Storage": "512GB SSD"
      }
    }
  ],
  "categories": [
    {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics",
      "icon": "💻",
      "image": "https://..."
    }
  ]
}
```

Type definitions used by the frontend are in `src/types/product.ts`.
# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).
