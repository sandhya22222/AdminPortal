import { useTranslation } from "react-i18next";

import { ConsentPreview } from "../../../constants/media";
import { Typography, Input, Button, Spin, Switch, Checkbox } from "antd";
import { useEffect, useState } from "react";
import useUpdateConsentLead from "../hooks/useUpdateConsentLead";
import util from "../../../util/common";
import useUpdateConsentsOrder from "../hooks/useUpdateConsentsOrder";
import { toast } from "react-toastify";
import useGetStoreUserConsent from "../hooks/useGetStoreUserConsent";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;
const portalInfo = JSON.parse(process.env.REACT_APP_PORTAL_INFO);

const PreviewAndCustomise = ({
  closeModal,
  refetchUserConsent,
  storeName,
  storeId,
}) => {
  const { t } = useTranslation();
  const {
    data: userConsents,
    status: userConsentsStatus,
    refetch: refetchUserConsents,
  } = useGetStoreUserConsent({
    storeName,
  });
  const [leadInLine, setLeadInLine] = useState("");
  const [reorderList, setReorderList] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);
  const [isListReordered, setIsListReordered] = useState(false);
  const [explicit, setExplicit] = useState(false);

  const { mutateAsync: UpdateConsentLead, status: UpdateConsentLeadStatus } =
    useUpdateConsentLead();
  const {
    mutateAsync: updateConsentsOrder,
    status: updateConsentsOrderStatus,
  } = useUpdateConsentsOrder();
  const handelLeadInLine = (e) => {
    setLeadInLine(e.target.value);
  };

  useEffect(() => {
    if (
      userConsents?.userconsent_data?.length > 0 &&
      userConsentsStatus === "success"
    ) {
      setLeadInLine(
        userConsents?.leading_line ||
          "I have read and agreed to the following policies."
      );
      setExplicit(userConsents?.explicit);
      const tempReorderList = [];
      userConsents?.userconsent_data?.forEach((consent) => {
        tempReorderList.push({
          key: consent?.id,
          name: consent?.name,
          ordering: consent?.ordering,
        });
      });
      tempReorderList.sort((a, b) => a.ordering - b.ordering);
      if (tempReorderList?.length > 0) setReorderList(tempReorderList);
    }
  }, [userConsents, userConsentsStatus]);

  const handleListDragStart = (e, index) => {
    console.log("handleListDragStart", index);
    setDraggedItem(index);
  };
  const handelListDragEnter = (e, index) => {
    setDraggedOverItem(index);
  };

  const handleListDrop = (e, comp) => {
    console.log("draggedItem", draggedItem, comp?.key);
    const updatedFormItems = reorderList?.slice();
    if (draggedItem !== -1 && draggedOverItem !== -1) {
      // Swap positions
      [updatedFormItems[draggedItem], updatedFormItems[draggedOverItem]] = [
        updatedFormItems[draggedOverItem],
        updatedFormItems[draggedItem],
      ];
      setReorderList(updatedFormItems);
      setIsListReordered(true);
    }
  };

  const handelSave = () => {
    const updateLeadInLineAndExplicit = async () => {
      if (
        leadInLine?.trim() !== userConsents?.leading_line ||
        explicit !== userConsents?.explicit
      ) {
        const body = {
          store: storeId,
          leading_line: leadInLine?.trim(),
          explicit: !!explicit,
        };
        await UpdateConsentLead(
          { body },
          {
            onError: (err) => {
              toast(
                err?.response?.data?.message ||
                  t("messages:error_updating_Leadin_line"),
                {
                  type: "error",
                }
              );
              Promise.reject();
            },
          }
        );
      }
    };
    const updateConsentOrder = async () => {
      if (reorderList?.length > 0 && isListReordered) {
        const body = { user_consent_order: [] };
        reorderList?.forEach((consent, index) => {
          body.user_consent_order.push({
            userconsent_id: consent.key,
            ordering: index + 1,
          });
        });
        console.log(body, "body");
        await updateConsentsOrder(
          { body },
          {
            onError: (err) => {
              toast(
                err?.response?.data?.message ||
                  t("messages:error_updating_consent_order"),
                {
                  type: "error",
                }
              );
              Promise.reject();
            },
          }
        );
      }
    };
    Promise.allSettled([
      updateLeadInLineAndExplicit(),
      updateConsentOrder(),
    ]).then((values) => {
      const checkIfPromiseResolved = [];
      values?.forEach((value) => checkIfPromiseResolved.push(value?.status));
      if (!checkIfPromiseResolved?.includes("rejected")) {
        setTimeout(() => {
          refetchUserConsent();
          refetchUserConsents();
          closeModal();
        }, [300]);
      }
    });
  };

  const handelExplicitChange = (checked) => {
    setExplicit(checked);
  };
  return (
    <>
      {userConsentsStatus === "pending" && (
        <div className=" w-full flex justify-center items-center h-[100px]">
          <Spin size="large" />
        </div>
      )}
      {userConsentsStatus === "success" && (
        <>
          <div className=" w-full flex ">
            <div className=" shrink-0">
              <Paragraph className=" !text-black font-bold !text-opacity-40 py-3 !mb-0 ">
                {t("labels:preview")}
              </Paragraph>
              <div className=" relative w-[600px] h-[507px] ">
                <img src={ConsentPreview} alt="ConsentPreview" />
                <div className=" absolute max-w-[440px] flex w-full items-start gap-x-2 bg-white rounded-b-lg top-[304px] !text-[13px] left-[80px] drop-shadow-md p-3">
                  {explicit ? <Checkbox /> : null}
                  <div>
                    <span className=" mr-1">{leadInLine?.trim()}</span>
                    {reorderList?.length > 0 &&
                      reorderList?.map((list, index) => {
                        return (
                          <span key={list?.key} className=" text-[#1890FF] ">
                            <span className=" text-black">
                              {index !== 0 ? ", " : ""}
                            </span>
                            {list?.name}
                          </span>
                        );
                      })}
                  </div>
                </div>
                <div className=" absolute bottom-0 w-full bg-[#D9D9D9] py-2 px-2">
                  <div className=" !text-xs flex items-center pb-2 gap-y-2 gap-x-8 flex-wrap justify-center">
                    {reorderList?.length > 0 &&
                      reorderList?.map((list, index) => {
                        return (
                          <span key={list?.key} className=" text-[#1890FF] ">
                            {list?.name}
                          </span>
                        );
                      })}
                  </div>
                  <p className=" text-xs text-black !mb-0">
                    {t("labels:copyright")} -{" "}
                    {t("labels:torry_harris_integration_solutions")} -{" "}
                    {t("labels:torry_harris_marketplace")} -{" "}
                    {t("labels:admin_portal")} {t("labels:version")}{" "}
                    {portalInfo.version}
                  </p>
                </div>
              </div>
            </div>
            <div className=" p-[1px] mx-6   self-stretch  bg-black !opacity-5" />
            <div className=" w-full">
              <p className=" !text-black font-bold !text-opacity-40 py-3 !mb-0 ">
                {t("labels:customisation")}
              </p>
              <p className=" !text-black font-normal !text-opacity-40 mb-2  ">
                {t("labels:consent_explicit")}
              </p>
              <Switch
                checked={explicit}
                onChange={handelExplicitChange}
                className={` mb-4 ${
                  explicit ? "!bg-green-500" : "!bg-gray-400"
                }`}
              />
              <p className=" !text-black font-normal !text-opacity-40  !mb-0">
                {t("labels:lead_in_line")}
              </p>
              <div className=" pt-2">
                <TextArea
                  className="w-full"
                  showCount
                  maxLength={100}
                  autoSize
                  onChange={handelLeadInLine}
                  value={leadInLine}
                />
              </div>
              <div className=" pt-6">
                <p className=" !text-base text-black !text-opacity-80 font-medium">
                  {t("messages:order_policies")}
                </p>
                <div className=" mt-2 max-w-[280px]  h-[300px] overflow-y-auto w-full">
                  {reorderList?.length > 0 &&
                    reorderList?.map((list, index) => {
                      return (
                        <div
                          key={list.key}
                          className=" flex !py-5 items-center gap-x-4 px-4 border-b  cursor-move"
                          onDragStart={(e) => {
                            handleListDragStart(e, index);
                          }}
                          onDragEnter={(e) => {
                            handelListDragEnter(e, index);
                          }}
                          onDragEnd={(e) => {
                            e.stopPropagation();
                            handleListDrop(e, index);
                          }}
                          draggable
                        >
                          <svg
                            width="16"
                            height="17"
                            viewBox="0 0 16 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M15.0003 2.21191H1.00028C0.921708 2.21191 0.857422 2.2762 0.857422 2.35477V3.49763C0.857422 3.5762 0.921708 3.64049 1.00028 3.64049H15.0003C15.0789 3.64049 15.1431 3.5762 15.1431 3.49763V2.35477C15.1431 2.2762 15.0789 2.21191 15.0003 2.21191ZM15.0003 13.3548H1.00028C0.921708 13.3548 0.857422 13.4191 0.857422 13.4976V14.6405C0.857422 14.7191 0.921708 14.7833 1.00028 14.7833H15.0003C15.0789 14.7833 15.1431 14.7191 15.1431 14.6405V13.4976C15.1431 13.4191 15.0789 13.3548 15.0003 13.3548ZM15.0003 7.78334H1.00028C0.921708 7.78334 0.857422 7.84763 0.857422 7.9262V9.06906C0.857422 9.14763 0.921708 9.21192 1.00028 9.21192H15.0003C15.0789 9.21192 15.1431 9.14763 15.1431 9.06906V7.9262C15.1431 7.84763 15.0789 7.78334 15.0003 7.78334Z"
                              fill="black"
                              fillOpacity="0.45"
                            />
                          </svg>

                          <p className=" !text-sm text-black !text-opacity-80 !mb-0">
                            {list.name}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
          <div className=" flex justify-end">
            <Button
              className="app-btn-primary  uppercase"
              loading={
                updateConsentsOrderStatus === "pending" ||
                UpdateConsentLeadStatus === "pending"
              }
              onClick={handelSave}
            >
              {updateConsentsOrderStatus === "pending" ||
              UpdateConsentLeadStatus === "pending"
                ? ""
                : t("common:ok")}
            </Button>
          </div>
        </>
      )}
    </>
  );
};
export default PreviewAndCustomise;
