import SETTINGS from "./constants";

const changeSetting = (payload) => ({
  type: SETTINGS.CHANGE_SETTING,
  payload,
});

export { changeSetting };
