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
import StoreModal from "../../components/storeModal/StoreModal";
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
const BannerImagesUploadLength = process.env.REACT_APP_BANNER_IMAGES_MAX_LENGTH;
const supportedFileExtensions = process.env.REACT_APP_IMAGES_EXTENSIONS;

const StoreImages = ({
  title,
  type,
  isSingleUpload,
  storeId,
  imagesUpload,
  setImagesUpload,
  getImageData,
  validStoreLogo,
  InfoCircleText,
  bannerAbsoluteImage,
  setImageChangeValues,
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
  const [allImageUrl, setAllImageUrl] = useState([]);
  const [reset, setReset] = useState(false);
  const [imageIndex, setImageIndex] = useState();
  const [imageElement, setImageElement] = useState();
  const [isImageDeleting, setIsImageDeleting] = useState(false);
  const [isDeleteImageModalOpen, setIsDeleteImageModalOpen] = useState(false);
  const [bannerImagesLength, setBannerImagesLength] = useState(0);
  var selectedImageArrayOfObject = [];

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
    // debugger;
    setImageChangeValues(true);
    setFileList(e.fileList);
    if (type === "store_logo") {
      if (e.fileList.length === 0) {
        let temp = imagesUpload.filter((e) => e.type !== "store_logo");
        setImagesUpload(temp);
      } else {
        let copyImageData = [...imagesUpload];
        copyImageData.push({ type: "store_logo", imageValue: e.file });
        setImagesUpload(copyImageData);
      }
    }
    if (type === "banner_images") {
      selectedImageArrayOfObject.push(e.file);
      setBannerImagesLength(
        parseInt(allImageUrl && allImageUrl.length) +
          parseInt(e && e.fileList && e.fileList.length)
      );
      var sampleBannerImagesLength =
        parseInt(allImageUrl && allImageUrl.length) +
        parseInt(e && e.fileList && e.fileList.length);
      console.log("sampleBannerImagesLength", sampleBannerImagesLength);
      // if (sampleBannerImagesLength <= BannerImagesUploadLength) {

      if (e.fileList.length === 0) {
        let temp = imagesUpload.filter((e) => e.type !== "banner_images");
        setImagesUpload(temp);
      } else {
        let totalSelectLength = e.fileList.length;
        if (sampleBannerImagesLength > BannerImagesUploadLength) {
          let imagesUploadLength =
            sampleBannerImagesLength - BannerImagesUploadLength;
          let imagesSelect = sampleBannerImagesLength - imagesUploadLength;
          totalSelectLength = imagesSelect - allImageUrl.length;
          e.fileList.splice(totalSelectLength); // Limit the fileList to eight files
        }
        let copyImageData = [...imagesUpload];
        selectedImageArrayOfObject.splice(totalSelectLength);
        copyImageData.push({
          type: "banner_images",
          imageValue: selectedImageArrayOfObject,
        });
        setImagesUpload(copyImageData);
      }
      // }
    }
    if (type === "search_logo") {
      if (e.fileList.length == 0) {
        let temp = imagesUpload.filter((e) => e.type !== "search_logo");
        setImagesUpload(temp);
      } else {
        let copyImageData = [...imagesUpload];
        copyImageData.push({ type: "search_logo", imageValue: e.file });
        setImagesUpload(copyImageData);
      }
    }
    if (type === "customer_logo") {
      if (e.fileList.length == 0) {
        let temp = imagesUpload.filter((e) => e.type !== "customer_logo");
        setImagesUpload(temp);
      } else {
        let copyImageData = [...imagesUpload];
        copyImageData.push({ type: "customer_logo", imageValue: e.file });
        setImagesUpload(copyImageData);
      }
    }
    if (type === "cart_logo") {
      if (e.fileList.length == 0) {
        let temp = imagesUpload.filter((e) => e.type !== "cart_logo");
        setImagesUpload(temp);
      } else {
        let copyImageData = [...imagesUpload];
        copyImageData.push({ type: "cart_logo", imageValue: e.file });
        setImagesUpload(copyImageData);
      }
    }
    if (type === "wishlist_logo") {
      if (e.fileList.length == 0) {
        let temp = imagesUpload.filter((e) => e.type !== "wishlist_logo");
        setImagesUpload(temp);
      } else {
        let copyImageData = [...imagesUpload];
        copyImageData.push({ type: "wishlist_logo", imageValue: e.file });
        setImagesUpload(copyImageData);
      }
    }
  };

  useEffect(() => {
    console.log("getImageData1234", getImageData);
    if (getImageData && getImageData !== undefined) {
      if (type === "store_logo") {
        let temp = getImageData && getImageData.store_logo_path;
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
    selectedImageArrayOfObject = [];
  }, [getImageData]);

  useEffect(() => {
    setImagePathShow();
  }, []);

  useEffect(() => {
    if (bannerAbsoluteImage && bannerAbsoluteImage.length > 0) {
      let temp = [];
      for (var i = 0; i < bannerAbsoluteImage.length; i++) {
        if (type === "banner_images") {
          temp.push(baseURL + bannerAbsoluteImage[i].image_fullpath);
        }
      }
      setAllImageUrl(temp);
      setImagePathShow(temp);
    }
  }, [bannerAbsoluteImage]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

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

  const findAllWithoutPageStoreAbsoluteImagesApi = (imagePath) => {
    let url = baseURL + imagePath;
    let temp = [];
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
    setAllImageUrl(temp);
    setImagePathShow(url);
    setCopyImagePath(url);
  };

  // closing the delete popup model
  const closeDeleteModal = () => {
    setIsDeleteImageModalOpen(false);
  };

  // opening the delete popup model
  const openDeleteModal = (id) => {
    setIsDeleteImageModalOpen(true);
    // setDeleteLanguageID(id);
  };

  //!delete function of language
  const removeMedia = (index) => {
    setIsImageDeleting(true);
    console.log("index", index);
    let dataObject = {};
    dataObject["store_id"] = storeId;
    dataObject["image-type"] = type;
    if (type === "banner_images") {
      let temp = bannerAbsoluteImage[imageIndex];
      dataObject["image-path"] = temp.path;
    } else {
      dataObject["image-path"] = getImageData[type];
    }
    MarketplaceServices.remove(storeDeleteImagesAPI, dataObject)
      .then((response) => {
        console.log("response from delete===>", response);
        if (response.status === 200 || response.status === 201) {
          toast(`${response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
            autoClose: 10000,
          });
        }
        if (type === "banner_images") {
          //remove from setBannerAbsoluteImage
          bannerAbsoluteImage.splice(imageIndex, 1);

          setBannerImagesLength(bannerImagesLength - 1);

          let temp = allImageUrl.filter((item) => item !== imageElement);
          if (temp && temp.length > 0) {
            setAllImageUrl(temp);
          } else {
            setAllImageUrl([]);
            setImagePathShow();
          }
        } else {
          setImagePathShow();
          setReset(true);
        }
        setIsDeleteImageModalOpen(false);
        // disabling spinner
        setIsImageDeleting(false);
      })
      .catch((error) => {
        // disabling spinner
        setIsImageDeleting(false);
        if (error && error.response && error.response.status === 401) {
          toast("Session expired", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        } else {
          toast(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        }
      });
  };

  useEffect(() => {
    if (imagesUpload && imagesUpload.length === 0) {
      setFileList([]);
    }
  }, [imagesUpload]);

  useEffect(() => {
    setBannerImagesLength(bannerAbsoluteImage && bannerAbsoluteImage.length);
  }, [bannerAbsoluteImage]);
  console.log("bannerImagesLength", bannerImagesLength);
  return (
    <Content className=" mb-2">
      <StoreModal
        isVisible={isDeleteImageModalOpen}
        okButtonText={"Yes"}
        cancelButtonText={"Cancel"}
        title={"Warning"}
        okCallback={() => removeMedia()}
        cancelCallback={() => closeDeleteModal()}
        isSpin={isImageDeleting}
        hideCloseButton={false}
      >
        {
          <div>
            <p>{`Confirm image Deletion`}</p>
            <p>{`Are you absolutely sure you want to delete the image? This action cannot be undone.`}</p>
          </div>
        }
      </StoreModal>
      <Content className="flex !mb-3">
        <Title level={5} className="mr-1">
          {title}
        </Title>
        <Content className=" items-end  ">
          <Tooltip title={InfoCircleText} className="">
            <InfoCircleOutlined className="!text-[var(--mp-brand-color-h)]" />
          </Tooltip>
        </Content>
        {/* {reset === true ? (
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
        ) : null} */}
      </Content>
      {imagePathShow === undefined ? (
        <Content>
          {isSingleUpload && isSingleUpload === true ? (
            <>
              <Upload
                className={`${
                  validStoreLogo
                    ? "!border-red-400 !border-2 focus:border-red-400 hover:border-red-400 !h-[105px] !w-[105px] rounded-lg"
                    : "hover:border-[var(--mp-primary-border-color)] hover:text-[var(--mp-brand-color-h)]"
                }`}
                listType="picture-card"
                fileList={fileList}
                name="file"
                onPreview={handlePreview}
                onChange={(e) => {
                  handleChange(e);
                }}
                beforeUpload={() => {
                  return false;
                }}
                afterUpload={() => {
                  return false;
                }}
                accept={supportedFileExtensions}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
              {/* <Modal
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
              </Modal> */}
            </>
          ) : (
            <Upload
              maxCount={BannerImagesUploadLength}
              className="w-90 ant-btn-default"
              listType="picture"
              multiple={true}
              beforeUpload={() => {
                return false;
              }}
              afterUpload={() => {
                return false;
              }}
              fileList={fileList}
              onPreview={handlePreview}
              accept={supportedFileExtensions}
              onChange={(e) => {
                handleChange(e);
                setImageChangeValues(true);
              }}
              openFileDialogOnClick={
                bannerImagesLength < BannerImagesUploadLength ? true : false
              }
            >
              <Button
                disabled={
                  bannerImagesLength < BannerImagesUploadLength ? false : true
                }
                icon={<UploadOutlined />}
                className="font-semibold"
              >
                Click to Add Banner Image (Max: {BannerImagesUploadLength})
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
                        setIsDeleteImageModalOpen(true);
                        setImageIndex(index);
                        setImageElement(ele);
                      }}
                    />
                  </div>
                );
              })}
          </Content>
          <Content className="!mt-4">
            {type === "banner_images" ? (
              <>
                <Upload
                  maxCount={BannerImagesUploadLength}
                  multiple={true}
                  className="w-90"
                  listType="picture"
                  onPreview={handlePreview}
                  beforeUpload={() => {
                    return false;
                  }}
                  afterUpload={() => {
                    return false;
                  }}
                  fileList={fileList}
                  accept={supportedFileExtensions}
                  onChange={(e) => {
                    handleChange(e);
                    setImageChangeValues(true);
                  }}
                  openFileDialogOnClick={
                    bannerImagesLength < BannerImagesUploadLength ? true : false
                  }
                >
                  <Button
                    disabled={
                      bannerImagesLength < BannerImagesUploadLength
                        ? false
                        : true
                    }
                    icon={<UploadOutlined />}
                    className="font-semibold"
                  >
                    Click to Add Banner Image (Max: {BannerImagesUploadLength})
                  </Button>
                </Upload>
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
              </>
            ) : null}
          </Content>
        </>
      )}
    </Content>
  );
};

export default StoreImages;
