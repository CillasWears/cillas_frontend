'use client'

import { useQuery } from '@tanstack/react-query'
import { search } from '@/lib/api'
import { queryKeys } from '@/constants/queryKeys'

export function useSearch(query: string) {
 return useQuery({
  queryKey: queryKeys.search.results(query),
  queryFn: () => search(query),
  enabled: query.length >= 2,
  staleTime: 30 * 1000, // 30 seconds
 })
}