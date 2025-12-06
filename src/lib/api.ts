import type { Step1Data, Step2Data } from '@/types/wizard'
import type { BasicInfo, Details } from '@/types/employee'

export type SearchOption = {
  id: string | number
  name: string
}

export interface Response<T> {
  data: T[]
  total?: number
}

function buildUrl(path: string, params?: Record<string, string>) {
  const search = params ? new URLSearchParams(params).toString() : ''
  return search ? `/api/${path}?${search}` : `/api/${path}`
}

async function fetchWithQuery<T>(
  path: string,
  params: Record<string, string>
): Promise<Response<T>> {
  if (!params) {
    return { data: [] }
  }

  const url = buildUrl(path, params)
  const res = await fetch(url, {
    method: 'GET'
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GET /api/${path} failed: ${res.status} ${text}`)
  }

  const json = (await res.json()) as Response<T>

  return {
    data: json.data ?? [],
    total: json.total
  }
}

async function postJSON(path: string, body: unknown) {
  const res = await fetch(`/api/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`POST /api/${path} failed: ${res.status} ${text}`)
  }

  return res.json()
}

// ---------- Public API ----------

export async function getBasicInfo(
  params: Record<string, string>
): Promise<Response<BasicInfo>> {
  return fetchWithQuery<BasicInfo>('basicInfo', params)
}

export async function getDetails(
  params: Record<string, string>
): Promise<Response<Details>> {
  return fetchWithQuery<Details>('details', params)
}

export async function searchDepartments(
  params: Record<string, string>
): Promise<Response<SearchOption>> {
  return fetchWithQuery<SearchOption>('departments', params)
}

export async function searchLocations(
  params: Record<string, string>
): Promise<Response<SearchOption>> {
  return fetchWithQuery<SearchOption>('locations', params)
}

export async function submitBasicInfo(step1: Step1Data) {
  return postJSON('basicInfo', step1)
}

export async function submitDetails(step2: Step2Data) {
  return postJSON('details', step2)
}
