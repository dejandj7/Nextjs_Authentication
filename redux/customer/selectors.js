export const selectRoot = (name, state) => state[name];
export const selectCustomers = (name, state) => selectRoot(name, state).data;
