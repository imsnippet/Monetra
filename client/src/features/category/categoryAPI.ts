import { apiClient } from "@/app/api-client";
import {
  CategoryResponse,
  CreateCategoryRequest,
  GetCategoriesResponse,
  UpdateCategoryRequest,
} from "./categoryType";

export const categoryApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<GetCategoriesResponse, void>({
      query: () => "/category",
      providesTags: ["categories"],
    }),
    createCategory: builder.mutation<CategoryResponse, CreateCategoryRequest>({
      query: (body) => ({ url: "/category", method: "POST", body }),
      invalidatesTags: ["categories"],
    }),
    updateCategory: builder.mutation<CategoryResponse, UpdateCategoryRequest>({
      query: ({ id, body }) => ({ url: `/category/${id}`, method: "PUT", body }),
      invalidatesTags: ["categories"],
    }),
    deleteCategory: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/category/${id}`, method: "DELETE" }),
      // Remove the category from the cached list instantly so it disappears in
      // sync with the success toast; roll back if the server rejects it.
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          categoryApi.util.updateQueryData("getCategories", undefined, (draft) => {
            if (draft?.data) {
              draft.data = draft.data.filter((c) => c._id !== id);
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
