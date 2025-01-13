import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import usersReducer from './Slices/UserSlice.jsx';
import logger from 'redux-logger';

// Combine reducers
const rootReducer = combineReducers({
    users: usersReducer,
});

// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Avoid issues with non-serializable data in the state
        }).concat(logger), // Add redux-logger middleware
});

// Persistor
const persistor = persistStore(store);

export { store, persistor };
