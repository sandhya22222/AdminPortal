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
import { makeHttpRequestForRefreshToken } from "../../util/unauthorizedControl";
import useAuthorization from "../../hooks/useAuthorization";
import { TiDelete } from "react-icons/ti";

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

  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [imagePathShow, setImagePathShow] = useState();
  const [copyImagePath, setCopyImagePath] = useState();
  const [bannerAbsoluteImage, setBannerAbsoluteImage] = useState([]);
  const [bannerImage, setBannerImage] = useState([]);
  const [allImageUrl, setAllImageUrl] = useState([]);
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
    console.log("test", e.fileList);

    if (type === "store_logo") {
      let copyimageData = [...imagesUpload];
      copyimageData.push({ type: "store_logo", imageValue: e.file });
      console.log("copyimageData", copyimageData);
      setImagesUpload(copyimageData);
      setValiStoreLogo(false);
    }
    if (type === "banner_images") {
      let copyimageData = [...imagesUpload];
      copyimageData.push({ type: "banner_images", imageValue: e.file });
      setImagesUpload(copyimageData);
    }
    if (type === "search_logo") {
      let copyimageData = [...imagesUpload];
      copyimageData.push({ type: "search_logo", imageValue: e.file });
      setImagesUpload(copyimageData);
    }
    if (type === "customer_logo") {
      let copyimageData = [...imagesUpload];
      copyimageData.push({ type: "customer_logo", imageValue: e.file });
      setImagesUpload(copyimageData);
    }
    if (type === "cart_logo") {
      let copyimageData = [...imagesUpload];
      copyimageData.push({ type: "cart_logo", imageValue: e.file });
      setImagesUpload(copyimageData);
    }
    if (type === "wishlist_logo") {
      let copyimageData = [...imagesUpload];
      copyimageData.push({ type: "wishlist_logo", imageValue: e.file });
      setImagesUpload(copyimageData);
    }
  };

  const getstoreBannerImageApi = () => {
    // setIsLoading(true);
    axios
      .get(storeBannerImageAPI, {
        params: {
          "store-id": storeId,
        },
        authorizationHeader,
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
        if (error && error.response && error.response.status === 401) {
          makeHttpRequestForRefreshToken();
          // setErrorMessage(error.response)
        }
      });
  };

  useEffect(() => {
    if (type === "store_logo") {
      let temp = getImageData && getImageData.store_logo;
      if (temp !== null) {
        getStoreAbsoluteImagesApi(temp);
      } else {
        setImagePathShow();
      }
    }
    if (type === "banner_images") {
      getstoreBannerImageApi();
    }
    if (type === "customer_logo") {
      let temp = getImageData && getImageData.customer_logo;
      if (temp !== null) {
        getStoreAbsoluteImagesApi(temp);
      } else {
        setImagePathShow();
      }
    }
    if (type === "cart_logo") {
      let temp = getImageData && getImageData.cart_logo;
      if (temp !== null) {
        getStoreAbsoluteImagesApi(temp);
      } else {
        setImagePathShow();
      }
    }
    if (type === "search_logo") {
      let temp = getImageData && getImageData.search_logo;
      if (temp !== null) {
        getStoreAbsoluteImagesApi(temp);
      } else {
        setImagePathShow();
      }
    }
    if (type === "wishlist_logo") {
      let temp = getImageData && getImageData.wishlist_logo;
      if (temp !== null) {
        getStoreAbsoluteImagesApi(temp);
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
          getStoreAbsoluteImagesApi(bannerAbsoluteImage[i].path);
        }
      }
    }
  }, [bannerAbsoluteImage]);

  console.log("getImageData", getImageData && getImageData.banner_logo);

  const getBase64 = (file) => {
    console.log("file", file);
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const getStoreAbsoluteImagesApi = (imagePath) => {
    console.log("imagePath", imagePath);
    axios
      .get(
        storeAbsoluteImgesAPI,
        {
          params: {
            "store-id": storeId,
            "image-type": type,
            "image-path": imagePath,
          },
          responseType: "blob",
        },
        authorizationHeader
      )
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
        setAllImageUrl(temp);
        setImagePathShow(url);
        setCopyImagePath(url);
      })
      .catch((error) => {
        console.log("errorresponse from images--->", error.response);
        if (error && error.response && error.response.status === 401) {
          makeHttpRequestForRefreshToken();
        }
        setImagePathShow();
      });
  };
  console.log("bannerImage", bannerImage);
  console.log("imagepath123", copyImagePath);
  console.log("allImageUrl", allImageUrl);
  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
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
        {title === "Store Logo" ? (
          <span className="text-red-600 text-sm text-center ">*</span>
        ) : null}
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
              allImageUrl.map((ele) => {
                return (
                  <>
                    <img src={ele} className="!w-24 !h-26" />
                    <TiDelete
                      className="!absolute !cursor-pointer !right-[-5px] !z-10  !top-[32px] !text-2xl !text-red-600 !shadow-lg  hover:translate-"
                      //   twoToneColor= {"#eb2f96"}
                      onClick={() => {
                        setImagePathShow();
                        setReset(true);
                      }}
                    />
                  </>
                );
              })}
          </Content>
        </>
      )}
    </Content>
  );
};

export default StoreImages;
