import { apiClient } from "@/app/api-client";
import type { AppDispatch } from "@/app/hook";
import {
  AIScanReceiptResponse,
  BulkImportTransactionPayload,
  CreateTransactionBody,
  GetAllTransactionParams,
  GetAllTransactionResponse,
  GetSingleTransactionResponse,
  UpdateTransactionPayload,
} from "./transationType";

type UndoPatch = { undo: () => void };
// The state shape `selectInvalidatedBy` needs — this is exactly what the
// mutation lifecycle's `getState()` provides (the RTK Query api slice).
type ApiRootState = Parameters<typeof apiClient.util.selectInvalidatedBy>[0];

/**
 * Optimistically remove the given transaction ids from every cached
 * `getAllTransactions` list so a deleted row disappears instantly — in sync with
 * the success toast — instead of lingering until a refetch completes. Returns the
 * patch handles so the caller can roll the rows back if the delete is rejected.
 */
const pruneTransactionCaches = (
  dispatch: AppDispatch,
  getState: () => ApiRootState,
  ids: Set<string>,
): UndoPatch[] => {
  const patches: UndoPatch[] = [];
  const entries = transactionApi.util.selectInvalidatedBy(getState(), [
    "transactions",
  ]);
  for (const { endpointName, originalArgs } of entries) {
    if (endpointName !== "getAllTransactions") continue;
    patches.push(
      dispatch(
        transactionApi.util.updateQueryData(
          "getAllTransactions",
          originalArgs as GetAllTransactionParams,
          (draft: GetAllTransactionResponse) => {
            if (!draft.transactions) return;
            const before = draft.transactions.length;
            draft.transactions = draft.transactions.filter(
              (t) => !ids.has(t._id) && !(t.id && ids.has(t.id)),
            );
            const removed = before - draft.transactions.length;
            if (draft.pagination && removed > 0) {
              draft.pagination.totalCount = Math.max(
                0,
                (draft.pagination.totalCount || 0) - removed,
              );
            }
          },
        ),
      ),
    );
  }
  return patches;
};

export const transactionApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    createTransaction: builder.mutation<void, CreateTransactionBody>({
      query: (body) => ({
        url: "/transaction/create",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["transactions", "analytics", "budget"],
    }),

    aiScanReceipt: builder.mutation<AIScanReceiptResponse, FormData>({
      query: (formData) => ({
        url: "/transaction/scan-receipt",
        method: "POST",
        body: formData,
      }),
    }),

    processVoiceTransaction: builder.mutation<AIScanReceiptResponse, FormData>({
      query: (formData) => ({
        url: "/voice/process",
        method: "POST",
        body: formData,
      }),
    }),

    getAllTransactions: builder.query<
      GetAllTransactionResponse,
      GetAllTransactionParams
    >({
      query: (params) => {
        const {
          keyword = undefined,
          type = undefined,
          recurringStatus = undefined,
          startDate = undefined,
          endDate = undefined,
          pageNumber = 1,
          pageSize = 10,
        } = params;

        return {
          url: "/transaction/all",
          method: "GET",
          params: {
            keyword,
            type,
            recurringStatus,
            startDate,
            endDate,
            pageNumber,
            pageSize,
          },
        };
      },
      providesTags: ["transactions"],
    }),

    getSingleTransaction: builder.query<GetSingleTransactionResponse, string>({
      query: (id) => ({
        url: `/transaction/${id}`,
        method: "GET",
      }),
    }),

    duplicateTransaction: builder.mutation<void, string>({
      query: (id) => ({
        url: `/transaction/duplicate/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["transactions", "analytics", "budget"],
    }),

    updateTransaction: builder.mutation<void, UpdateTransactionPayload>({
      query: ({ id, transaction }) => ({
        url: `/transaction/update/${id}`,
        method: "PUT",
        body: transaction,
      }),
      invalidatesTags: ["transactions", "analytics", "budget"],
    }),

    bulkImportTransaction: builder.mutation<void, BulkImportTransactionPayload>(
      {
        query: (body) => ({
          url: "/transaction/bulk-transaction",
          method: "POST",
          body,
        }),
        invalidatesTags: ["transactions", "analytics", "budget"],
      },
    ),

    deleteTransaction: builder.mutation<void, string>({
      query: (id) => ({
        url: `/transaction/delete/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        const patches = pruneTransactionCaches(dispatch, getState, new Set([id]));
        try {
          await queryFulfilled;
        } catch {
          patches.forEach((p) => p.undo());
        }
      },
      invalidatesTags: ["transactions", "analytics", "budget"],
    }),

    bulkDeleteTransaction: builder.mutation<void, string[]>({
      query: (transactionIds) => ({
        url: "/transaction/bulk-delete",
        method: "DELETE",
        body: {
          transactionIds,
        },
      }),
      async onQueryStarted(transactionIds, { dispatch, getState, queryFulfilled }) {
        const patches = pruneTransactionCaches(
          dispatch,
          getState,
          new Set(transactionIds),
        );
        try {
          await queryFulfilled;
        } catch {
          patches.forEach((p) => p.undo());
        }
      },
      invalidatesTags: ["transactions", "analytics", "budget"],
    }),
    // exportTransactions: builder.query<
    //   Blob,
    //   {
    //     keyword?: string;
    //     type?: string;
    //     recurringStatus?: string;
    //     from?: string;
    //     to?: string;
    //     format?: "csv" | "pdf";
    //   }
    // >({
    //   query: (params) => ({
    //     url: "/transaction/export",
    //     method: "GET",
    //     params,
    //     responseHandler: (res) => res.blob(),
    //   }),
    // }),
  }),
});

export const {
  useCreateTransactionMutation,
  useGetAllTransactionsQuery,
  useAiScanReceiptMutation,
  useProcessVoiceTransactionMutation,
  useGetSingleTransactionQuery,
  useDuplicateTransactionMutation,
  useUpdateTransactionMutation,
  useBulkImportTransactionMutation,
  useDeleteTransactionMutation,
  useBulkDeleteTransactionMutation,
  // useLazyExportTransactionsQuery,
} = transactionApi;
