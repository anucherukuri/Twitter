import { createStore, compose, applyMiddleware } from "redux";
import mainReducers from "../reducers";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
  user: null,
  tweets: [],
  username: null,
  users: null,
  searchUsername: null,
  activePage: null,
  notifications: 0,
  notificationsArrray: [],
  likedTweets: [],
};
const persistConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persistConfig, mainReducers);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  persistedReducer,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);
export const persistedStore = persistStore(store);
