# Cloudflare Pages Deployment Instructions

This guide provides step-by-step instructions for migrating your Next.js project to Cloudflare Pages. The project is configured for static export with `output: "export"` in `next.config.mjs`, making it suitable for Cloudflare Pages deployment.

## Prerequisites

- A Cloudflare account
- Your project repository hosted on GitHub
- Node.js and pnpm installed locally (for testing builds)

## Step 1: Connect to GitHub Repository

1. Log in to your Cloudflare account at [cloudflare.com](https://cloudflare.com).
2. Navigate to the Cloudflare Pages dashboard by clicking on "Pages" in the left sidebar.
3. Click the "Create a project" button.
4. Select "Connect to Git" as the deployment method.
5. Authorize Cloudflare to access your GitHub account if prompted.
6. Cloudflare will display a list of your GitHub repositories.

## Step 2: Select the Repository and Branch

1. From the list of repositories, find and select your project repository (e.g., `your-username/sunya`).
2. Choose the branch you want to deploy from (typically `main` or `master`).
3. Click "Begin setup" to proceed.

## Step 3: Configure Build Settings

1. In the build settings section, configure the following:
   - **Build command**: `pnpm build`
   - **Build output directory**: `out`
   - **Root directory**: Leave as `/` (or specify if your project is in a subdirectory)
2. Ensure the Node.js version is compatible (Cloudflare Pages uses Node.js 18 by default; adjust if needed in advanced settings).
3. Add any necessary environment variables if your project requires them (e.g., API keys, but this static site may not need any).
4. Review the settings and click "Save and Deploy".

## Step 4: Deploy the Site

1. Cloudflare Pages will automatically start building your site using the configured settings.
2. Monitor the build process in the deployment logs. The build should:
   - Install dependencies using pnpm
   - Run `pnpm build` to generate the static files
   - Output the built files to the `out` directory
3. Once the build completes successfully, your site will be deployed and accessible at the provided Cloudflare Pages URL (e.g., `https://your-project.pages.dev`).
4. You can customize the domain by adding a custom domain in the Pages settings if desired.

## Additional Notes

- **Build Optimization**: Since your project uses `output: "export"` and `images: { unoptimized: true }`, it's optimized for static deployment.
- **Redirects and Headers**: Your project includes `public/_redirects` and `public/_headers` files, which Cloudflare Pages will respect for routing and headers.
- **Testing Locally**: Before deploying, test the build locally by running `pnpm build` and serving the `out` directory to ensure everything works.
- **Continuous Deployment**: Any pushes to the selected branch will trigger automatic redeployments.
- **Troubleshooting**: If the build fails, check the deployment logs for errors. Common issues include missing dependencies or incorrect build paths.

## Post-Deployment Checklist

- [ ] Verify the site loads correctly at the Cloudflare Pages URL
- [ ] Test all pages and functionality
- [ ] Check that images and assets load properly
- [ ] Confirm redirects and headers are working as expected
- [ ] Update any DNS settings if using a custom domain

If you encounter any issues during deployment, refer to the [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/) for additional support.