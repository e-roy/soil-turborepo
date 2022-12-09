import Head from "next/head";
import React, { FC } from "react";

const DEFAULT_TITLE = process.env.NEXT_PUBLIC_ENV_BRANCH
  ? `Eden protocol - alpha - ${process.env.NEXT_PUBLIC_ENV_BRANCH}`
  : `Eden protocol - alpha`;
const DEFAULT_DESCRIPTION = `Connect with me on Eden Protocol.  

Together, let's build the perfect breeding ground for everyone to do work they love. Eden's talent coordination protocol is how.`;

const DEFAULT_IMAGE = `https://pbs.twimg.com/profile_images/1595723986524045312/fqOO4ZI__400x400.jpg`;

export interface ISEOGrantsProps {
  name?: string;
  description?: string;
  image?: string;
}

export const SEOGrants: FC<ISEOGrantsProps> = ({
  name = " ",
  description = " ",
  image = DEFAULT_IMAGE,
}) => {
  const appTitle = name + ` on | ` + DEFAULT_TITLE;
  const appDescription = description ? description : DEFAULT_DESCRIPTION;
  const appImage = image ? image : DEFAULT_IMAGE;

  const apiUrl = `/api/og/grant?image=${appImage}&name=${name}&description=${description}`;

  const ogImage = process.env.VERCEL_URL
    ? "https://" + process.env.VERCEL_URL + apiUrl
    : "" + apiUrl;

  return (
    <Head>
      <meta property="og:site_name" content={`Eden protocol - alpha`} />
      <meta property="og:title" content={appTitle} />
      <meta property="og:description" content={appDescription} />
      <meta property="og:image" content={encodeURI(ogImage)} />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="400" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:site" content={`Eden protocol - alpha`} />
      <meta property="twitter:title" content={appTitle} />
      <meta property="twitter:description" content={appDescription} />
      <meta property="twitter:image:src" content={encodeURI(ogImage)} />
      <meta property="twitter:image:width" content="800" />
      <meta property="twitter:image:height" content="400" />
      <meta property="twitter:creator" content={`Eden protocol - alpha`} />
    </Head>
  );
};

export default SEOGrants;
