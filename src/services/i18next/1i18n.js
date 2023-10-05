import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import util from "../../util/common";

const localesURL = process.env.REACT_APP_LOCALES_URL;

//! Disable all consoles when deployed in production
console.log("PROFILE:", process.env.NODE_ENV);
if (!util.isDev()) {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.trace = () => {};
}

document.body.style.direction = util
  .getSelectedLanguageDirection()
  ?.toLowerCase();

// let storeName;
// try {
//   const searchParams = new URLSearchParams(window.location.search);
//   const response = await fetch(configS3URL);
//   const appConfig = await response.json();

//   storeName = util.getStoreName(appConfig, searchParams);
// } catch (error) {
//   //Redirect to Error Page
//   console.log("APPLICATION CONFIGURATION NOT FOUND2");
// }

const getCurrentHost = util.isDev()
  ? "/assets/locales/{{lng}}/{{ns}}/translation.json"
  : localesURL;

i18n
  .use(Backend)
  .use(new LanguageDetector(null, { lookupLocalStorage: "mpaplng" }))
  .use(initReactI18next)
  .init({
    supportedLngs: util.getStoreSupportedLngs(),
    fallbackLng: util.getStoreDefaultLngCode(),
    debug: true,
    returnEmptyString: false,

    whitelist: util.getStoreSupportedLngs(), // array with whitelisted languages
    nonExplicitWhitelist: false,
    load: "all", // | currentOnly | languageOnly
    preload: [util.getStoreDefaultLngCode(), util.getUserSelectedLngCode()], // array with preload languages

    // order and from where user language should be detected
    order: [
      "querystring",
      "cookie",
      "localStorage",
      "sessionStorage",
      "navigator",
      "htmlTag",
      "path",
      "subdomain",
    ],

    // keys or params to lookup language from
    lookupQuerystring: "lng",
    lookupCookie: "lng",
    lookupLocalStorage: "lng",
    lookupSessionStorage: "lng",
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,

    // cache user language on
    caches: ["localStorage", "cookie"],
    excludeCacheFor: ["cimode"], // languages to not persist (cookie, localStorage)

    // optional set cookie options, reference:[MDN Set-Cookie docs]
    cookieOptions: { path: "/", sameSite: "strict" },
    react: { useSuspense: true },
    backend: {
      loadPath: getCurrentHost,
    },
    ns: ["placeholders", "messages", "labels"],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
