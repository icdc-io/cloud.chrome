type BaseUrlsType = {
  [key: string]: string;
};

export const returnBaseUrl = (baseUrls: BaseUrlsType, currentLocation: string) => {
  return baseUrls[currentLocation]
    ? baseUrls[currentLocation].substr(baseUrls[currentLocation].indexOf('.') + 1)
    : '';
};
