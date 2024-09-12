import CryptoJS from "crypto-js";
import axios from "axios";
import { getSession } from "next-auth/react";
import { AbortController } from "node-abort-controller";

const newAbortSignal = (timeoutMs) => {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), timeoutMs || 0);

  return abortController.signal;
};

const fetchGetApi = async (url, signal = null) => {
  const session = await getSession();
  console.debug(`fetchGetApi ${url}`, session);
  const headers = {
    Authorization: session ? `Bearer ${session.accessToken}` : "",
  };

  let urlLocal = url;
  if (typeof url !== "string") {
    urlLocal = url.toString();
  }

  const urlHash = urlLocal.includes("?")
    ? `${urlLocal}&poweredBy=PCES`
    : `${urlLocal}?poweredBy=PCES`;

  // eslint-disable-next-line new-cap
  const hash = CryptoJS.SHA256(urlHash.toLowerCase());

  urlLocal = urlLocal.includes("?")
    ? `${url}&controlId=${hash}`
    : `${url}?controlId=${hash}`;

  return await axios.get(urlLocal, {
    headers: headers,
    signal: signal
      ? signal
      : newAbortSignal(process.env.NEXT_PUBLIC_GetApiTimeout),
  });
};

const fetchGetWithTokenApi = async (url, token, signal = null) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  let urlLocal = url;
  if (typeof url !== "string") {
    urlLocal = url.toString();
  }

  const urlHash = urlLocal.includes("?")
    ? `${urlLocal}&poweredBy=PCES`
    : `${urlLocal}?poweredBy=PCES`;

  // eslint-disable-next-line new-cap
  const hash = CryptoJS.SHA256(urlHash.toLowerCase());

  urlLocal = urlLocal.includes("?")
    ? `${url}&controlId=${hash}`
    : `${url}?controlId=${hash}`;

  return await axios.get(urlLocal, {
    headers: headers,
    signal: signal
      ? signal
      : newAbortSignal(process.env.NEXT_PUBLIC_GetApiTimeout),
  });
};

const fetchPutApi = async (url, body, onUploadProgress, headers) => {
  const session = await getSession();
  if (body) {
    // add secret prop
    delete body["controlId"];
    body["poweredBy"] = "PCES";
    // eslint-disable-next-line new-cap
    const hash = CryptoJS.SHA256(JSON.stringify(body));
    // remove secret prop
    delete body["poweredBy"];
    body["controlId"] = hash.toString();
  }

  const config = {
    headers: {
      Authorization: session ? `Bearer ${session.accessToken}` : "",
      "Content-Type": onUploadProgress
        ? "multipart/form-data"
        : "application/json",
      referrerPolicy: "origin",
    },
    onUploadProgress: onUploadProgress,
  };

  return await axios.put(url, body, config);
};

const fetchPostApi = async (url, body, onUploadProgress, headers) => {
  const session = await getSession();

  if (body) {
    // add secret prop
    delete body["controlId"];
    body["poweredBy"] = "PCES";
    // eslint-disable-next-line new-cap
    const hash = CryptoJS.SHA256(JSON.stringify(body));
    // remove secret prop
    delete body["poweredBy"];
    body["controlId"] = hash.toString();
  }

  const config = {
    headers: headers
      ? headers
      : {
          Authorization: session ? `Bearer ${session.accessToken}` : "",
          "Content-Type": onUploadProgress
            ? "multipart/form-data"
            : "application/json",
          referrerPolicy: "origin",
        },
    onUploadProgress: onUploadProgress,
  };

  return await axios.post(url, body, config);
};

const fetchDeleteApi = async (url) => {
  const session = await getSession();
  let urlLocal = url;
  if (typeof url !== "string") {
    urlLocal = url.toString();
  }

  // eslint-disable-next-line new-cap
  const hash = CryptoJS.SHA256(urlLocal);
  urlLocal = urlLocal.includes("?")
    ? `${url}&controlId=${hash}`
    : `${url}?controlId=${hash}`;

  const config = {
    headers: {
      Authorization: session ? `Bearer ${session.accessToken}` : "",
    },
    onUploadProgress: onUploadProgress,
  };

  return await axios.delete(urlLocal, config);
};

export {
  fetchGetApi,
  fetchGetWithTokenApi,
  fetchPutApi,
  fetchPostApi,
  fetchDeleteApi,
};
