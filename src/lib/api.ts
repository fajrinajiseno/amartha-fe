import { env } from '@/config/env'
import type { Step1Data, Step2Data } from '@/types/wizard'

export type SearchOption = {
  id: string | number
  name: string
}

export type BasicInfo = {
  fullName: string
  email: string
  department: string
  role: string
  employeeId: string
  id: number
}

async function fetchWithQuery<T>(
  baseUrl: string,
  path: string,
  params: Record<string, string>
): Promise<T[]> {
  if (!params) return []

  const url = new URL(`${baseUrl}/${path}`)
  url.search = new URLSearchParams(params).toString()

  const res = await fetch(url)

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GET ${path} failed: ${res.status} ${text}`)
  }

  const data = (await res.json()) as T[]
  return data
}

async function postJSON(baseUrl: string, path: string, body: unknown) {
  const res = await fetch(`${baseUrl}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`POST ${path} failed: ${res.status} ${text}`)
  }

  return res.json()
}

export async function getBasicInfo(
  params: Record<string, string>
): Promise<BasicInfo[]> {
  return fetchWithQuery<BasicInfo>(env.server1, 'basicInfo', params)
}

export async function searchDepartments(
  params: Record<string, string>
): Promise<SearchOption[]> {
  return fetchWithQuery<SearchOption>(env.server1, 'departments', params)
}

export async function searchLocations(
  params: Record<string, string>
): Promise<SearchOption[]> {
  return fetchWithQuery<SearchOption>(env.server2, 'locations', params)
}

export async function submitBasicInfo(step1: Step1Data) {
  return postJSON(env.server1, 'basicInfo', step1)
}

export async function submitDetails(step2: Step2Data) {
  return postJSON(env.server2, 'details', step2)
}
