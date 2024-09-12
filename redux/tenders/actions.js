import TENDERS from "./constants";

const getTenders = (filtered) => ({
  type: TENDERS.REQUEST_TENDERS,
  filtered,
});

const errorFetchingTenders = (error) => ({
  type: TENDERS.REQUEST_ERROR,
  error,
});

const isLoading = (loading) => ({
  type: TENDERS.LOADING,
  loading,
});

const receivedTenders = (tenders) => ({
  type: TENDERS.GOT_TENDERS,
  tenders,
});

export { getTenders, errorFetchingTenders, isLoading, receivedTenders };
