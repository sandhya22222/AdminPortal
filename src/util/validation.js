const isAlpha = (value) => {
  const regexPattern = /^[a-zA-Z]*$/;
  if (regexPattern.test(value)) {
    return true;
  } else {
    return false;
  }
};

const isLocale = (value) => {
  const regexPattern = /^[a-zA-Z_]*$/;
  if (regexPattern.test(value)) {
    return true;
  } else {
    return false;
  }
};

const validator = {
  isAlpha,
  isLocale,
};

export default validator;
