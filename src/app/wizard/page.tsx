import { TwoStepForm } from '@/components/organisms/TwoStepForm'

type WizardSearchParams = {
  role?: string
}

export default async function WizardPage({
  searchParams
}: {
  searchParams: Promise<WizardSearchParams>
}) {
  const params = await searchParams
  const role = params.role

  const mode: 'admin' | 'ops' = role === 'ops' ? 'ops' : 'admin'

  return <TwoStepForm mode={mode} />
}
