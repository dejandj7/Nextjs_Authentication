export const selectRoot = (name, state) => state[name];
export const selectGrantsData = (name, state) => selectRoot(name, state).data;
export const selectGrant = (name, state) => selectRoot(name, state).grant;
export const selectGrantId = (name, state) => selectRoot(name, state).grantId;
export const selectAppTemplateId = (name, state) => selectRoot(name, state).appTemplateId;
export const selectApplicationId = (name, state) => selectRoot(name, state).applicationId;
export const selectAppTemplate = (name, state) => selectRoot(name, state).appTemplate;
export const selectUnrelatedAppTemplateId = (name, state) => selectRoot(name, state).unrelatedAppTemplateId

