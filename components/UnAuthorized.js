import React, { Fragment } from "react";
import Link from "next/link";
import { injectIntl, IntlShape } from "react-intl";
import Head from "next/head";

const UnAuthorized = ({ intl }) => {
  return (
    <Fragment>
      <Head>
        <title>{intl.formatMessage({ id: "auth.unAuthorized" })}</title>
      </Head>
      <div className="flex items-center justify-center w-screen h-screen font-play bg-gray-100">
        <div className="px-4 lg:py-12">
          <div className="lg:gap-4 lg:flex">
            <div className="flex flex-col items-center justify-center md:py-24 lg:py-32">
              <h1 className="font-bold text-blue-600 text-5xl">
                {intl.formatMessage({ id: "auth.unAuthorized" })}
              </h1>
              <p className="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
                <span className="text-red-500">
                  {intl.formatMessage({ id: "auth.oops" })}
                </span>
              </p>
              <p className="mb-8 text-center text-gray-500 md:text-lg">
                {intl.formatMessage({ id: "auth.notAuthPageOrAction" })}
              </p>

              <Link href="/">
                <p className="px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100 cursor-pointer">
                  {intl.formatMessage({ id: "auth.goHome" })}
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default injectIntl(UnAuthorized);
