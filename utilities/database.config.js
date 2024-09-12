import Dexie from "dexie";

const database = new Dexie("database");
database.version(1).stores({
  applications: "++id, application",
});

export const applicationTable = database.table("applications");

export default database;
