const BASE_URL = process.env.REACT_APP_API_URL;

const simulateLogout = () => {
  localStorage.removeItem("fitcyAccessToken");
  localStorage.removeItem("fitcyRefreshToken");
  location.reload();
};

const accessRefreshCycle = async () => {
  const accessResponse = await apiPost("/api/token/verify/", {
    token: localStorage.getItem("fitcyAccessToken"),
  });
  if (accessResponse.status !== 200) {
    const refreshResponse = await apiPost("/api/token/refresh/", {
      refresh: localStorage.getItem("fitcyRefreshToken"),
    });
    if (refreshResponse.status === 200) {
      const responseJSON = await refreshResponse.json();
      localStorage.setItem("fitcyAccessToken", responseJSON.access);
      return true;
    } else {
      return false;
    }
  } else return true;
};

export const apiGet = async (url) => {
  const response = await fetch(BASE_URL + url, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });

  return await response;
};

export const apiPost = async (url, data) => {
  const response = await fetch(BASE_URL + url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  return response;
};

export const apiPostAuthenticated = async (url, data) => {
  if (!accessRefreshCycle()) {
    simulateLogout();
  }

  const response = await fetch(BASE_URL + url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${localStorage.getItem("fitcyAccessToken")}`,
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  return await response;
};

export const apiGetAuthenticated = async (url) => {
  const result = await accessRefreshCycle();
  if (result === false) {
    simulateLogout();
  }

  const response = await fetch(BASE_URL + url, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${localStorage.getItem("fitcyAccessToken")}`,
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return await response;
};

export const apiDeleteAuthenticated = async (url) => {
  const result = await accessRefreshCycle();
  if (result === false) {
    simulateLogout();
  }

  const response = await fetch(BASE_URL + url, {
    method: "DELETE", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${localStorage.getItem("fitcyAccessToken")}`,
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return await response;
};

export const apiPatchAuthenticated = async (url, data) => {
  if (!accessRefreshCycle()) {
    simulateLogout();
  }

  const response = await fetch(BASE_URL + url, {
    method: "PATCH", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${localStorage.getItem("fitcyAccessToken")}`,
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  return await response;
};

export const apiPatchFileAuthenticated = async (url, data) => {
  if (!accessRefreshCycle()) {
    simulateLogout();
  }

  const response = await fetch(BASE_URL + url, {
    method: "PATCH", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    headers: {
      Authorization: `JWT ${localStorage.getItem("fitcyAccessToken")}`,
    },
    body: data, // body data type must match "Content-Type" header
  });

  return await response;
};
