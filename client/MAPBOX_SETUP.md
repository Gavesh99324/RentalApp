# Mapbox Setup Instructions

## Getting Your Mapbox Access Token

1. **Create a Mapbox Account** (if you don't have one)
   - Go to [https://www.mapbox.com/](https://www.mapbox.com/)
   - Click "Sign up" and create a free account

2. **Get Your Access Token**
   - After signing in, go to [https://account.mapbox.com/](https://account.mapbox.com/)
   - Scroll down to "Access tokens"
   - Copy your **Default public token** (starts with `pk.`)

3. **Add Token to Your Project**
   - Open `client/.env` file
   - Replace `your_mapbox_token_here` with your actual token:

   ```
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_actual_token_here
   ```

4. **Restart Your Development Server**
   - Stop your current dev server (Ctrl+C)
   - Run `npm run dev` again
   - The map should now load properly!

## Fixing the Image 404 Errors

The property images are currently using placeholder URLs (`example.com`) that don't exist. To fix this:

### Option 1: Use Real Image URLs

Replace the image URLs in your seed data with actual property images from:

- Your own hosted images
- A CDN service
- Stock photo websites (Unsplash, Pexels, etc.)

### Option 2: Use Local Placeholder Images

1. Add placeholder images to `client/public/` folder
2. Update image URLs in your seed data to use local paths
3. Example: `/placeholder.jpg` or `/property-placeholder.png`

### Update Next.js Image Config

If using external images, update `client/next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "your-image-host.com",
    },
  ],
}
```
