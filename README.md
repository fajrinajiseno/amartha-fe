This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Recommend version:

```bash
Node v24.11.1
pnpm 10.23.0
```

First, run the development server and json server:

```bash
cp env.example .env
pnpm server1
pnpm server2
pnpm dev
```

list of pages:
wizard admin: [http://localhost:3002/wizard?role=admin](http://localhost:3002/wizard?role=admin)
wizard ops: [http://localhost:3002/wizard?role=ops](http://localhost:3002/wizard?role=ops)
employees: [http://localhost:3002/employees](http://localhost:3002/employees)

run test with coverage:

```bash
pnpm test:coverage
```

run selected test:

```bash
pnpm test tests/components/atoms/ErrorText/index.test.tsx
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
