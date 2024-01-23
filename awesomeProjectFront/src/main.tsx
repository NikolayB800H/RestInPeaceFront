import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Provider } from "react-redux";
import { store } from "./store";
import { axiosAPI } from './api';
import { resetLogin, resetRole } from "./store/userSlice";
import { reset } from "./store/searchSlice";

const based = `${import.meta.env.BASE_URL}`;

axiosAPI.interceptors.response.use(null, function(error) {
  if (error.response.status == 403 && error.response.data.error === "Галя отмена!") {
    console.warn('А всё, а всё)');
    store.dispatch(resetLogin())
    store.dispatch(resetRole())
    store.dispatch(reset())
    localStorage.clear()
    //return redirect('/authorization');
    //window.location.href = '/authorization';
    history.go();
  }
  return Promise.reject(error);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter basename={based}>
      <App />
    </BrowserRouter>
  </Provider>
)
