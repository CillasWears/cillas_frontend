import apiClient from './client'

export interface UpdateProfilePayload {
 firstName?: string
 lastName?: string
 phone?: string
}

export interface AddAddressPayload {
 street: string
 city: string
 state: string
 country: string
 isDefault?: boolean
}

export async function getUserProfile() {
 const { data } = await apiClient.get('/users/profile')
 return data
}

export async function updateUserProfile(payload: UpdateProfilePayload) {
 const { data } = await apiClient.patch('/users/profile', payload)
 return data
}

export async function addAddress(payload: AddAddressPayload) {
 const { data } = await apiClient.post('/users/address', payload)
 return data
}

export async function deleteAddress(id: string) {
 const { data } = await apiClient.delete(`/users/address/${id}`)
 return data
}
