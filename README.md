# Milikku

Milikku is a modern, personal inventory management web application. It helps you keep track of your belongings, organize them by categories and locations, and easily manage items you lend to others. Built with a sleek, minimalist Notion-style design, it provides an intuitive user experience on both desktop and mobile devices.

## Features

- **Inventory Tracking:** Manage your personal items with details like purchase price, current value, serial numbers, and warranty dates.
- **Organization:** Categorize items and assign them to specific storage locations.
- **Receipt & Photo Management:** Upload images of your items and their purchase receipts directly to the cloud.
- **Lending System:** Keep track of who borrowed what, when they borrowed it, and their expected return date. Overdue items are highlighted automatically.
- **PWA Ready:** Install Milikku on your mobile device as a Progressive Web App for quick access.
- **Dark/Light Mode:** Full support for both themes to suit your preference.

## Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com)
- **Database:** [Supabase](https://supabase.com) (PostgreSQL)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
- **UI Components:** [shadcn-vue](https://www.shadcn-vue.com) & [Radix Vue](https://www.radix-vue.com)
- **State Management:** Nuxt `useState` & `@vueuse/core`

## Setup & Development

Make sure you have Node.js installed, then install the dependencies:

```bash
npm install
```

### Environment Variables

Copy the `.env.example` file to `.env` (if applicable) and configure your Supabase connection strings:

```env
DATABASE_URL="postgres://..."
NUXT_PUBLIC_SUPABASE_URL="https://..."
NUXT_PUBLIC_SUPABASE_KEY="..."
```

### Database Migrations

Apply the database schema changes using Drizzle:

```bash
npm run db:generate
npm run db:migrate
```

### Local Development

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Building for Production

Build the application for production:

```bash
npm run build
```

You can then preview the built application locally:

```bash
npm run preview
```

## Contributing & Issues

Found a bug or have a feature request? Please feel free to [open an issue](https://github.com/Suli-R/Milikku/issues) on GitHub.

Contributions are always welcome! If you'd like to improve Milikku, simply fork the repository, make your changes, and submit a Pull Request.




