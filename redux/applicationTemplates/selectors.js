export const selectRoot = (name, state) => state[name];
export const selectAppTemplates = (name, state) => selectRoot(name, state).data;
