# Google Search Console & SEO Setup Guide

This guide explains the steps required to verify your portfolio in Google Search Console, submit your sitemap, and enable search engine indexing.

---

## 1. Configure Environment Variables

Create a `.env.local` file locally (or add these variables in your hosting provider's dashboard, e.g., Vercel Project Settings &rarr; Environment Variables):

```bash
# Your live production domain (no trailing slash)
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Google Search Console HTML tag verification code
GOOGLE_SITE_VERIFICATION=your_google_verification_token
```

> **Note**: Do not commit your `.env.local` file with private credentials to Git. `.env.example` provides the template.

---

## 2. Obtain Google Search Console Verification Token

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property**:
   - Choose **URL prefix** and enter your production site URL (e.g., `https://your-domain.com`).
3. Under **Other verification methods**, select **HTML tag**.
4. Copy only the value inside `content="..."`:
   - For example, if Google gives:
     `<meta name="google-site-verification" content="abcdef1234567890" />`
     Copy: `abcdef1234567890`.
5. Set this value as `GOOGLE_SITE_VERIFICATION` in your production environment variables (e.g. Vercel dashboard).

---

## 3. Deploy the Site

Deploy your latest code with the environment variables configured.
Once deployed, Next.js automatically injects:
```html
<meta name="google-site-verification" content="abcdef1234567890" />
```
into the `<head>` of your website.

---

## 4. Verify Property in Google Search Console

1. Return to the **HTML tag** section in Google Search Console.
2. Click **Verify**.
3. Google will fetch your homepage and confirm ownership.

---

## 5. Submit the Sitemap

1. In Google Search Console, navigate to the **Sitemaps** section in the left sidebar.
2. Under **Add a new sitemap**, enter:
   ```
   sitemap.xml
   ```
3. Click **Submit**.
4. Google will queue and process `https://your-domain.com/sitemap.xml`.

---

## 6. What Was Implemented in the Codebase

- **Centralized Site Config** (`src/lib/site.ts`):
  - Provides a single source of truth for the production domain (`NEXT_PUBLIC_SITE_URL`).
  - Powers canonical URLs, Open Graph images, sitemaps, and Schema.org structured data.
- **Dynamic Sitemap** (`src/app/sitemap.ts`):
  - Generates `/sitemap.xml` automatically.
  - Dynamically includes `/`, `/projects`, `/blog`, and all published blog posts (`/blog/[slug]`).
  - Drafts and unpublished posts are excluded.
- **Robots Configuration** (`src/app/robots.ts`):
  - Generates `/robots.txt`.
  - Allows public crawling of all content.
  - Explicitly disallows private paths (`/admin`, `/api`).
  - References the canonical `sitemap.xml`.
- **Canonical URLs & Page Metadata**:
  - Root layout (`src/app/layout.tsx`): Sets `metadataBase`, Open Graph, Twitter card, favicon (`/icon.svg`), and Google verification.
  - Homepage (`src/app/page.tsx`): Canonical `/`.
  - Projects (`src/app/projects/page.tsx`): Canonical `/projects` with custom title and description.
  - Blog archive (`src/app/blog/page.tsx`): Canonical `/blog` with custom title and description.
  - Blog post (`src/app/blog/[slug]/page.tsx`): Dynamic canonical, Open Graph article tags, cover image, and draft protection (`notFound()` + `noindex`).
- **Structured Data (JSON-LD)** (`src/lib/schema.ts`):
  - `Person` schema: Includes name, title, profile image, location, and verified social profiles (LinkedIn, GitHub, X).
  - `WebSite` schema: Declares the official portfolio website.
  - `BlogPosting` schema: Injected dynamically on individual blog posts.
