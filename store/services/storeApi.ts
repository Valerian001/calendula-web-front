/* eslint-disable @typescript-eslint/no-explicit-any */
// store/storeApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const storeApi = createApi({
	reducerPath: "storeApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://calendula.pythonanywhere.com/store/",
	}), // base path
	tagTypes: ["Fashion", "Food", "Gadget"],

	endpoints: (builder) => ({
		// ---- FASHION ----
		getFashion: builder.query<any[], void>({
			query: () => "fashion/list/",
			providesTags: ["Fashion"],
		}),
		getFashionById: builder.query<any, number>({
			query: (id) => `fashion/list/?id=${id}`,
			providesTags: ["Fashion"],
		}),
		createFashion: builder.mutation<any, Partial<any>>({
			query: (body) => ({
				url: "fashion/create/",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Fashion"],
		}),
		updateFashion: builder.mutation<any, { id: number; data: any }>({
			query: ({ id, data }) => ({
				url: `fashion/update/${id}/`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: ["Fashion"],
		}),
		deleteFashion: builder.mutation<any, number>({
			query: (id) => ({
				url: `fashion/delete/${id}/`,
				method: "DELETE",
			}),
			invalidatesTags: ["Fashion"],
		}),

		// ---- FOOD ----
		getFood: builder.query<any[], void>({
			query: () => "food/list/",
			providesTags: ["Food"],
		}),
		getFoodById: builder.query<any, number>({
			query: (id) => `food/list/?id=${id}`,
			providesTags: ["Food"],
		}),
		createFood: builder.mutation<any, Partial<any>>({
			query: (body) => ({
				url: "food/create/",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Food"],
		}),
		updateFood: builder.mutation<any, { id: number; data: any }>({
			query: ({ id, data }) => ({
				url: `food/update/${id}/`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: ["Food"],
		}),
		deleteFood: builder.mutation<any, number>({
			query: (id) => ({
				url: `food/delete/${id}/`,
				method: "DELETE",
			}),
			invalidatesTags: ["Food"],
		}),

		// ---- GADGET ----
		getGadget: builder.query<any[], void>({
			query: () => "gadget/list/",
			providesTags: ["Gadget"],
		}),
		getGadgetById: builder.query<any, number>({
			query: (id) => `gadget/list/?id=${id}`,
			providesTags: ["Gadget"],
		}),
		createGadget: builder.mutation<any, Partial<any>>({
			query: (body) => ({
				url: "gadget/create/",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Gadget"],
		}),
		updateGadget: builder.mutation<any, { id: number; data: any }>({
			query: ({ id, data }) => ({
				url: `gadget/update/${id}/`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: ["Gadget"],
		}),
		deleteGadget: builder.mutation<any, number>({
			query: (id) => ({
				url: `gadget/delete/${id}/`,
				method: "DELETE",
			}),
			invalidatesTags: ["Gadget"],
		}),
	}),
});

// Export hooks
export const {
	useGetFashionQuery,
	useGetFashionByIdQuery,
	useCreateFashionMutation,
	useUpdateFashionMutation,
	useDeleteFashionMutation,

	useGetFoodQuery,
	useGetFoodByIdQuery,
	useCreateFoodMutation,
	useUpdateFoodMutation,
	useDeleteFoodMutation,

	useGetGadgetQuery,
	useGetGadgetByIdQuery,
	useCreateGadgetMutation,
	useUpdateGadgetMutation,
	useDeleteGadgetMutation,
} = storeApi;
