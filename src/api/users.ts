import api from "@/lib/api";
import type { ProfileUpdateRequest, UserResponse } from "@/types";

export async function getUser(userId: number) {
  const { data } = await api.get<UserResponse>(`/users/${userId}`);
  return data;
}

export async function updateProfile(userId: number, body: ProfileUpdateRequest) {
  const { data } = await api.patch<UserResponse>(`/users/${userId}/profile`, body);
  return data;
}
