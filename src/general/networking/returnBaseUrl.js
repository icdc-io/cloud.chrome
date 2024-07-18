export const returnBaseUrl = (baseUrls, currentLocation) => {
  return baseUrls[currentLocation]
    ? baseUrls[currentLocation].substr(
        baseUrls[currentLocation].indexOf(".") + 1,
      )
    : "";
};
