import { compose, applyMiddleware, createStore } from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk';

export default function configureStore(initialState) {
    const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools
    return createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(thunk)));
}