import { Button, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import moment from "moment/moment";
import { toast } from "react-toastify";

import { ConsentEditIcon } from "../../../constants/media";
import useUpdateUserConsent from "../hooks/useUpdateUserConsent";
import "react-quill/dist/quill.snow.css";
import useCreateUserConsent from "../hooks/useCreateUserConsent";

const { Title, Paragraph } = Typography;

const PolicyCard = ({
  consent,
  refetchUserConsent,
  isNewPolicy,
  setAddNewPolicy,
  addContactInfo,
  policyName,
  handelDeletePolicy,
  storeId,
}) => {
  const { t } = useTranslation();
  const { mutate: UpdateUserConsent } = useUpdateUserConsent();
  const { mutate: createNewUserConsent } = useCreateUserConsent();

  const [consentName, setConsentName] = useState(consent?.name || policyName);
  const [description, setDescription] = useState(consent?.description);
  const [descriptionModified, setDescriptionModified] = useState(false);
  const [isTittleEditable, setIsTittleEditable] = useState(false);
  const isConsentNameChanged = isNewPolicy
    ? !!consentName
    : consentName?.trim() !== consent?.name?.trim();
  console.log(isConsentNameChanged, "isConsentNameChanged");
  const handelConsentNameChange = (name) => {
    if (name?.trim() === "") setConsentName(consent?.name);
    else setConsentName(name);
  };

  const handelSavePolicyName = () => {
    const body = {
      name: consentName?.trim(),
      display_name: consentName?.trim(),
      store: storeId,
    };
    if (isNewPolicy) {
      createNewUserConsent(
        { body },
        {
          onSuccess: () => {
            refetchUserConsent();
            toast(t("messages:successfully_renamed_title"), {
              type: "success",
            });
            setTimeout(() => {
              setAddNewPolicy(false);
            }, [300]);
          },
          onError: (err) => {
            setConsentName(consent?.name);
            toast(
              err?.response?.data?.message || t("messages:error_updating_name"),
              {
                type: "error",
              }
            );
          },
        }
      );
    } else {
      UpdateUserConsent(
        {
          body,
          userConsentId: consent?.id,
        },
        {
          onSuccess: () => {
            refetchUserConsent();
            toast(t("messages:successfully_renamed_title"), {
              type: "success",
            });
          },
          onError: (err) => {
            setConsentName(consent?.name);
            toast(
              err?.response?.data?.message || t("messages:error_updating_name"),
              {
                type: "error",
              }
            );
          },
        }
      );
    }
  };

  const handelCancelPolicyName = () => {
    setConsentName(consent?.name);
  };

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        // [{ size: ["small", false, "large", "huge"] }], // custom dropdown
        ["bold", "italic", "underline", "strike"], // toggled buttons
        ["blockquote", "code-block"],
        ["link"],
        // [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ script: "sub" }, { script: "super" }], // superscript/subscript
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        // [{ direction: "rtl" }], // text direction
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ align: [] }],
        ["clean"],
      ],
    }),
    []
  );

  const handelDescriptionChange = (val) => {
    setDescription(val);
    if (!descriptionModified) setDescriptionModified(true);
  };

  const handelSaveDescription = () => {
    const body = {
      store: Number(storeId),
      description: description,
      name: consentName?.trim(),
      display_name: consentName?.trim(),
    };
    if (isNewPolicy) {
      createNewUserConsent(
        { body },
        {
          onSuccess: () => {
            refetchUserConsent();
            toast(t("messages:policy_saved_successfully"), {
              type: "success",
            });
            setTimeout(() => {
              setAddNewPolicy(false);
            }, [100]);
          },
          onError: (err) => {
            setConsentName(consent?.name);
            toast(
              err?.response?.data?.message || t("messages:error_saving_policy"),
              {
                type: "error",
              }
            );
          },
        }
      );
    } else {
      UpdateUserConsent(
        { body, userConsentId: consent?.id },
        {
          onSuccess: () => {
            refetchUserConsent();
            toast(t("messages:policy_saved_successfully"), {
              type: "success",
            });
            setTimeout(() => {
              setDescriptionModified(false);
            }, [300]);
          },
          onError: (err) => {
            toast(
              err?.response?.data?.message || t("messages:error_saving_policy"),
              {
                type: "error",
              }
            );
          },
        }
      );
    }
  };

  const handelCancelDescription = () => {
    setDescriptionModified(false);
    setDescription();
  };

  const getDate = (date) => {
    try {
      const formattedDate = moment(date).format("D MMM YYYY");
      return formattedDate;
    } catch (error) {
      return "";
    }
  };

  const editableTitle = addContactInfo
    ? false
    : {
        onChange: handelConsentNameChange,
        maxLength: 254,
        triggerType: ["icon", "text"],
        onCancel: () => setIsTittleEditable(false),
        onEnd: () => setIsTittleEditable(false),
        editing: true,
        autoSize: { maxRows: 2 },
      };

  const policyTitleRef = useRef(null);
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        policyTitleRef.current &&
        !policyTitleRef.current.contains(event.target)
      ) {
        setIsTittleEditable(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [policyTitleRef]);
  return (
    <div
      key={consent?.id}
      className=" bg-white  pb-6 policy-card max-w-[980px] w-full"
    >
      <div className=" h-[64px] flex justify-between items-center  w-full">
        <div className=" flex items-center gap-x-5 max-w-[60%] w-full">
          {isTittleEditable ? (
            <div ref={policyTitleRef} className="max-w-xs  w-full">
              <Title
                editable={editableTitle}
                className=" !font-medium text-base  "
                level={5}
              >
                {consentName || t("labels:untitled_policy")}
              </Title>
            </div>
          ) : (
            <div
              className={`flex items-center gap-x-2 max-w-[60%] ${
                addContactInfo ? "cursor-default" : "cursor-pointer"
              } `}
              onClick={() => setIsTittleEditable(true)}
            >
              <Paragraph
                className=" !font-medium text-base !mb-0  "
                ellipsis={{ tooltip: consentName }}
              >
                {consentName?.substring(0, 50) || t("labels:untitled_policy")}
              </Paragraph>
              {!addContactInfo && <img src={ConsentEditIcon} alt="" />}
            </div>
          )}
          {isConsentNameChanged && !descriptionModified && !addContactInfo && (
            <div className=" flex items-center gap-x-2">
              <Button
                size="small"
                className="app-btn-primary "
                onClick={handelSavePolicyName}
              >
                {t("labels:save")}
              </Button>
              <button
                className="app-btn-secondary bg-white border rounded px-2"
                onClick={handelCancelPolicyName}
              >
                {t("labels:cancel")}
              </button>
            </div>
          )}
        </div>
        {!addContactInfo && (
          <div className=" max-w-[40%] w-full flex justify-end">
            <Button danger onClick={() => handelDeletePolicy(consent?.id)}>
              {t("labels:delete")}
            </Button>
          </div>
        )}
      </div>
      <div className=" rounded border-[1px] drop-shadow-sm shadow-[#D9D9D9] border-[#D9D9D9] bg-white   w-full">
        <ReactQuill
          theme="snow"
          value={description}
          onChange={handelDescriptionChange}
          modules={modules}
        />
      </div>
      <p className=" mt-2 text-[#000000] text-opacity-50">
        {t("labels:last_updated")} :{" "}
        {isNewPolicy ? "" : getDate(consent?.updated_on) || ""}
      </p>
      {descriptionModified && (
        <div className=" space-x-2 mt-6">
          <Button
            className="app-btn-primary "
            disabled={!(consentName?.trim() && description?.trim())}
            onClick={handelSaveDescription}
          >
            {t("labels:save")}
          </Button>
          <Button onClick={handelCancelDescription}>
            {t("labels:cancel")}
          </Button>
        </div>
      )}
    </div>
  );
};
export default PolicyCard;
