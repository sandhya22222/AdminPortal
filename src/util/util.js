import { toast } from "react-toastify";
// import CategoryTabData from "../constants/CategoryTabData";
// to get image URL using image path
const baseUrl = process.env.REACT_APP_BASE_URL;
const absoluteImageUrl = process.env.REACT_APP_ABSOLUTE_IMAGE_API;
const absoluteDocumentUrl = process.env.REACT_APP_ABSOLUTE_DOCUMENT_API;
const storeId = parseInt(process.env.REACT_APP_STORE_ID);

export const sortObjectArray = (prop, objectArray) => {
  prop = prop.split(".");
  var len = prop.length;

  objectArray.sort(function (a, b) {
    var i = 0;
    while (i < len) {
      a = a[prop[i]];
      b = b[prop[i]];
      i++;
    }
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      return 0;
    }
  });
  return objectArray;
};

export const sortObjectArrayByKey = (key, keyType, array, sortType) => {
  return array.sort(function (a, b) {
    var x, y;

    if (keyType === "number") {
      x = a[key];

      y = b[key];
    } else {
      x = a[key].toLowerCase();

      y = b[key].toLowerCase();
    }

    if (sortType === "desc") return x > y ? -1 : x < y ? 1 : 0;
    else return x < y ? -1 : x > y ? 1 : 0;
  });
};

export const isInteger = (value) => {
  return Number.isInteger(parseInt(value));
};
export const isFloating = (value) => {
  return !Number.isNaN(parseFloat(value));
};

export const getTitleForKeyFromArrayObject = (
  filterKey,
  filterKeyValue,
  titleKey,
  arrayObject
) => {
  try {
    const filteredData = arrayObject.filter(
      (element) => String(element[filterKey]) === String(filterKeyValue)
    );
    return filteredData.length > 0
      ? filteredData[0][titleKey]
      : "Not Available";
  } catch (error) {
    return "Not Supported";
  }
};

export const getProductTypeSupportedDataList = (productTypeData, ListData) => {
  if (productTypeData && productTypeData.length > 0) {
    const onlySupportedProductTypesData = productTypeData.filter(
      (element) => element.status !== "unsupported"
    );

    const filterLists = [];
    for (var i = 0; i < onlySupportedProductTypesData.length; i++) {
      for (var j = 0; j < ListData.length; j++) {
        if (
          onlySupportedProductTypesData[i].product_type_id ===
          ListData[j].product_type
        ) {
          filterLists.push(ListData[j]);
        }
      }
    }

    return filterLists;
  }
};
export const deepCopy = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.reduce((arr, item, i) => {
      arr[i] = deepCopy(item);
      return arr;
    }, []);
  }

  if (obj instanceof Object) {
    return Object.keys(obj).reduce((newObj, key) => {
      newObj[key] = deepCopy(obj[key]);
      return newObj;
    }, {});
  }
};

// function will validate the string value based on the different type of regex pattern
// Note: user has to pass the valid regex pattern to this function
export const testValueByRegexPattern = (regexPattern, StringValue) => {
  try {
    if (new RegExp(regexPattern).test(StringValue)) {
      return true;
    } else {
      return false;
    }
  } catch {
    toast(`Invalid regular expression :${regexPattern}`, {
      position: toast.POSITION.TOP_RIGHT,
      type: "error",
    });
  }
};

export const getImageUrl = (imagePath, actioType, fileType) => {
  var fileUrl = "";
  switch (fileType) {
    case "image":
      fileUrl = `${baseUrl}${absoluteImageUrl}?image_path=${imagePath}&store_id=${storeId}&image_type=${actioType}`;
      break;
    case "document":
      fileUrl = `${baseUrl}${absoluteDocumentUrl}?document_path=${imagePath}&store_id=${storeId}&document_type=${actioType}`;
      break;
    default:
      break;
  }
  return fileUrl;
};

export const generateObjectFromUrl = (url) => {
  //! example (haed-core method)
  //? const urlParams = new URLSearchParams(url);
  //? console.log(urlParams.has('product'));   // true
  //? const product = urlParams.get('image_path')  // hudwromgbkmf

  var queryString = url ? url.split("?")[1] : window.location.search.slice(1);
  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {
    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split("#")[0];

    // split our query string into its component parts
    var arr = queryString.split("&");

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split("=");

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof a[1] === "undefined" ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === "string") paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets,
      if (paramName.match(/\[(\d+)?\]$/)) {
        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, "");
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === "string") {
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  //! making object according to required structure
  //! for now (spporting- image and document)
  if (obj && Object.keys(obj).length > 0) {
    if (Object.keys(obj)[0] === "image_path") {
      // adding more key : pairs to object
      obj["status"] = "1";
      obj["specific_to"] = null;
      obj["visibility"] = null;
      obj["default_ar"] = null;
      obj["default_size_name"] = null;
    } else if (Object.keys(obj)[0] === "document_path") {
      obj["status"] = "1";
      obj["specific_to"] = null;
      obj["visibility"] = null;
    }
  }
  return obj;
};

// function will validate the Character Code to know, wheather it is a alphabet/special character or not
// if it is alphabet/special character, will return true.
// if it is number, will return false.
export const isAlphabetOrNot = (charCode) => {
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return true;
  } else {
    return false;
  }
};

// function will validate the Character Code to allow only alphabets to enter in textfield
// if it is number/special character it will return false
//  if it is alphabets it will return true
export const restrictNumbersAndSpecialCharacter = (charCode) => {
  if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123))
    return true;
  else {
    return false;
  }
};

//! This function filters the categorylists according to parentcategoryid which we are sent and it will return the data according to it
//? first parameter accepts the parentcategoryid which is integer value
//? second parameter accepts the categorylists which is array of objects
//! how to use
// import the function in component
// ie. import {filterCategoriesByParentCategoryId} from "../../util/util"; here path may vary according to component
// then const filterData=filterCategoriesByParentCategoryId(1,producttypelist);
// filterData variable will store all categories which are having parentcategory which we are send

export const filterCategoriesByParentCategoryId = (
  parentCategoryId,
  categoryList
) => {
  let filterParentCategory = [];
  if (parentCategoryId === null) {
    filterParentCategory = categoryList.filter(
      (ele) => ele.parent_category === null
    );
  } else {
    filterParentCategory = categoryList.filter(
      (ele) => ele.parent_category === parentCategoryId
    );
  }
  return filterParentCategory;
};

//! It is a recursive function it takes 4 parameters and it will return the children categories to parent category
//? first parameter accepts the parentcategoryId which is integer value
//? second parameter accepts the categoryLists which is array of objects
//? thrid parameter accepts the isButtonRequired which accepts boolean here if you send true it will return one extra
//? data which used for designing button in list categories for this only we are passing value true but in most of cases it is false only
//? fourth parameter accepts the producttype lists which is array of objects
//! How to use
// import the function in component
// ie. import {getChildrenForParentCategoryRecursiveFunction} from "../../util/util"; here path may vary according to component
// then const data=getChildrenForParentCategoryRecursiveFunction(1,lists,false,producttypelist);
// data variable will store the all children of particular parentcategoryid what we are send

export const getChildrenForParentCategoryRecursiveFunction = (
  parentcategoryId,
  categoryLists,
  isButtonRequired,
  productTypeList
) => {
  let parentChildrenData = [];
  if (categoryLists && categoryLists.length > 0) {
    const filterChildrenData = categoryLists.filter(
      (item) => item.parent_category === parentcategoryId
    );
    for (var j = 0; j < filterChildrenData.length; j++) {
      const categoryId = filterChildrenData[j].category_id;
      const storeproductTypeRevisionName =
        filterChildrenData[j].store_product_type_name;

      let Childrens = getChildrenForParentCategoryRecursiveFunction(
        categoryId,
        categoryLists,
        isButtonRequired,
        productTypeList
      );
      if (
        isButtonRequired === true &&
        filterChildrenData[j].category_status > 1 &&
        filterChildrenData[j].category_status !== 5
      ) {
        Childrens.push({
          key: filterChildrenData[j].category_id + filterChildrenData[j].name,
          id: filterChildrenData[j].category_id,
          btnname: filterChildrenData[j].name,
          button: true,
          parent_category: filterChildrenData[j].parent_category,
          revision_id: filterChildrenData[j].revision_id,
          store_product_type_revision:
            filterChildrenData[j].store_product_type_revision,
        });
      }
      if (Childrens.length > 0) {
        filterChildrenData[j]["children"] = Childrens;
      }

      filterChildrenData[j]["store_product_type_revision_name"] =
        storeproductTypeRevisionName;
      parentChildrenData.push(filterChildrenData[j]);
    }

    return parentChildrenData;
  } else {
    return [];
  }
};

//! It  takes 3 parameters and it will return the parent children categories list
//? first parameter accepts the categories lists
//? second parameter accepts the storeProductTypes lists
//? thrid parameter accepts the isButtonRequired which accepts boolean here if you send true it will return one extra
//? data which used for designing button in list categories for this only we are passing value true but in most of cases it is false only

//! How to use
// import the function in component
// ie. import {getParentChildrenCategories} from "../../util/util"; here path may vary according to component
// then const data=getParentChildrenCategories(lists,producttypelist,false);
// data variable will store the all children of particular parentcategoryid what we are send

export const getParentChildrenCategories = (
  categories,
  storeProductTypes,
  isButtonRequired,
  parentCategory
) => {
  console.log("categoriesinutil--->", categories);
  const parentChildrenData = [];
  if (categories && categories.length > 0) {
    const filterParentCatgeories = filterCategoriesByParentCategoryId(
      parentCategory,
      categories
    );
    for (var i = 0; i < filterParentCatgeories.length > 0; i++) {
      // let categoryData=filterParentCatgeories[i];
      const categoryId = filterParentCatgeories[i].category_id;
      const storeproductTypeRevisionName =
        filterParentCatgeories[i].store_product_type_name;

      let Children = getChildrenForParentCategoryRecursiveFunction(
        categoryId,
        categories,
        isButtonRequired,
        storeProductTypes
      );
      if (
        isButtonRequired === true &&
        filterParentCatgeories[i].category_status > 1 &&
        filterParentCatgeories[i].category_status !== 5
      ) {
        Children.push({
          key:
            filterParentCatgeories[i].category_id +
            filterParentCatgeories[i].name,
          id: filterParentCatgeories[i].category_id,
          btnname: filterParentCatgeories[i].name,
          button: true,
          parent_category: filterParentCatgeories[i].parent_category,
          revision_id: filterParentCatgeories[i].revision_id,
          store_product_type_revision:
            filterParentCatgeories[i].store_product_type_revision,
        });
      }
      if (Children.length > 0) {
        filterParentCatgeories[i]["children"] = Children;
      }

      filterParentCatgeories[i]["store_product_type_revision_name"] =
        storeproductTypeRevisionName;
      parentChildrenData.push(filterParentCatgeories[i]);
    }
    return parentChildrenData;
  } else {
    return [];
  }
};

//! It  takes 3 parameters and it will return the parent children categories list along with root data
//? first parameter accepts the categories lists
//? second parameter accepts the storeProductTypes lists
//? thrid parameter accepts the isButtonRequired which accepts boolean here if you send true it will return one extra
//? data which used for designing button in list categories for this only we are passing value true but in most of cases it is false only

//! How to use
// import the function in component
// ie. import {getParentChildrenData} from "../../util/util"; here path may vary according to component
// then const data=getParentChildrenData(lists,producttypelist,false);
// data variable will store the all children of particular parentcategoryid what we are send
export const getParentChildrenData = (
  dataProcessorData,
  storeProductTypes,
  isButtonRequired
) => {
  if (dataProcessorData && dataProcessorData.length > 0) {
    // if (dataProcessorData && dataProcessorData.length === 1) {
    if (dataProcessorData && dataProcessorData[0].children.length > 0) {
      let copyDataProcessorData = dataProcessorData;
      const categorylists = getParentChildrenCategories(
        dataProcessorData[0].children,
        storeProductTypes,
        isButtonRequired,
        dataProcessorData[0].value
      );
      copyDataProcessorData[0].children = categorylists;
      if (
        isButtonRequired === true &&
        dataProcessorData[0].category_status > 1 &&
        dataProcessorData[0].category_status !== 5
      ) {
        copyDataProcessorData.push({
          key: dataProcessorData[0].value + dataProcessorData[0].name,
          id: dataProcessorData[0].value,
          btnname: dataProcessorData[0].name,
          button: true,
          parent_category: dataProcessorData[0].parent_category,
          store_product_type_revision:
            dataProcessorData[0].store_product_type_revision,
          revision_id: dataProcessorData[0].revision_id,
        });
      }
      return copyDataProcessorData;
    } else {
      let copyDataProcessorData = dataProcessorData;
      if (
        isButtonRequired === true &&
        dataProcessorData[0].category_status > 1 &&
        dataProcessorData[0].category_status !== 5
      ) {
        copyDataProcessorData.push({
          key: dataProcessorData[0].value + dataProcessorData[0].name,
          id: dataProcessorData[0].value,
          btnname: dataProcessorData[0].name,
          button: true,
          parent_category: dataProcessorData[0].parent_category,
          store_product_type_revision:
            dataProcessorData[0].store_product_type_revision,
          revision_id: dataProcessorData[0].revision_id,
        });
      }
      return copyDataProcessorData;
    }
    // }
    // else if (dataProcessorData && dataProcessorData.length > 1) {
    //   const categorylists= getParentChildrenCategories(dataProcessorData,storeProductTypes,isButtonRequired,dataProcessorData[0].value);
    //   return categorylists;
    // }
  } else {
    return [];
  }
};

// to remove the url search params after login
export const removeUrlSearchData = () => {
  const url = new URL(window.location.href);
  url.search = '';
  const newUrl = url.toString();
  window.history.replaceState({}, document.title, newUrl);
}