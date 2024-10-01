import * as TYPES from "@/actions/types";

const initialState = {
  results: [],
  start_date: "",
  end_date: "",
  graphData: [],
  totalItems: 0,
  page: 1,
  perPage: 10,
  size: 10,
  offset: 1,
  metrics: [],
  metrics_selected: {},
};
const ILabReducer = (state = initialState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case TYPES.SET_ILAB_JOBS_DATA:
      return {
        ...state,
        results: [...state.results, ...payload],
      };
    case TYPES.SET_ILAB_DATE_FILTER:
      return {
        ...state,
        start_date: payload.start_date,
        end_date: payload.end_date,
      };
    case TYPES.SET_ILAB_TOTAL_ITEMS:
      return {
        ...state,
        totalItems: payload,
      };
    case TYPES.SET_ILAB_OFFSET:
      return { ...state, offset: payload };
    case TYPES.SET_ILAB_PAGE:
      return { ...state, page: payload };
    case TYPES.SET_ILAB_PAGE_OPTIONS:
      return { ...state, page: payload.page, perPage: payload.perPage };
    case TYPES.SET_ILAB_METRICS:
      return { ...state, metrics: [...state.metrics, payload] };
    case TYPES.SET_ILAB_SELECTED_METRICS:
      return {
        ...state,
        metrics_selected: payload,
      };
    case TYPES.SET_ILAB_GRAPH_DATA:
      return { ...state, graphData: payload };
    default:
      return state;
  }
};

export default ILabReducer;