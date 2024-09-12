export const selectRoot = (name, state) => state[name];

export const selectNotificationsData = (name, state) =>
  selectRoot(name, state).data;

export const selectNotification = (name, state) =>
  selectRoot(name, state).grant;
export const selectNotificationId = (name, state) =>
  selectRoot(name, state).notificationId;

export const selectAppTemplateId = (name, state) =>
  selectRoot(name, state).appTemplateId;

export const selectApplicationId = (name, state) =>
  selectRoot(name, state).applicationId;

export const selectAppTemplate = (name, state) =>
  selectRoot(name, state).appTemplate;
