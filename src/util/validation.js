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

// validate only for number 0-9, only one dot(.) & not allowing more than 10 number
export const validatePositiveNumber = (e, regex) => {
  const key = e.keyCode || e.which;
  const keyChar = String.fromCharCode(key);
  // const regex = /[0-9]|\./;
  if (
    !regex.test(keyChar) ||
    e.target.value.length >= 10 ||
    (keyChar === "." && e.target.value.includes("."))
  ) {
    e.preventDefault();
  }
};

const validator = {
  isAlpha,
  isLocale,
};

export default validator;
