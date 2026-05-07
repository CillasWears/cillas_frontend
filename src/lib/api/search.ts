import apiClient from './client'
import type { SearchResults } from '../../types/index'

// GET /search?q=
export async function search(query: string): Promise<SearchResults> {
 const { data } = await apiClient.get<SearchResults>('/search', {
  params: { q: query },
 })
 return data
}