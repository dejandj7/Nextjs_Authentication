import store from "store";
import english from "../../locales/en-US";
import macedonian from "../../locales/mk-MK";
import SETTINGS from "./constants";

const storedSettings = (initialSettings) => {
  const settings = {};
  Object.keys(initialSettings).forEach((key) => {
    const item = store.get(`app.settings.${key}`);
    settings[key] = typeof item !== "undefined" ? item : initialSettings[key];
  });
  return {
    ...settings,
    menuLayoutType: "top",
    locales: {
      "en-US": english,
      "mk-MK": macedonian,
    },
    i18n: {
      mk: macedonian.mkLabels,
      en: english.enLabels,
    },
  };
};

const initialState = {
  ...storedSettings({
    locale: "mk-MK",
    routerAnimation: "slide-fadein-up", // none, slide-fadein-up, slide-fadein-right, fadein, zoom-fadein
    isSidebarOpen: false,
  }),
};

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case SETTINGS.SET_STATE:
      return {
        ...state,
        ...action.payload,
      };
    case SETTINGS.CHANGE_SETTING:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
