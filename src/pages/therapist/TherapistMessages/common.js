import * as $ from "jquery";

export function validator(formData, fields) {
  const keys = Object.keys(formData);
  for (const key of keys) {
    if (fields.indexOf(key) !== -1) {
      if (!formData[key]) {
        return false;
      }
    }
  }
  return true;
}

export function serializeFormData(domId) {
  const formData = $(`#${domId}`).serializeArray();
  const obj = {};
  for (const item of formData) {
    const key = item.name;
    const val = item.value;
    obj[key] = val;
  }
  return obj;
}

export function canvasToDataURL(canvas, format, quality) {
  return canvas.toDataURL(format || "image/jpeg", quality || 1.0);
}

export function dataURLToBlob(dataurl) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export function imageToCanvas(src, cb) {
  const canvas = document.createElement("CANVAS");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.src = src;
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    cb(canvas);
  };
}

export function fileOrBlobToDataURL(obj, cb) {
  const a = new FileReader();
  a.readAsDataURL(obj);
  a.onload = function (e) {
    cb(e.target.result);
  };
}

// Blob 转 image
export function blobToImage(blob, cb) {
  fileOrBlobToDataURL(blob, (dataurl) => {
    const img = new Image();
    img.src = dataurl;
    cb(img);
  });
}

// image 转 Blob
export function imageToBlob(src, cb) {
  imageToCanvas(src, (canvas) => {
    cb(dataURLToBlob(canvasToDataURL(canvas)));
  });
}
