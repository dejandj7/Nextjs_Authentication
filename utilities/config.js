var PROJECT_URL = process.env.PROJECT_URL;
var API_URL = process.env.API_URL; //'https://pceswebapi.azurewebsites.net' // 'https://pceswebapifosm.azurewebsites.net' // 'http://localhost:6600'
var API_URL_BPMN = process.env.API_URL_BPMN;
var SPSLibrary = process.env.SPSLibrary;
var SPSLibraryGUID = process.env.SPSLibraryGUID;
var SPSLibraryConfidential = process.env.SPSLibraryConfidential;
var SPSLibraryGUIDConfidential = process.env.SPSLibraryGUIDConfidential;
var ORGANIZATION_ID = process.env.ORGANIZATION_ID;
var GetApiTimeout = process.env.GetApiTimeout;
var USE_FICHE = process.env.USE_FICHE;
var Organization = process.env.NEXT_PUBLIC_ORG;

export const AppConfig = {
  projectUrl: PROJECT_URL,
  apiUrl: API_URL,
  apiUrlBpmn: API_URL_BPMN,
  spsLibrary: SPSLibrary,
  spsLibraryGuid: SPSLibraryGUID,
  spsLibraryConfidential: SPSLibraryConfidential,
  spsLibraryGuidConfidential: SPSLibraryGUIDConfidential,
  organization: Organization,
  organizationId: ORGANIZATION_ID,
  getApiTimeout: GetApiTimeout,
  useFiche: USE_FICHE,
};

export const AuthConfig = {
  anonState: "/",
  authState: "/",
  login: {
    form: "user/login",
  },
  register: {
    form: "user/register",
  },
  verify: {
    form: "user/verify",
  },
  resetpassword: {
    form: "user/reset",
  },
  usermanagement: {
    form: "users/details",
  },
  customermanagementprivate: {
    form: "customer/updateprivate",
  },
  customermanagementlegal: {
    form: "customer/updatelegal",
  },
  settings: {
    form: "customer/update",
  },
};

export const DashConfig = {
  budget: {
    form: "dashboards/budget",
  },
  tenderdefn: {
    form: "application/tender",
  },
  tenderdesc: {
    form: "tenderDesc",
  },
  appReview: {
    form: "dashboards/appreview",
  },
};

export const Notification = {
  notification: {
    form: "apps/notification/new",
  },
  notificationedit: {
    form: "apps/notification/edit",
  },
};

export const AppsConfig = {
  applicationtemplates: {
    form: "apps/applicationtemplates",
  },
  applicationtemplatesind: {
    form: "apps/applicationtemplates/ind",
  },
  applicationtemplatesorg: {
    form: "apps/applicationtemplates/org",
  },
  application: {
    form: "apps/application/new",
  },
  viewapplication: {
    form: "apps/application/view",
  },
  applicationsview: {
    form: "/apps/applications",
  },
  applicationsedit: {
    form: "apps/applications/edit",
  },
  applicationfiche: {
    form: "apps/applicationfiche",
  },
  applicationscoringreview: {
    form: "budgetnegotiation",
  },
  donorproject: {
    form: "donorProject",
  },
  reportView: {
    form: "viewReport",
  },
  orderProcessing: {
    form: "orderProcessing",
  },
  orderView: {
    form: "orderView",
  },
  donorOrderView: { form: "donorOrderView" },
};
