// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import cartReducer from "@/store/slice/cartSlice";
// import { authApi } from "./services/api";
// import { uploadApi } from "./services/upload";
// import { productApi } from "./services/productApi";

// import {
// 	persistStore,
// 	persistReducer,
// 	FLUSH,
// 	REHYDRATE,
// 	PAUSE,
// 	PERSIST,
// 	PURGE,
// 	REGISTER,
// } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
// import { blogApi } from "./services/blogApi";
// import { reviewApi } from "./services/reviewApi";

// // 1️⃣ Configure persist
// const persistConfig = {
// 	key: "root",
// 	version: 1,
// 	storage,
// 	whitelist: ["cart"], // only persist the cart slice
// };

// // 2️⃣ Combine reducers
// const rootReducer = combineReducers({
// 	cart: cartReducer,
// 	[authApi.reducerPath]: authApi.reducer,
// 	[uploadApi.reducerPath]: uploadApi.reducer,
// 	[productApi.reducerPath]: productApi.reducer,
// 	[blogApi.reducerPath]: blogApi.reducer,
// 	[reviewApi.reducerPath]: reviewApi.reducer,
// });

// // 3️⃣ Wrap rootReducer with persistReducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
// 	reducer: persistedReducer,
// 	middleware: (getDefaultMiddleware) =>
// 		getDefaultMiddleware({
// 			serializableCheck: {
// 				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
// 			},
// 		})
// 			.concat(authApi.middleware)
// 			.concat(uploadApi.middleware)
// 			.concat(productApi.middleware)
// 			.concat(reviewApi.middleware)
// 			.concat(blogApi.middleware),
// });

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import cartReducer from "@/store/slice/cartSlice";
import { storeApi } from "./services/storeApi";

import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

// 1️⃣ Configure persist
const persistConfig = {
	key: "root",
	version: 1,
	storage,
	whitelist: ["cart"], // only persist the cart slice
};

// 2️⃣ Combine reducers
const rootReducer = combineReducers({
	// cart: cartReducer,
	[storeApi.reducerPath]: storeApi.reducer,
});

// 3️⃣ Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		})
			.concat(storeApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
