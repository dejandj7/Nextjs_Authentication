import { takeEvery, take, call, put } from "redux-saga/effects";
import store from "store";
import qs from "qs";
import { useRouter } from "next/router";
import SETTINGS from "./constants";

function* changeSettingsWokrer({ payload: { setting, value } }) {
  yield put({
    type: SETTINGS.SET_STATE,
    payload: {
      [setting]: value,
    },
  });
}

function* setup() {
  const router = useRouter();
  // load settings from url on app load
  const changeSettings = (search) => {
    const query = qs.parse(search, {
      ignoreQueryPrefix: true,
    });

    Object.keys(query).forEach((key) => {
      let value;
      switch (query[key]) {
        case "false":
          value = false;
          break;
        case "true":
          value = true;
          break;
        default:
          value = query[key];
          break;
      }

      put({
        type: actions.CHANGE_SETTING,
        payload: {
          setting: key,
          value,
        },
      });
    });
  };

  yield changeSettings(router.query);
  yield appHistory.listen((params) => {
    const { search } = params;
    changeSettings(search);
  });

  // detect isMobileView setting on app load and window resize
  const isMobileView = (load = false) => {
    const currentState = global.window.innerWidth < 768;
    const prevState = store.get("app.settings.isMobileView");
    if (currentState !== prevState || load) {
      put({
        type: actions.CHANGE_SETTING,
        payload: {
          setting: "isMobileView",
          value: currentState,
        },
      });
    }
  };

  // detect viewport width on app load and window resize
  const isMenuToggled = () => {
    const shouldToggle = global.window.innerWidth < 1024;
    const prevState = store.get("app.settings.isMenuCollapsed");
    if (shouldToggle || prevState) {
      put({
        type: actions.CHANGE_SETTING,
        payload: {
          setting: "isMenuCollapsed",
          value: true,
        },
      });
    }
  };

  yield isMobileView(true);
  yield isMenuToggled();
  yield window.addEventListener("resize", () => {
    isMobileView();
    isMenuToggled();
  });
}

export default function* rootSaga() {
  yield take("INIT_SETUP");
  yield call(setup); // run once on app load to init listeners)
}
