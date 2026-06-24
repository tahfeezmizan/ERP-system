import { baseApi } from "./baseApi";
import { getPermissionsForRole, type Role } from "@/constants/permissions";
import { MOCK_CREDENTIALS } from "@/constants/app";
import { delay } from "@/lib/utils";
import type { AuthTokens, User } from "@/types";
import type { LoginFormData } from "@/schemas/auth";

function generateToken(): string {
  return btoa(JSON.stringify({ ts: Date.now(), rnd: Math.random() }));
}

const mockUser: User = {
  id: "user_1",
  name: "Demo Admin",
  email: "admin@demo.com",
  role: "admin",
  permissions: getPermissionsForRole("admin"),
  companyId: "comp_1",
  department: "Property Management",
  phone: "+1 (555) 000-0000",
  jobTitle: "Property Manager",
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { user: User; tokens: AuthTokens },
      LoginFormData
    >({
      queryFn: async (credentials) => {
        await delay(800);
        if (
          credentials.email === MOCK_CREDENTIALS.email &&
          credentials.password === MOCK_CREDENTIALS.password
        ) {
          const tokens: AuthTokens = {
            accessToken: generateToken(),
            refreshToken: generateToken(),
            expiresAt: Date.now() + 3600000,
          };
          return { data: { user: mockUser, tokens } };
        }
        return {
          error: { status: 401, data: { message: "Invalid email or password" } },
        };
      },
      invalidatesTags: ["Auth"],
    }),
    refreshToken: builder.mutation<AuthTokens, string>({
      queryFn: async () => {
        await delay(300);
        return {
          data: {
            accessToken: generateToken(),
            refreshToken: generateToken(),
            expiresAt: Date.now() + 3600000,
          },
        };
      },
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      queryFn: async ({ email }) => {
        await delay(600);
        return {
          data: {
            message: `Password reset link sent to ${email}`,
          },
        };
      },
    }),
    resetPassword: builder.mutation<
      { message: string },
      { password: string; token?: string }
    >({
      queryFn: async () => {
        await delay(600);
        return { data: { message: "Password reset successfully" } };
      },
    }),
    changePassword: builder.mutation<
      { message: string },
      { currentPassword: string; newPassword: string }
    >({
      queryFn: async () => {
        await delay(600);
        return { data: { message: "Password changed successfully" } };
      },
    }),
    getProfile: builder.query<User, void>({
      queryFn: async () => {
        await delay(300);
        return { data: mockUser };
      },
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetProfileQuery,
} = authApi;
