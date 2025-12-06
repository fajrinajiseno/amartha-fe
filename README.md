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

or if prefer using docker:

```bash
colima start --memory 8 --cpu 4
make run-docker
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

## Evidence

evidences [video](https://drive.google.com/file/d/1BmeV9wJ16YrZAsHNFIXLvDQ_4Kgbow3L/view?usp=sharing)
