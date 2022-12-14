import { Input } from 'antd'
import { Content } from 'antd/es/layout/layout'
import { Button } from 'antd/es/radio'
import { React, useState } from 'react'
import { toast } from "react-toastify";
import axios from 'axios';

const language = process.env.REACT_APP_LANGUAGE

const Demo = () => {



  const [vendorname, setVendorName] = useState("");
  const [vendor, setVendor] = useState("");

  const postLanguageRequest = () => {
    console.log("post body for ---", language, " is:", );
    axios
      .post(language,{
        params: {
          language: vendorname,
          language_code: vendor,
         
        },
      })
      
      .then(function (response) {
        console.log("Response from ----", language, " is:", response);
        if (response.status === 200 || response.status === 201) {
          toast("Vendor is created successfully", {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
          });

        }

      })
      .catch(function (error) {
        console.log("errorfromStatus====", error);
        toast("Unable to create language", {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
        });
      });
  };

  const handleNameChange = (e) => {
    setVendorName(e.target.value);
  };
  const handleName = (e) => {
    setVendor(e.target.value);
  };

  return (
    <Content>
      <Input
        placeholder="Enter Vendor Name"
        value={vendorname}
        onChange={(e) => {
          handleNameChange(e);
        }}
      />
      <Input
        placeholder="Enter Vendor Name"
        value={vendor}
        onChange={(e) => {
          handleName(e);
        }}
      />
      <Button
        style={{ backgroundColor: "#393939" }}
        onClick={postLanguageRequest}
      >
        <label className="w-[36px] h-[20px]  text-[13px]  text-[#FFFFFF] cursor-pointer">
          Save
        </label>
      </Button>
    </Content>
  )
}

export default Demo
