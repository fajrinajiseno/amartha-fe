import { TwoStepForm } from '@/components/organisms/TwoStepForm'

type PageProps = {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function Page({ searchParams }: PageProps) {
  const roleParam = searchParams?.role

  const mode: 'admin' | 'ops' = roleParam === 'ops' ? 'ops' : 'admin'

  return <TwoStepForm mode={mode} />
}
