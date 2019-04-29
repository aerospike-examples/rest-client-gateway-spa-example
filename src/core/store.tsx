import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import apiReducer from "../generated/core/reducers/apiReducer";

// This lets us generate links relative to where the app is running
// So on tomcat we can get proper routing even if we aren't at the root context
export const history = createBrowserHistory({
  basename: process.env.REACT_APP_STOCK_BASEPATH || ""
});

const composeEnhancer: typeof compose =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  combineReducers({
    api: apiReducer
  }),
  {},
  composeEnhancer(applyMiddleware(routerMiddleware(history), thunk))
);
