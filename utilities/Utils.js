import { AppConfig } from "./config";
import axios from "axios";
import CryptoJS from "crypto-js";
import { fetchPostApi, fetchGetApi } from "../redux/fetchHelper";
import { receiveUser, userTasks } from "../redux/auth";
import store from "../utilities/store";
import { getDocumentsApi } from "../redux/generic/api";
import { getUserTasksApi } from "../redux/usertask/api";
import { responseUserTasks } from "../redux/usertask/actions";
import {
  receiveNotifications,
  userNotifications,
} from "../redux/notification/actions";
import { responseLinks, receivedLinks } from "../redux/links/actions";

const key = "Password";
const iv = "HR$2pIj--OOllxxa";
const keyWA = CryptoJS.enc.Utf8.parse(key);
const ivWA = CryptoJS.enc.Utf8.parse(iv);

export const deleteCookie = (name, value) => {
  document.cookie =
    name +
    "=" +
    (value || "") +
    "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
};

export const getCookie = (cName) => {
  if (typeof window !== "undefined") {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split("; ");
    let res;
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    return res;
  }
};

export const setCookie = (name, value) => {
  document.cookie = name + "=" + (value || "") + "; path=/";
};

export const encrypt = (stringToEncrypt) => {
  const encrypted = CryptoJS.AES.encrypt(stringToEncrypt, keyWA, {
    iv: ivWA,
  }).toString();
  console.debug(encrypted);
  return encrypted;
};

export const decrypt = (stringToDecrypt) => {
  var bytes = CryptoJS.AES.decrypt(stringToDecrypt, keyWA, { iv: ivWA });
  var result = bytes.toString(CryptoJS.enc.Utf8);
  return result ?? "";
};

export const setCustomer = (customer) => (dispatch) => {
  var customerStorage = "".concat("fosm", "User");
  if (!customer) {
    try {
      localStorage.removeItem(customerStorage);
      dispatch({
        type: "PROFILE_REMOVE",
      });
    } catch (err) {
      return _browserCookies.default.erase(customerStorage, {
        path: "/",
      });
    }
  }

  if (customer) {
    try {
      localStorage.setItem(customerStorage, JSON.stringify(customer));
      dispatch({
        type: "PROFILE_SET",
        payload: customer ? customer : null,
      });
    } catch (err) {
      _browserCookies.default.set(customerStorage, JSON.stringify(customer), {
        path: "/",
      });
    } // Emit an event on the authenticated user.
  }
};

export const getCustomer = () => {
  var customerStorage = "".concat("fosm", "User");

  try {
    return JSON.parse(localStorage.getItem(customerStorage) || null);
  } catch (e) {
    return JSON.parse(_browserCookies.default.get(customerStorage));
  }
};

export const createPDFDocument = async (data, documentTemplate) => {
  try {
    const response = await fetchPostApi(
      AppConfig.apiUrl + `/document/bookmarks?code=${documentTemplate}`,
      data
    );

    let file = response;
    var link = document.createElement("a");
    link.href = "data:application/pdf;base64," + file.fileContents;
    link.download = file.fileDownloadName;
    link.click();

    return file;
  } catch (e) {
    console.error("Generate PDF catch error " + e);
    throw new Error(e.message);
  }
};

export const createWordDocument = async (data) => {
  const headers = {
    Accept: "application/msword",
  };
  const { _id, spsLibrary, contractTemplate } = data;
  axios
    .post(
      AppConfig.apiUrl + "/document/bookmark",
      {
        templateId: contractTemplate,
        dataId: _id,
        collection: "Applications",
        language: "mk-MK",
        docType: "MSWORD",
        spsLibrary: spsLibrary,
        download: true,
      },
      { headers: headers }
    )
    .then((result) => {
      let file = result.data;
      var link = document.createElement("a");
      link.href = "data:application/msword;base64," + file.fileContents;
      link.download = file.fileDownloadName;
      link.click();
    })
    .catch((error) => {
      console.error("Generate MSWord catch error " + error.toJSON().message);
      throw "Cannot create MSWord document";
    });
};

export const downloadSps = async (documentId, contentType) => {
  let client = getApiFetchClient();

  client.scopes = [process.env.SCOPE_URL + "login.read"];

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await client.fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/document/download?sourcedoc=${documentId}`,
      options
    );
    if (response.status >= 400) {
      throw new Error(response.statusText);
    }
    let file = response.data;
    var link = document.createElement("a");
    link.href = `data:${contentType};base64,` + file.fileContents;
    link.download = file.fileDownloadName;
    link.click();
  } catch (e) {
    console.error("Download document from SPS catch error " + e);
    throw new Error(e.message);
  }
};

export const downloadSpsFromUrl = async (url, type, name) => {
  let urlGet = `${
    AppConfig.apiUrl
  }/document/getdocumentfromsps?url=${decodeURIComponent(
    url
  )}&mediaType=${type}`;

  fetchGetApi(urlGet)
    .then((body) => {
      var link = document.createElement("a");
      link.href = `data:${type};base64,` + body.fileContents;
      link.download = name;
      link.click();
    })
    .catch((e) => {
      console.error("Download document from SPS catch error " + e);
      throw new Error(e.message);
    });
};

export const parseJwt = (token) => {
  console.debug(token);
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    Buffer.from(base64, "base64")
      .toString()
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  console.log(JSON.parse(jsonPayload));
  return JSON.parse(jsonPayload);
};

export const getDBUser = async (email) => {
  var currentToken = "";
  fetchPostApi(`${process.env.NEXT_PUBLIC_API_URL}/user/login/submission`, {
    data: {
      idToken: {
        email: email,
      },
      email: email,
    },
    user: {
      email: email,
      fullName: "",
    },
  })
    .then((response) => {
      currentToken = response.headers["x-jwt-token"];
      localStorage.setItem("authToken", currentToken);
      // set profile and user data
      const userProfile = response.data;
      const user = userProfile.customer.relatedUsers.filter(
        (item) => item._id === userProfile.user.id
      )[0];
      const userRoles = user.userRoles.map((item) => item.name);
      var permissions = [];
      userProfile.customer.roles.forEach((element) => {
        if (userRoles.indexOf(element.name) >= 0) {
          permissions = _.union(permissions, element.permissions);
        }
      });
      permissions = _.sortBy(permissions);
      store.dispatch(
        receiveUser(
          userProfile.user,
          userProfile.customer,
          user.userRoles,
          permissions,
          userProfile.applications
        )
      );
      localStorage.setItem("user", JSON.stringify(userProfile.user));
      localStorage.setItem("customer", JSON.stringify(userProfile.customer));
      localStorage.setItem("userRoles", JSON.stringify(user.userRoles));
      localStorage.setItem("permissions", JSON.stringify(permissions));
      localStorage.setItem(
        "applications",
        JSON.stringify(userProfile.applications)
      );

      const userId = userProfile.user.id;

      getDocumentsApi({
        collection: "Links",
      })
        .then((response) => {
          store.dispatch(responseLinks(response.data));
          store.dispatch(receivedLinks(true));
        })
        .catch((err) => {
          store.dispatch(receivedLinks(true));
        });

      getUserTasksApi(userId)
        .then((response) => {
          store.dispatch(responseUserTasks(response.data));
          store.dispatch(userTasks(true));
        })
        .catch((err) => {
          store.dispatch(userTasks(false));
        });

      const filtersBuild = [
        {
          key: "UserId",
          value: userId,
        },
        {
          key: "IsSeen",
          value: false,
        },
      ];
      const parameters = {
        collection: "Notifications",
        filters: filtersBuild,
      };

      getDocumentsApi(parameters)
        .then((response) => {
          store.dispatch(receiveNotifications(response.data));
          store.dispatch(userNotifications(true));
        })
        .catch((err) => {
          store.dispatch(userNotifications(true));
        });
    })
    .catch((e) => {
      console.error(e);
    });
};

const types = {
  //   File Extension   MIME Type
  abs: "audio/x-mpeg",
  ai: "application/postscript",
  aif: "audio/x-aiff",
  aifc: "audio/x-aiff",
  aiff: "audio/x-aiff",
  aim: "application/x-aim",
  art: "image/x-jg",
  asf: "video/x-ms-asf",
  asx: "video/x-ms-asf",
  au: "audio/basic",
  avi: "video/x-msvideo",
  avx: "video/x-rad-screenplay",
  bcpio: "application/x-bcpio",
  bin: "application/octet-stream",
  bmp: "image/bmp",
  body: "text/html",
  cdf: "application/x-cdf",
  cer: "application/pkix-cert",
  class: "application/java",
  cpio: "application/x-cpio",
  csh: "application/x-csh",
  css: "text/css",
  dib: "image/bmp",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  dtd: "application/xml-dtd",
  dv: "video/x-dv",
  dvi: "application/x-dvi",
  eot: "application/vnd.ms-fontobject",
  eps: "application/postscript",
  etx: "text/x-setext",
  exe: "application/octet-stream",
  gif: "image/gif",
  gtar: "application/x-gtar",
  gz: "application/x-gzip",
  hdf: "application/x-hdf",
  hqx: "application/mac-binhex40",
  htc: "text/x-component",
  htm: "text/html",
  html: "text/html",
  ief: "image/ief",
  jad: "text/vnd.sun.j2me.app-descriptor",
  jar: "application/java-archive",
  java: "text/x-java-source",
  jnlp: "application/x-java-jnlp-file",
  jpe: "image/jpeg",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "application/javascript",
  jsf: "text/plain",
  json: "application/json",
  jspf: "text/plain",
  kar: "audio/midi",
  latex: "application/x-latex",
  m3u: "audio/x-mpegurl",
  mac: "image/x-macpaint",
  man: "text/troff",
  mathml: "application/mathml+xml",
  me: "text/troff",
  mid: "audio/midi",
  midi: "audio/midi",
  mif: "application/x-mif",
  mov: "video/quicktime",
  movie: "video/x-sgi-movie",
  mp1: "audio/mpeg",
  mp2: "audio/mpeg",
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  mpa: "audio/mpeg",
  mpe: "video/mpeg",
  mpeg: "video/mpeg",
  mpega: "audio/x-mpeg",
  mpg: "video/mpeg",
  mpv2: "video/mpeg2",
  ms: "application/x-wais-source",
  nc: "application/x-netcdf",
  oda: "application/oda",
  odb: "application/vnd.oasis.opendocument.database",
  odc: "application/vnd.oasis.opendocument.chart",
  odf: "application/vnd.oasis.opendocument.formula",
  odg: "application/vnd.oasis.opendocument.graphics",
  odi: "application/vnd.oasis.opendocument.image",
  odm: "application/vnd.oasis.opendocument.text-master",
  odp: "application/vnd.oasis.opendocument.presentation",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
  odt: "application/vnd.oasis.opendocument.text",
  otg: "application/vnd.oasis.opendocument.graphics-template",
  oth: "application/vnd.oasis.opendocument.text-web",
  otp: "application/vnd.oasis.opendocument.presentation-template",
  ots: "application/vnd.oasis.opendocument.spreadsheet-template",
  ott: "application/vnd.oasis.opendocument.text-template",
  ogx: "application/ogg",
  ogv: "video/ogg",
  oga: "audio/ogg",
  ogg: "audio/ogg",
  otf: "application/x-font-opentype",
  spx: "audio/ogg",
  flac: "audio/flac",
  anx: "application/annodex",
  axa: "audio/annodex",
  axv: "video/annodex",
  xspf: "application/xspf+xml",
  pbm: "image/x-portable-bitmap",
  pct: "image/pict",
  pdf: "application/pdf",
  pgm: "image/x-portable-graymap",
  pic: "image/pict",
  pict: "image/pict",
  pls: "audio/x-scpls",
  png: "image/png",
  pnm: "image/x-portable-anymap",
  pnt: "image/x-macpaint",
  ppm: "image/x-portable-pixmap",
  ppt: "application/vnd.ms-powerpoint",
  pps: "application/vnd.ms-powerpoint",
  ps: "application/postscript",
  psd: "image/vnd.adobe.photoshop",
  qt: "video/quicktime",
  qti: "image/x-quicktime",
  qtif: "image/x-quicktime",
  ras: "image/x-cmu-raster",
  rdf: "application/rdf+xml",
  rgb: "image/x-rgb",
  rm: "application/vnd.rn-realmedia",
  roff: "text/troff",
  rtf: "application/rtf",
  rtx: "text/richtext",
  sfnt: "application/font-sfnt",
  sh: "application/x-sh",
  shar: "application/x-shar",
  sit: "application/x-stuffit",
  snd: "audio/basic",
  src: "application/x-wais-source",
  sv4cpio: "application/x-sv4cpio",
  sv4crc: "application/x-sv4crc",
  svg: "image/svg+xml",
  svgz: "image/svg+xml",
  swf: "application/x-shockwave-flash",
  t: "text/troff",
  tar: "application/x-tar",
  tcl: "application/x-tcl",
  tex: "application/x-tex",
  texi: "application/x-texinfo",
  texinfo: "application/x-texinfo",
  tif: "image/tiff",
  tiff: "image/tiff",
  tr: "text/troff",
  tsv: "text/tab-separated-values",
  ttf: "application/x-font-ttf",
  txt: "text/plain",
  ulw: "audio/basic",
  ustar: "application/x-ustar",
  vxml: "application/voicexml+xml",
  xbm: "image/x-xbitmap",
  xht: "application/xhtml+xml",
  xhtml: "application/xhtml+xml",
  xls: "application/vnd.ms-excel",
  xml: "application/xml",
  xpm: "image/x-xpixmap",
  xsl: "application/xml",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xslt: "application/xslt+xml",
  xul: "application/vnd.mozilla.xul+xml",
  xwd: "image/x-xwindowdump",
  vsd: "application/vnd.visio",
  wav: "audio/x-wav",
  wbmp: "image/vnd.wap.wbmp",
  wml: "text/vnd.wap.wml",
  wmlc: "application/vnd.wap.wmlc",
  wmls: "text/vnd.wap.wmlsc",
  wmlscriptc: "application/vnd.wap.wmlscriptc",
  wmv: "video/x-ms-wmv",
  woff: "application/font-woff",
  woff2: "application/font-woff2",
  wrl: "model/vrml",
  wspolicy: "application/wspolicy+xml",
  z: "application/x-compress",
  zip: "application/zip",
};

export const getMimeTypeFromExtension = (extension) => {
  return types[extension];
};
