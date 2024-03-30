import {
  Alert,
  Button,
  Checkbox,
  Empty,
  Modal,
  Skeleton,
  Tooltip,
  Typography,
} from "antd";
import { useTranslation } from "react-i18next";
import "./policiesSettings.css";
import { useState } from "react";
import useGetUserConsent from "./hooks/useGetUserConsent";
import { useSearchParams } from "react-router-dom";
import useDeleteUserConsent from "./hooks/useDeleteUserConsent";
import { useEffect } from "react";
import { toast } from "react-toastify";
import StoreModal from "../../components/storeModal/StoreModal";
import PolicyCard from "./components/PolicyCard";
import PreviewAndCustomise from "./components/PreviewAndCustomise";
import { useRef } from "react";
import { RiInformationFill } from "react-icons/ri";

const { Text, Paragraph, Title } = Typography;
const CONTACT_INFORMATION = "Contact Information";

const PoliciesSettings = ({ storeName }) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const storeUUID = searchParams.get("id");
  const storeId = searchParams.get("storeId");
  const newPolicyRef = useRef(null);

  const [contactInformation, setContactInformation] = useState([]);
  const [
    policiesWithoutContactInformation,
    setPoliciesWithoutContactInformation,
  ] = useState([]);
  const [addNewPolicy, setAddNewPolicy] = useState(false);
  const [addContactInfo, setContactInfo] = useState(false);
  const [deletePolicy, setDeletePolicy] = useState(null);
  const [previewAndCustomise, setPreviewAndCustomise] = useState(null);
  const {
    data: userConsents,
    status: userConsentStatus,
    error: userConsentError,
    refetch: refetchUserConsent,
    isFetched: isUserConsentFetched,
  } = useGetUserConsent({
    storeId: storeUUID,
  });

  const {
    mutate: deleteStoreUserConsent,
    status: deleteStoreUserConsentStatus,
  } = useDeleteUserConsent();

  const handelAddNewPolicy = () => {
    setAddNewPolicy(true);
    setTimeout(() => {
      newPolicyRef.current.scrollIntoView(false);
    }, [100]);
  };
  const onContactInfoChange = (e) => {
    if (contactInformation?.length > 0) {
      const contactInformationId = contactInformation?.[0]?.id;
      setDeletePolicy(contactInformationId);
    } else {
      setContactInfo(e.target.checked);
    }
  };

  useEffect(() => {
    let tempContactInformation = [];
    const tempPoliciesWithoutContactInformation = [];
    if (userConsentStatus === "success" || isUserConsentFetched) {
      userConsents?.userconsent_data?.forEach((consent) => {
        if (consent?.name === CONTACT_INFORMATION) {
          tempContactInformation = [consent];
        } else tempPoliciesWithoutContactInformation.push(consent);
      });
      setContactInformation(tempContactInformation);
      setPoliciesWithoutContactInformation([
        ...tempPoliciesWithoutContactInformation,
      ]);
      if (tempContactInformation?.length > 0) setContactInfo(true);
    }
  }, [isUserConsentFetched, userConsentStatus, userConsents]);

  const handelDeletePolicy = (userConsentId) => {
    if (userConsentId) setDeletePolicy(userConsentId);
    else setAddNewPolicy(false);
  };
  const deletePolicyById = (userConsentId) => {
    if (userConsentId) {
      deleteStoreUserConsent(
        { userConsentId },
        {
          onSuccess: () => {
            refetchUserConsent();
            setContactInfo(false);
            toast(t("messages:policy_deleted_successfully"), {
              type: "success",
            });
            setDeletePolicy(null);
          },
          onError: (err) => {
            toast(
              err?.response?.data?.response_message ||
                t("messages:error_deleting_policy"),
              {
                type: "error",
              }
            );
          },
        }
      );
    }
  };

  const handelPreviewAndCustomise = () => {
    setPreviewAndCustomise(true);
  };

  return (
    <section className=" !p-3 bg-white rounded-lg m-3">
      <Title level={3} className="!font-bold">
        {t("messages:policies")}
      </Title>
      <div className=" flex  w-full max-w-[980px] justify-between ">
        <Text>{t("messages:help_info_policies")}</Text>
        <div className="flex !gap-2">
          <Button
            onClick={handelPreviewAndCustomise}
            disabled={
              userConsentStatus !== "success" ||
              userConsents?.userconsent_data?.length <= 0
            }
          >
            {t("labels:preview_and_customise")}
          </Button>
          <Button
            className="app-btn-primary "
            onClick={handelAddNewPolicy}
            disabled={userConsentStatus !== "success"}
          >
            {t("labels:add_new_policy")}
          </Button>
        </div>
      </div>
      <div className=" mt-3">
        <Skeleton loading={userConsentStatus === "pending"} active />
      </div>
      {userConsentStatus === "success" && (
        <div>
          {policiesWithoutContactInformation?.length > 0 &&
            policiesWithoutContactInformation?.map((consent) => {
              return (
                <div key={consent?.id}>
                  <PolicyCard
                    consent={consent}
                    refetchUserConsent={refetchUserConsent}
                    handelDeletePolicy={handelDeletePolicy}
                    storeId={storeId}
                  />
                </div>
              );
            })}

          {addNewPolicy ? (
            <div ref={newPolicyRef}>
              <PolicyCard
                isNewPolicy
                refetchUserConsent={refetchUserConsent}
                setAddNewPolicy={setAddNewPolicy}
                handelDeletePolicy={handelDeletePolicy}
                storeId={storeId}
              />
            </div>
          ) : userConsents?.userconsent_data?.length <= 0 ? (
            <div className=" py-3">
              <Empty description={false} />
            </div>
          ) : null}
          <div className=" flex items-center ">
            <Checkbox onChange={onContactInfoChange} checked={addContactInfo}>
              Display contact information
            </Checkbox>
            <Tooltip title={t("messages:contact_policy_info")}>
              <RiInformationFill className=" text-[#1677ff] text-base cursor-pointer" />
            </Tooltip>
          </div>
          <div>
            <Alert
              message={t("messages:contact_info")}
              type="info"
              showIcon
              className=" mt-2 ml-7 w-[395px]"
            />
          </div>
          {addContactInfo && (
            <PolicyCard
              refetchUserConsent={refetchUserConsent}
              consent={contactInformation?.[0] || null}
              addContactInfo={addContactInfo}
              policyName={CONTACT_INFORMATION}
              isNewPolicy={contactInformation?.length === 0}
              key={contactInformation?.[0]?.id || "addContactInfo"}
              storeId={storeId}
            />
          )}
        </div>
      )}

      {userConsentStatus === "error" && (
        <div className=" text-center mt-5 mb-4">
          <Text>{t("messages:network_error")}</Text>
        </div>
      )}
      <Modal
        title={t("labels:delete_policies")}
        isSpin={false}
        open={deletePolicy}
        width={"446px"}
        centered={true}
        onCancel={() => setDeletePolicy(null)}
        footer={[
          <Button
            onClick={() => setDeletePolicy(null)}
            disabled={deleteStoreUserConsentStatus === "pending"}
          >
            {t("labels:cancel")}
          </Button>,
          <Button
            danger
            className=" app-btn-danger"
            onClick={() => deletePolicyById(deletePolicy)}
            loading={deleteStoreUserConsentStatus === "pending"}
          >
            {t("labels:yes")}
          </Button>,
        ]}
      >
        <Text className="!text-[#333333]">
          {t("messages:delete_confirmation")}
        </Text>
      </Modal>
      <StoreModal
        isVisible={previewAndCustomise}
        title={t("labels:preview_and_customise")}
        isSpin={false}
        cancelCallback={() => setPreviewAndCustomise(null)}
        width={1088}
        destroyOnClose={true}
      >
        <PreviewAndCustomise
          userConsents={userConsents}
          closeModal={() => setPreviewAndCustomise(null)}
          refetchUserConsent={refetchUserConsent}
          storeId={storeId}
          storeName={storeName}
        />
      </StoreModal>
    </section>
  );
};
export default PoliciesSettings;
