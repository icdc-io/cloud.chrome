export const getCurrentAppropriateLang = (lang) => {
  return (
    navigator.languages.find((browserLang) => browserLang.includes(lang)) ||
    lang
  );
};
