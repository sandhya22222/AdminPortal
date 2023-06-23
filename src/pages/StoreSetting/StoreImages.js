import React, { useState, useEffect } from "react";
import {
  Typography,
  Upload,
  Layout,
  Modal,
  Radio,
  Button,
  Skeleton,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  UndoOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { makeHttpRequestForRefreshToken } from "../../util/unauthorizedControl";
import { fnAbsoluteStoreImageInfo } from "../../services/redux/actions/ActionStoreImages";
import useAuthorization from "../../hooks/useAuthorization";
import { TiDelete } from "react-icons/ti";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import "./StoreImages.css";
import util from "../../util/common";
const { Title } = Typography;
const { Content } = Layout;
const { Image } = Skeleton;

const storeBannerImageAPI = process.env.REACT_APP_STORE_BANNER_IMAGES_API;
const storeAbsoluteImgesAPI = process.env.REACT_APP_STORE_ABSOLUTE_IMAGES_API;
const storeDeleteImagesAPI = process.env.REACT_APP_STORE_DELETE_IMAGES_API;
const baseURL = process.env.REACT_APP_BASE_URL;

const StoreImages = ({
  title,
  type,
  isSingleUpload,
  storeId,
  imagesUpload,
  setImagesUpload,
  getImageData,
  validStoreLogo,
  setValiStoreLogo,
  InfoCircleText,
  bannerAbsoluteImage,
}) => {
  const authorizationHeader = useAuthorization();
  const dispatch = useDispatch();

  const absoluteStoreImageInfo = useSelector(
    (state) => state.reducerAbsoluteStoreImageInfo.absoluteStoreImageInfo
  );

  // In Get call response of absolute image
  // if(absoluteImageData && absoluteImageData.length>0){
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [imagePathShow, setImagePathShow] = useState();
  const [copyImagePath, setCopyImagePath] = useState();
  const [bannerImage, setBannerImage] = useState([]);
  const [allImageUrl, setAllImageUrl] = useState([]);
  const [bannerAbsoluteImagePath, setBannerAbsoluteImagePath] = useState([]);
  const [reset, setReset] = useState(false);
  const [deleteStoreImage, setDeleteStoreImage] = useState([]);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const handleChange = (e) => {
    setFileList(e.fileList);
    if (type === "store_logo") {
      if (e.fileList.length === 0) {
        let temp = imagesUpload.filter((e) => e.type !== "store_logo");
        setImagesUpload(temp);
      } else {
        let copyimageData = [...imagesUpload];
        copyimageData.push({ type: "store_logo", imageValue: e.file });
        setImagesUpload(copyimageData);
        setValiStoreLogo(false);
      }
    }
    if (type === "banner_images") {
      if (e.fileList.length === 0) {
        let temp = imagesUpload.filter((e) => e.type !== "banner_images");
        setImagesUpload(temp);
      } else {
        let copyimageData = [...imagesUpload];
        copyimageData.push({ type: "banner_images", imageValue: e.file });
        setImagesUpload(copyimageData);
      }
    }
    if (type === "search_logo") {
      if (e.fileList.length == 0) {
        let temp = imagesUpload.filter((e) => e.type !== "search_logo");
        setImagesUpload(temp);
      } else {
        let copyimageData = [...imagesUpload];
        copyimageData.push({ type: "search_logo", imageValue: e.file });
        setImagesUpload(copyimageData);
      }
    }
    if (type === "customer_logo") {
      if (e.fileList.length == 0) {
        let temp = imagesUpload.filter((e) => e.type !== "customer_logo");
        setImagesUpload(temp);
      } else {
        let copyimageData = [...imagesUpload];
        copyimageData.push({ type: "customer_logo", imageValue: e.file });
        setImagesUpload(copyimageData);
      }
    }
    if (type === "cart_logo") {
      if (e.fileList.length == 0) {
        let temp = imagesUpload.filter((e) => e.type !== "cart_logo");
        setImagesUpload(temp);
      } else {
        let copyimageData = [...imagesUpload];
        copyimageData.push({ type: "cart_logo", imageValue: e.file });
        setImagesUpload(copyimageData);
      }
    }
    if (type === "wishlist_logo") {
      if (e.fileList.length == 0) {
        let temp = imagesUpload.filter((e) => e.type !== "wishlist_logo");
        setImagesUpload(temp);
      } else {
        let copyimageData = [...imagesUpload];
        copyimageData.push({ type: "wishlist_logo", imageValue: e.file });
        setImagesUpload(copyimageData);
      }
    }
  };

  // const findAllWithoutPageStoreBannerImageApi = () => {
  //   // setIsLoading(true);
  //   // axios
  //   //   .get(storeBannerImageAPI, {
  //   //     params: {
  //   //       "store-id": storeId,
  //   //     },
  //   //     authorizationHeader,
  //   //   })
  //   MarketplaceServices.findAllWithoutPage(storeBannerImageAPI, {
  //     store_id: storeId,
  //   })
  //     .then(function (response) {
  //       console.log(
  //         "Server Response from getstoreBannerImageApi Function: ",
  //         response.data
  //       );
  //       setBannerAbsoluteImage(response.data);
  //       // setStoreData(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.log("Server error from getStoreApi Function ", error.response);
  //     });
  // };
  useEffect(() => {
    console.log("getImageData1234", getImageData);
    if (getImageData && getImageData !== undefined) {
      if (type === "store_logo") {
        let temp = getImageData && getImageData.store_logo_path;
        console.log("templogo", temp);
        if (temp !== null) {
          findAllWithoutPageStoreAbsoluteImagesApi(temp);
          // let mediaData = [...deleteStoreImage];
          // console.log("mediaData425", mediaData);
          // mediaData.push({ type: "store_logo", path: temp });
          // setDeleteStoreImage(mediaData);
        } else {
          setImagePathShow();
        }
      }
      if (type === "customer_logo") {
        let temp = getImageData && getImageData.customer_logo_path;
        if (temp !== null) {
          findAllWithoutPageStoreAbsoluteImagesApi(temp);
          // let mediaData = [...deleteStoreImage];
          // mediaData.push({ type: "customer_logo", path: temp });
          // setDeleteStoreImage(mediaData);
        } else {
          setImagePathShow();
        }
      }
      if (type === "cart_logo") {
        let temp = getImageData && getImageData.cart_logo_path;
        if (temp !== null) {
          findAllWithoutPageStoreAbsoluteImagesApi(temp);
          // let mediaData = [...deleteStoreImage];
          // console.log("mediaData123", mediaData);
          // mediaData.push({ type: "cart_logo", path: temp });
          // setDeleteStoreImage(mediaData);
        } else {
          setImagePathShow();
        }
      }
      if (type === "search_logo") {
        let temp = getImageData && getImageData.search_logo_path;
        if (temp !== null) {
          findAllWithoutPageStoreAbsoluteImagesApi(temp);
          // let mediaData = [...deleteStoreImage];
          // mediaData.push({ type: "search_logo", path: temp });
          // setDeleteStoreImage(mediaData);
        } else {
          setImagePathShow();
        }
      }
      if (type === "wishlist_logo") {
        let temp = getImageData && getImageData.wishlist_logo_path;
        if (temp !== null) {
          findAllWithoutPageStoreAbsoluteImagesApi(temp);
          // let mediaData = [...deleteStoreImage];
          // mediaData.push({ type: "wishlist_logo", path: temp });
          // setDeleteStoreImage(mediaData);
        } else {
          setImagePathShow();
        }
      }
    }
    if (type === "banner_images") {
      // findAllWithoutPageStoreBannerImageApi();
    }
  }, [getImageData]);

  useEffect(() => {
    setImagePathShow();
  }, []);

  useEffect(() => {
    if (bannerAbsoluteImage && bannerAbsoluteImage.length > 0) {
      for (var i = 0; i < bannerAbsoluteImage.length; i++) {
        console.log("bannerAbsoluteImagePath", bannerAbsoluteImagePath);
        if (type === "banner_images") {
          findAllWithoutPageStoreAbsoluteImagesApi(
            bannerAbsoluteImage[i].image_fullpath
            // util.getImageAbsolutePath(bannerAbsoluteImage[i].image_fullpath)
          );
        }
      }
    }
  }, [bannerAbsoluteImage]);

  const getBase64 = (file) => {
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const findAllWithoutPageStoreAbsoluteImagesApi = (imagePath) => {
    let url = baseURL + "/" + imagePath;
    let temp = allImageUrl;
    temp.push(url);
    if (absoluteStoreImageInfo && absoluteStoreImageInfo.length > 0) {
      let imageData = [...absoluteStoreImageInfo];
      let imageType = { type: type, value: url };
      imageData.push(imageType);
      dispatch(fnAbsoluteStoreImageInfo(ImageData));
    } else {
      let imageType = { type: type, value: url };
      dispatch(fnAbsoluteStoreImageInfo(imageType));
    }
    console.log("tempoTest#", temp);
    setAllImageUrl(temp);
    setImagePathShow(url);
    setCopyImagePath(url);
    // console.log("imagePath1234", imagePath);
    // axios
    //   .get(
    //     storeAbsoluteImgesAPI,
    //     {
    //       params: {
    //         store_id: storeId,
    //         "image-path": imagePath,
    //         "image-type": type,
    //       },
    //       responseType: "blob",
    //     },
    //     authorizationHeader
    //   )
    //   // MarketplaceServices.findMedia(
    //   //   storeBannerImageAPI,
    //   //   {
    //   //     "store-id": storeId,
    //   //     "image-path": imagePath,
    //   //     "image-type": type,
    //   //   }
    //   // )
    //   .then(function (response) {
    //     console.log(
    //       "Get response of Store setting absolute Images--->",
    //       response.data
    //     );
    //     // if (type === "banner_images") {
    //     //   console.log("first");
    //     //   let temp = [...bannerImage];
    //     //   const url = URL.createObjectURL(response.data);
    //     //   temp.push(url);
    //     //   setBannerImage(temp);
    //     // } else {
    //     //   const url = URL.createObjectURL(response.data);
    //     //   console.log("image-url", url);
    //     //   setImagePathShow(url);
    //     //   setCopyImagePath(url);
    //     // }

    //     const url = URL.createObjectURL(response.data);
    //     console.log("image-url", url);
    //     let temp = allImageUrl;
    //     temp.push(url);
    //     if (absoluteStoreImageInfo && absoluteStoreImageInfo.length > 0) {
    //       let imageData = [...absoluteStoreImageInfo];
    //       let imageType = { type: type, value: url };
    //       imageData.push(imageType);
    //       dispatch(fnAbsoluteStoreImageInfo(ImageData));
    //     } else {
    //       let imageType = { type: type, value: url };
    //       dispatch(fnAbsoluteStoreImageInfo(imageType));
    //     }
    //     // const imageData = absoluteStoreImageInfo;
    //     // let image = allImageUrl
    //     // image.push(imageData)
    //     // console.log("imageData", imageData);
    //     // if (imageData !== undefined) {
    //     //   imageData.push(temp);
    //     //   dispatch(fnAbsoluteStoreImageInfo(imageData));
    //     // } else {
    //     //   dispatch(fnAbsoluteStoreImageInfo(temp));
    //     // }
    //     // dispatch(fnAbsoluteStoreImageInfo(temp));
    //     console.log("tempoTest#", temp);
    //     setAllImageUrl(temp);
    //     setImagePathShow(url);
    //     setCopyImagePath(url);
    //   })
    //   .catch((error) => {
    //     console.log("errorresponse from images--->", error.response);
    //     setImagePathShow();
    //   });
  };

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.thumbUrl && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.thumbUrl || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  //!delete function of language
  const removeMedia = (index) => {
    console.log("index", index);
    let dataObject = {};
    dataObject["store_id"] = storeId;
    dataObject["image-type"] = type;
    if (type === "banner_images") {
      let temp = bannerAbsoluteImage[index];
      console.log("tempbannerAbsoluteImage", temp);
      dataObject["image-path"] = temp.path;
    } else {
      dataObject["image-path"] = getImageData[type];
    }
    MarketplaceServices.remove(storeDeleteImagesAPI, dataObject)
      .then((response) => {
        console.log("response from delete===>", response);
        if (response.status === 200 || response.status === 201) {
          // setIsDeleteLanguageModalOpen(false);
          // let removedData = languageData.filter(
          //   ({ id }) => id !== deleteLanguageID
          // );
          // setLanguageData(removedData);
          toast(`${response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
          });
        }
        // disabling spinner
        // setIslanguageDeleting(false);
      })
      .catch((error) => {
        // disabling spinner
        // setIslanguageDeleting(false);
        toast(`${error.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
        });
      });
  };

  console.log("copyImagePath", allImageUrl);
  return (
    <Content className=" mb-2">
      <Content className="flex !mb-3">
        {/* {title === "Store Logo" ? (
          <span className="text-red-600 text-sm text-center ">*</span>
        ) : null} */}
        <Title level={5} className="mr-1">
          {title}
        </Title>
        <Content className=" items-end  ">
          <Tooltip title={InfoCircleText} className="">
            <InfoCircleOutlined className="text-sky-600" />
          </Tooltip>
        </Content>
        {reset === true ? (
          <Content>
            <Tooltip title="Reset to the previous image">
              <UndoOutlined
                className="ml-4  !text-lg text-blue-600"
                onClick={() => {
                  setImagePathShow(copyImagePath);
                }}
              />
            </Tooltip>
          </Content>
        ) : null}
      </Content>
      {imagePathShow === undefined ? (
        <Content>
          {isSingleUpload && isSingleUpload === true ? (
            <>
              <Upload
                className={`${
                  validStoreLogo
                    ? "!border-red-400 !border-2 focus:border-red-400 hover:border-red-400 !h-[105px] !w-[105px] rounded-lg"
                    : ""
                }`}
                listType="picture-card"
                fileList={fileList}
                name="file"
                onPreview={handlePreview}
                onChange={(e) => handleChange(e)}
                beforeUpload={() => {
                  return false;
                }}
                afterUpload={() => {
                  return false;
                }}
                accept=".png, .jpg, .jpeg"
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
              {/* <Modal
                open={previewOpen}
                // title={previewTitle}
                visible={previewOpen}
                footer={null}
                onCancel={handleCancel}
              >
                <img
                  alt="previewImage"
                  style={{
                    width: "100%",
                  }}
                  src={previewImage}
                />
              </Modal> */}
            </>
          ) : (
            <Upload
              className="w-90"
              listType="picture"
              beforeUpload={() => {
                return false;
              }}
              afterUpload={() => {
                return false;
              }}
              fileList={fileList}
              onPreview={handlePreview}
              accept=".png, .jpg, .jpeg"
              onChange={(e) => handleChange(e)}
            >
              <Button icon={<UploadOutlined />} className="font-semibold">
                Click to Add Banner Image
              </Button>
            </Upload>
          )}
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img
              alt="previewImage"
              style={{
                width: "100%",
              }}
              src={previewImage}
            />
          </Modal>
        </Content>
      ) : (
        <>
          <Content className=" flex !space-x-10">
            {allImageUrl &&
              allImageUrl.length > 0 &&
              allImageUrl.map((ele, index) => {
                return (
                  <div className="!relative">
                    <img src={ele} className="!w-24 !h-26" />
                    <TiDelete
                      className="!absolute !cursor-pointer !right-[-5px] !z-5  !top-[-10px] !text-2xl !text-red-600 !shadow-lg  hover:translate-"
                      onClick={() => {
                        if (type === "banner_images") {
                          removeMedia(index);

                          let temp = allImageUrl.filter((item) => item !== ele);
                          if (temp && temp.length > 0) {
                            setAllImageUrl(temp);
                          } else {
                            setAllImageUrl([]);
                            setImagePathShow();
                          }
                        } else {
                          setImagePathShow();
                          setReset(true);
                          removeMedia();
                        }
                      }}
                    />
                  </div>
                );
              })}
          </Content>
          <Content className="!mt-4">
            {type === "banner_images" ? (
              <Upload
                className="w-90"
                listType="picture"
                beforeUpload={() => {
                  return false;
                }}
                afterUpload={() => {
                  return false;
                }}
                fileList={fileList}
                accept=".png, .jpg, .jpeg"
                onChange={(e) => handleChange(e)}
              >
                <Button icon={<UploadOutlined />} className="font-semibold">
                  Click to Add Banner Image
                </Button>
              </Upload>
            ) : null}
          </Content>
        </>
      )}
    </Content>
  );
};

export default StoreImages;
