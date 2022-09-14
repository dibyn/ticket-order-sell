import React, { memo } from "react";
import apiBuildClient from "../api/buildClient";
import "bootstrap/dist/css/bootstrap.css";
import Header from "./../components/header";

const AppComp = memo(({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Header currentUser={currentUser} />
      <div className='container'>
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </>
  );
});
AppComp.getInitialProps = async (appContext) => {
  const client = apiBuildClient(appContext.ctx);
  const {data} = await client.get("/api/users/currentuser");
  console.log(data)
  let pageProps = {};
  if (appContext.Component.getInitialProps)
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  return {
    pageProps,
    ...data,
  };
};
export default AppComp;
