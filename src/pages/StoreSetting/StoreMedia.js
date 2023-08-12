import React, { useEffect, useState } from "react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Modal, Upload, Layout, Typography, Button } from "antd";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { TiDelete } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { fnAbsoluteStoreImageInfo } from "../../services/redux/actions/ActionStoreImages";
import StoreModal from "../../components/storeModal/StoreModal";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import { UploadFile } from "antd/es/upload/interface";

const { Content } = Layout;
const { Title } = Typography;

const storeImagesAPI = process.env.REACT_APP_STORE_IMAGES_API;
const storeDeleteImagesAPI = process.env.REACT_APP_STORE_DELETE_IMAGES_API;
const bannerImagesLength = process.env.REACT_APP_BANNER_IMAGES_MAX_LENGTH;
const supportedExtensions = process.env.REACT_APP_IMAGES_EXTENSIONS;
const StoreMedia = ({ type, title, getImageData, setGetImageData }) => {
  const search = useLocation().search;
  const storeUUID = new URLSearchParams(search).get("id");
  const dispatch = useDispatch();

  const baseURL = process.env.REACT_APP_BASE_URL;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [storeLogo, setStoreLogo] = useState([]);
  const [bannerFileList, setBannerFileList] = useState();

  const absoluteStoreImageInfo = useSelector(
    (state) => state.reducerAbsoluteStoreImageInfo.absoluteStoreImageInfo
  );

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

  const handleChange = (e) => {
    console.log("e.file", e.file);
    setBannerFileList(e.fileList);
    setStoreLogo(e.fileList);
    if (getImageData && getImageData.length > 0) {
      if (e.file.status !== "removed") {
        updateStoreLogoImageCall(e.file);
      }
    } else {
      saveStoreLogoImageCall(e.file);
    }
  };

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

  //! get call of store images
  const findAllWithoutPageStoreImagesApi = () => {
    MarketplaceServices.findAllWithoutPage(storeImagesAPI, {
      store_id: storeUUID,
    })
      .then(function (response) {
        console.log("Get response of Store setting Images--->", response.data);
        setGetImageData([response.data]);
        if (response.data && response.data.store_logo_path) {
          setStoreLogo([
            {
              uid: "-1",
              name: response.data.store_logo_name,
              status: "done",
              url: baseURL + response.data.store_logo_path,
              deleteImagePath: response.data.store_logo,
            },
          ]);
        }
        if (response.data && response.data.banner_images) {
          let tempArrayForBannerImage = [];
          response.data &&
            response.data.banner_images.length > 0 &&
            response.data.banner_images.map((element, index) => {
              console.log("elementTest#", element);
              tempArrayForBannerImage.push({
                uid: index,
                name: element.banner_images_name,
                status: "done",
                url: baseURL + element.banner_fullpath,
                deleteImagePath: element.path,
              });
            });
          setBannerFileList(tempArrayForBannerImage);
        }
      })
      .catch((error) => {
        setGetImageData([]);
        console.log(
          "Get error response of Store setting Images--->",
          error.response
        );
      });
  };

  //! post call of store images
  const saveStoreLogoImageCall = (fileValue) => {
    console.log("fileValue", fileValue);
    const formData = new FormData();
    if (type === "store_logo") {
      formData.append("store_logo", fileValue);
    } else if (type === "banner_images") {
      formData.append("banner_images", fileValue);
    }
    formData.append("store_id", storeUUID);
    MarketplaceServices.save(storeImagesAPI, formData)
      .then((response) => {
        if (response.data) {
          toast("Images saved successfully", {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
            autoClose: 10000,
          });
        }
        console.log(
          "Server Success Response From storeImagePostCall",
          response.data
        );
        setGetImageData([response.data]);
        if (response.data && response.data.store_logo_path) {
          setStoreLogo([
            {
              uid: "-1",
              name: response.data.store_logo_name,
              status: "done",
              url: baseURL + response.data.store_logo_path,
              deleteImagePath: response.data.store_logo,
            },
          ]);
        }
        if (response.data && response.data.banner_images) {
          let tempArrayForBannerImage = [];
          response.data &&
            response.data.banner_images.length > 0 &&
            response.data.banner_images.map((element, index) => {
              console.log("elementTest#", element);
              tempArrayForBannerImage.push({
                uid: index,
                name: element.banner_images_name,
                status: "done",
                url: baseURL + element.banner_fullpath,
                deleteImagePath: element.path,
              });
            });
          setBannerFileList(tempArrayForBannerImage);
        }
      })
      .catch((error) => {
        // setIsUpLoading(false);
        if (error.response) {
          toast(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        } else if (error && error.response && error.response.status === 400) {
          toast(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        } else {
          toast("Something went wrong, please try again later", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        }
        console.log(error.response.data);
        // setIsLoading(false);
      });
  };

  //!put call of store images
  const updateStoreLogoImageCall = (fileValue) => {
    console.log("fileValue", fileValue);
    const formData = new FormData();
    if (type == "store_logo") {
      formData.append("store_logo", fileValue);
    } else if (type == "banner_images") {
      formData.append("banner_images", fileValue);
    }
    formData.append("store_id", storeUUID);
    MarketplaceServices.update(storeImagesAPI, formData)
      .then((response) => {
        if (response.data) {
          toast("Images saved successfully", {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
            autoClose: 10000,
          });
        }
        setGetImageData([response.data]);
        if (response.data && response.data.store_logo_path) {
          setStoreLogo([
            {
              uid: "-1",
              name: response.data.store_logo_name,
              status: "done",
              url: baseURL + response.data.store_logo_path,
              deleteImagePath: response.data.store_logo,
            },
          ]);
        }
        if (response.data && response.data.banner_images) {
          let tempArrayForBannerImage = [];
          response.data &&
            response.data.banner_images.length > 0 &&
            response.data.banner_images.map((element, index) => {
              console.log("elementTest#", element);
              tempArrayForBannerImage.push({
                uid: index,
                name: element.banner_images_name,
                status: "done",
                url: baseURL + element.banner_fullpath,
                deleteImagePath: element.path,
              });
            });
          setBannerFileList(tempArrayForBannerImage);
        }
        // setIsUpLoading(false);
        // setIsLoading(false);
        console.log(
          "Server Success Response From storeImagePutCall",
          response.data
        );
      })
      .catch((error) => {
        // setIsUpLoading(false);
        console.log(error.response);
        // setIsLoading(false);
        if (error.response) {
          toast(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        } else if (error && error.response && error.response.status === 400) {
          toast(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        } else {
          toast("Something went wrong, please try again later", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        }
      });
  };

  useEffect(() => {
    if (getImageData && getImageData.length > 0) {
      let temp = getImageData[0];
      if (temp && temp.store_logo_path) {
        setStoreLogo([
          {
            uid: "-1",
            name: temp.store_logo_name,
            status: "done",
            url: baseURL + temp.store_logo_path,
            deleteImagePath: temp.store_logo,
          },
        ]);
      }
      if (temp && temp.banner_images) {
        let tempArrayForBannerImage = [];
        temp &&
          temp.banner_images.length > 0 &&
          temp.banner_images.map((element, index) => {
            tempArrayForBannerImage.push({
              uid: index,
              name: element.banner_images_name,
              status: "done",
              url: baseURL + element.banner_fullpath,
              deleteImagePath: element.path,
            });
          });
        setBannerFileList(tempArrayForBannerImage);
      }
    }
  }, [getImageData]);

  const handleRemove = (file) => {
    console.log("file:", file);
    const { confirm } = Modal;
    return new Promise((resolve, reject) => {
      confirm({
        title: "Confirm Image Deletion",
        icon: null,
        okButtonProps: { className: "app-btn-primary" },
        cancelButtonProps: { className: "pp-btn-secondary" },
        okText: "Ok",
        content:
          "Are you absolutely sure you want to delete the image? This action cannot be undone.",
        onOk: () => {
          let dataObject = {};
          dataObject["store_id"] = storeUUID;
          dataObject["image-type"] = type;
          dataObject["image-path"] = file.deleteImagePath;
          MarketplaceServices.remove(storeDeleteImagesAPI, dataObject)
            .then((response) => {
              console.log("response from delete===>", response);
              if (response.status === 200 || response.status === 201) {
                toast(`${response.data.message}`, {
                  position: toast.POSITION.TOP_RIGHT,
                  type: "success",
                  autoClose: 10000,
                });
                resolve(true);
              }
              getImageData([]);
            })
            .catch((error) => {
              reject(true);
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
        },
        onCancel: () => {
          reject(true);
        },
      });
    });
  };

  return (
    <Content>
      <Content className="my-2">
        <Title level={5} className="mr-1">
          {title}
        </Title>
      </Content>
      <Content>
        {type && type === "store_logo" ? (
          <>
            <Upload
              maxCount={1}
              listType="picture-card"
              beforeUpload={() => {
                return false;
              }}
              afterUpload={() => {
                return false;
              }}
              fileList={storeLogo}
              name="file"
              onPreview={handlePreview}
              accept={supportedExtensions}
              onChange={(e) => {
                handleChange(e);
              }}
              onRemove={handleRemove}
              // onRemove={false}
            >
              {storeLogo && storeLogo.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal
              open={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img
                alt="example"
                style={{
                  width: "100%",
                }}
                src={previewImage}
              />
            </Modal>
          </>
        ) : (
          <>
            <Upload
              maxCount={bannerImagesLength}
              multiple
              listType="picture"
              beforeUpload={() => {
                return false;
              }}
              afterUpload={() => {
                return false;
              }}
              fileList={bannerFileList}
              onRemove={handleRemove}
              onPreview={handlePreview}
              accept={supportedExtensions}
              onChange={(e) => {
                handleChange(e);
              }}
            >
              {bannerFileList &&
              bannerFileList.length >= bannerImagesLength ? null : (
                <Button icon={<UploadOutlined />}>
                  Upload (Max: {bannerImagesLength})
                </Button>
              )}
            </Upload>
            <Modal
              open={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img
                alt="example"
                style={{
                  width: "100%",
                }}
                src={previewImage}
              />
            </Modal>
          </>
        )}
      </Content>
    </Content>
  );
};

export default StoreMedia;
