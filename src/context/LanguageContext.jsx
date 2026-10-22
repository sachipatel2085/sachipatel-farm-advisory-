import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../locales/en.js";
import hi from "../locales/hi.js";
import gu from "../locales/gu.js";
import mr from "../locales/mr.js";

const dictionaries = { en, hi, gu, mr };

export const LanguageContext = createContext();

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", nativeName: "English" },
  { code: "hi", label: "Hindi", nativeName: "हिंदी" },
  { code: "gu", label: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "mr", label: "Marathi", nativeName: "मराठी" },
];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("farm_language") || "en";
  });

  const setLanguage = (langCode) => {
    if (dictionaries[langCode]) {
      localStorage.setItem("farm_language", langCode);
      setLanguageState(langCode);
    }
  };

  /**
   * Translate a dotted key path like `nav.dashboard`
   */
  const t = (keyPath, fallback = "") => {
    if (!keyPath) return fallback;
    const parts = keyPath.split(".");

    // Try current language dictionary
    let cur = dictionaries[language];
    let found = true;
    for (const p of parts) {
      if (cur && cur[p] !== undefined) {
        cur = cur[p];
      } else {
        found = false;
        break;
      }
    }

    if (found && typeof cur === "string") return cur;

    // Fallback to English dictionary
    let enCur = dictionaries["en"];
    let enFound = true;
    for (const p of parts) {
      if (enCur && enCur[p] !== undefined) {
        enCur = enCur[p];
      } else {
        enFound = false;
        break;
      }
    }

    if (enFound && typeof enCur === "string") return enCur;

    return fallback || parts[parts.length - 1];
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "en",
      setLanguage: () => {},
      t: (k, fb) => fb || k,
      languages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
};

export default LanguageContext;
