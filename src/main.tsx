import { createRoot } from 'react-dom/client'
import './index.css'
import {App} from "./app/ui/App/App.tsx";
import {BrowserRouter} from "react-router";
import {Provider} from "react-redux";
import {store} from "./app/model/store.ts";
import 'virtual:svg-icons-register'
import {AudioPlayerCore} from "@/app/ui";

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
      <Provider store={store}>
          <AudioPlayerCore/>
          <App />
      </Provider>
  </BrowserRouter>,
)
