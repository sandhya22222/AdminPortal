import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import Cookies from "js-cookie";

//! Reading Redux Data From LocalStorage since we can't use UseSelector Here
const reduxPersistData = localStorage.getItem("persist:root");
// console.log("reduxPersistData", reduxPersistData);

//! getting supported languages from .env file
// const supportedLngs = JSON.parse(process.env.REACT_APP_SUPPORTED_LNGS);

//! All the supporting languages Store can be Displayed
let supportedLngs =
  reduxPersistData && JSON.parse(reduxPersistData).reducerStoreLanguage;
supportedLngs = supportedLngs && JSON.parse(supportedLngs).storeLanguage;

//!Setting Default Language Code for Application
let defaultLngCode =
  reduxPersistData && JSON.parse(reduxPersistData).reducerStoreLanguage;
// console.log("defaultLngCode1", defaultLngCode);
defaultLngCode = defaultLngCode && JSON.parse(defaultLngCode).storeLanguage;
// console.log("defaultLngCode2", defaultLngCode);
defaultLngCode =
  defaultLngCode && defaultLngCode.filter((element) => element.is_default);
// console.log("defaultLngCode3", defaultLngCode);
defaultLngCode =
  defaultLngCode && defaultLngCode[0] && defaultLngCode[0].dm_language_code;

//* Set default language for the application in the cookie if user preference is not available.
//! Setting Current language Code for Application
let currentLanguageCode = Cookies.get("dmaplng");
if (currentLanguageCode === undefined) {
  Cookies.set("dmaplng", defaultLngCode);
  currentLanguageCode = defaultLngCode;
}

if (currentLanguageCode === undefined) {
  currentLanguageCode = defaultLngCode;
  // const supportedLngsArr = [];
  // supportedLngs.forEach((element) => {
  //   supportedLngsArr.push(element.iso_code);
  // });

  // let currentLanguageCodeCopy =
  //   JSON.parse(reduxPersistData).reducerSelectedLanguage;
  // currentLanguageCodeCopy = JSON.parse(currentLanguageCodeCopy)
  //   .selectedLanguage[0].language_code;

  // let defaultLngCodeCopy = JSON.parse(reduxPersistData).reducerDefaultLanguage;
  // defaultLngCodeCopy =
  //   JSON.parse(defaultLngCodeCopy).defaultLanguage[0].language_code;
}

let supportedLngsArr = [];
supportedLngs &&
  supportedLngs.forEach((element) => {
    supportedLngsArr.push(element.dm_language_code);
  });

// console.log("supportedLngs from i18n.js", supportedLngs);
// console.log("currentLanguageCode from i18n.js", currentLanguageCode);
// console.log("defaultLngCodeCopy from i18n.js", defaultLngCode);
// console.log("supportedLngsArrCopy from i18n.js", supportedLngsArr);
//  ['en', 'hi', 'kn']

//! if there is no supportedLngsArr and defaultLngCode from Redux then
//! setting english to byDefault
if (supportedLngsArr.length === 0) {
  supportedLngsArr = ["en"];
}

if (defaultLngCode === undefined || defaultLngCode === null) {
  defaultLngCode = "en";
}

// console.log("defaultLngCodeFinal", defaultLngCode);
// console.log("supportedLngsArrCopy from i18n.js", supportedLngsArr);

i18next
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: supportedLngsArr,
    // supportedLngs: ['en', 'hi', 'kn'],
    fallbackLng: defaultLngCode,
    debug: false,
    // Options for language detector
    detection: {
      // TODO after commenting this order lang change from url is working(remove this comment)
      order: ["path", "localStorage", "cookie", "htmlTag"],
      // order: ["path", "localStorage", "cookie", "htmlTag"],
      lookupCookie: "dmaplng",
      lookupLocalStorage: "dmaplng",
      lookupQuerystring: "lang",
      lookupFromPathIndex: "lang",
      caches: ["cookie", "localStorage"],
      // caches: [],
    },
    react: { useSuspense: false },
    backend: {
      loadPath: "/assets/locales/{{lng}}/{{ns}}/translation.json",
    },
    ns: ["common", "placeholders", "stores"],
  });

export default i18next;

// i18next.changeLanguage()
// lng:document.querySelector('html').lang,
// checkWhitelist: true,

// 'NamespacesConsumer' (imported as 'NamespacesConsumer') was not found in 'react-i18next'
