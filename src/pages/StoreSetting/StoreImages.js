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
import util from "../../util/common";
const { Title } = Typography;
const { Content } = Layout;
const { Image } = Skeleton;

const storeBannerImageAPI = process.env.REACT_APP_STORE_BANNER_IMAGES_API;
const storeAbsoluteImgesAPI = process.env.REACT_APP_STORE_ABSOLUTE_IMAGES_API;

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
  const [bannerAbsoluteImage, setBannerAbsoluteImage] = useState([]);
  const [bannerImage, setBannerImage] = useState([]);
  const [allImageUrl, setAllImageUrl] = useState([]);
  const [bannerAbsoluteImagePath, setBannerAbsoluteImagePath] = useState([]);
  const [reset, setReset] = useState(false);
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

  const findAllWithoutPageStoreBannerImageApi = () => {
    // setIsLoading(true);
    // axios
    //   .get(storeBannerImageAPI, {
    //     params: {
    //       "store-id": storeId,
    //     },
    //     authorizationHeader,
    //   })
    MarketplaceServices.findAllWithoutPage(storeBannerImageAPI, {
      "store-id": storeId,
    })
      .then(function (response) {
        console.log(
          "Server Response from getstoreBannerImageApi Function: ",
          response.data
        );
        setBannerAbsoluteImage(response.data);
        // setStoreData(response.data.data);
      })
      .catch((error) => {
        console.log("Server error from getStoreApi Function ", error.response);
      });
  };

  useEffect(() => {
    if (type === "store_logo") {
      let temp = getImageData && getImageData.store_logo;
      if (temp !== null) {
        findAllWithoutPageStoreAbsoluteImagesApi(temp);
      } else {
        setImagePathShow();
      }
    }
    if (type === "banner_images") {
      findAllWithoutPageStoreBannerImageApi();
    }
    if (type === "customer_logo") {
      let temp = getImageData && getImageData.customer_logo;
      if (temp !== null) {
        findAllWithoutPageStoreAbsoluteImagesApi(temp);
      } else {
        setImagePathShow();
      }
    }
    if (type === "cart_logo") {
      let temp = getImageData && getImageData.cart_logo;
      if (temp !== null) {
        findAllWithoutPageStoreAbsoluteImagesApi(temp);
      } else {
        setImagePathShow();
      }
    }
    if (type === "search_logo") {
      let temp = getImageData && getImageData.search_logo;
      if (temp !== null) {
        findAllWithoutPageStoreAbsoluteImagesApi(temp);
      } else {
        setImagePathShow();
      }
    }
    if (type === "wishlist_logo") {
      let temp = getImageData && getImageData.wishlist_logo;
      if (temp !== null) {
        findAllWithoutPageStoreAbsoluteImagesApi(temp);
      } else {
        setImagePathShow();
      }
    }
  }, [getImageData]);

  useEffect(() => {
    setImagePathShow();
  }, []);

  useEffect(() => {
    if (bannerAbsoluteImage && bannerAbsoluteImage.length > 0) {
      for (var i = 0; i < bannerAbsoluteImage.length; i++) {
        if (type === "banner_images") {
          findAllWithoutPageStoreAbsoluteImagesApi(
            bannerAbsoluteImage[i].path
            // util.getImageAbsolutePath(bannerAbsoluteImage[i].image_fullpath)
          );
        }
      }
    }
  }, [bannerAbsoluteImage]);

  console.log("getImageData", getImageData);

  const getBase64 = (file) => {
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const findAllWithoutPageStoreAbsoluteImagesApi = (imagePath) => {
    console.log("imagePath1234", imagePath);
    axios
      .get(
        storeAbsoluteImgesAPI,
        {
          params: {
            "store-id": storeId,
            "image-path": imagePath,
            "image-type": type,
          },
          responseType: "blob",
        },
        authorizationHeader
      )
      // MarketplaceServices.findMedia(
      //   storeBannerImageAPI,
      //   {
      //     "store-id": storeId,
      //     "image-path": imagePath,
      //     "image-type": type,
      //   }
      // )
      .then(function (response) {
        console.log(
          "Get response of Store setting absolute Images--->",
          response.data
        );
        // if (type === "banner_images") {
        //   console.log("first");
        //   let temp = [...bannerImage];
        //   const url = URL.createObjectURL(response.data);
        //   temp.push(url);
        //   setBannerImage(temp);
        // } else {
        //   const url = URL.createObjectURL(response.data);
        //   console.log("image-url", url);
        //   setImagePathShow(url);
        //   setCopyImagePath(url);
        // }

        const url = URL.createObjectURL(response.data);
        console.log("image-url", url);
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
        // const imageData = absoluteStoreImageInfo;
        // let image = allImageUrl
        // image.push(imageData)
        // console.log("imageData", imageData);
        // if (imageData !== undefined) {
        //   imageData.push(temp);
        //   dispatch(fnAbsoluteStoreImageInfo(imageData));
        // } else {
        //   dispatch(fnAbsoluteStoreImageInfo(temp));
        // }
        // dispatch(fnAbsoluteStoreImageInfo(temp));
        console.log("tempoTest#", temp);
        setAllImageUrl(temp);
        setImagePathShow(url);
        setCopyImagePath(url);
      })
      .catch((error) => {
        console.log("errorresponse from images--->", error.response);
        setImagePathShow();
      });
  };

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    console.log("first",file)
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

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
          <InfoCircleOutlined
            // style={{
            //   color: "rgba(0,0,0,.45)",
            // }}
            className="text-sky-600"
          />
        </Content>
        {reset === true ? (
          <Content>
            <Tooltip title="Reset to previous image">
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
      {/* <Content>
        <Button
          className="float-right mb-1 ml-2"
          onClick={() => {
            setImagePathShow(copyImagePath);
          }}
        >
          Reset
        </Button>
      </Content> */}
      {imagePathShow === undefined ? (
        <Content>
          {isSingleUpload && isSingleUpload === true ? (
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
          ) : (
            // <Upload
            //   listType="picture-card"
            //   fileList={fileList}
            //   onPreview={handlePreview}
            //   onChange={(e) => handleChange(e)}
            //   name="file"
            //   beforeUpload={() => {
            //     return false;
            //   }}
            //   afterUpload={() => {
            //     return false;
            //   }}
            //   accept=".png, .jpg, .jpeg"
            // >
            //   {uploadButton}
            // </Upload>
            <Upload
              className="w-90"
              // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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
              // defaultFileList={[...fileList]}
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
              alt={imagePathShow}
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
                          let temp = allImageUrl.filter((item) => item !== ele);
                          console.log("allImageUrltemp", temp);
                          if (temp && temp.length > 0) {
                            setAllImageUrl(temp);
                          } else {
                            setAllImageUrl([]);
                            setImagePathShow();
                            // setReset(true);
                          }
                        } else {
                          setImagePathShow();
                          setReset(true);
                        }
                      }}
                    />
                  </div>
                );
              })}
          </Content>
        </>
      )}
    </Content>
  );
};

export default StoreImages;
