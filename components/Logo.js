import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FormattedMessage } from "react-intl";

const Logo = (props) => {
  return (
    <Link href="/" className="air__logo">
      <div className="d-flex">
        <Image
          src="/logo.png"
          alt="Grant Management Application"
          title="Grant Management Application"
          width="60"
          height="50"
        />
        <div className="logo__name text-uppercase text-light">
          <FormattedMessage id="topBar.mainTitle" />
        </div>
        <div className="logo__descr text-uppercase font-size-12 text-gray-6">
          <FormattedMessage id="topBar.subTitle" />
        </div>
      </div>
    </Link>
  );
};

export default Logo;
