import { Image, Layout } from "antd";
import React, { useEffect } from "react";
import { useAuth } from "react-oidc-context";

import { Logout503, AdminIcon } from "../constants/media";

const { Content } = Layout;

function LogOut() {
  const auth = useAuth();
  useEffect(() => {
    void auth.signoutSilent();
  }, [auth]);
  return (
    <Content className="grid justify-items-center align-items-center my-28 bg-white">
      <Image
        height={310}
        preview={false}
        src={Logout503}
        fallback={Logout503}
      />

      <h3
        style={{
          fontSize: "20px",
          fontWeight: 400,
          color: "rgba(0, 0, 0, 0.85)",
          marginBottom: ".5rem",
          marginTop: "1rem",
        }}
      >
        Please wait
      </h3>
      <h3
        style={{
          fontSize: "14px",
          fontWeight: 400,
          color: "rgba(0, 0, 0, 0.45)",
        }}
      >
        Please remain on hold momentarily while we securely log you out of the
        application.
      </h3>
    </Content>
  );
}

export default LogOut;
