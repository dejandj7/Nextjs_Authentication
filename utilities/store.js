import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import createRootReducer from "../utilities/rootReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import sagas from "../redux/sagas";
import { getSingalRConnection } from "../redux/signalR/actions";
import { createWrapper } from "next-redux-wrapper";

// In your application's entrypoint
import { enableMapSet } from "immer";

const initialState = {};
const sagaMiddleware = createSagaMiddleware({
  context: {
    getSingalRConnection,
  },
});

const middleware = [thunk, sagaMiddleware];
const enhancers = [];

let composeEnhancers = compose;

if (process.env.NODE_ENV === "development") {
  middleware.push(require("redux-immutable-state-invariant").default({}));
  //console.log('added redux-immutable-state-invariant');
  composeEnhancers = composeWithDevTools;
}

const store = createStore(
  createRootReducer(),
  initialState,
  composeEnhancers(applyMiddleware(...middleware), ...enhancers)
);
sagaMiddleware.run(sagas);

enableMapSet();

export default store;
