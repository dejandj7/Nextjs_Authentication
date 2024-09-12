import React from "react";
import { FormattedMessage } from "react-intl";
import Image from "next/image";
import { AppConfig } from "../utilities/config";

const Footer = () => {
  return (
    <div className="w-100 bg-gradient-white air__auth__footer mb-0">
      <div className="text-gray-4 text-center">
        &copy; {new Date().getFullYear()} {AppConfig.organization}.{" "}
        <FormattedMessage id="footer.poweredBy" />{" "}
        <Image src="/pces-logo.png" width="110" height="50" />.{" "}
        <FormattedMessage id="footer.allRights" />
      </div>
    </div>
  );
};

export default Footer;
