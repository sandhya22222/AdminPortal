import { applyMiddleware, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { composeWithDevTools } from '@redux-devtools/extension'
import storage from 'redux-persist/lib/storage'
import reducers from './reducer/index'

// in Store it take parammeter reducer from index.js
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['reducerUserLoggedInfo', 'reducerStoreLanguage', 'reducerDefaultLanguage', 'reducerSelectedLanguage'],
}

const persistedReducer = persistReducer(persistConfig, reducers)

const Store = createStore(persistedReducer, composeWithDevTools(applyMiddleware()))

const Persistor = persistStore(Store)
export { Persistor }
export default Store
