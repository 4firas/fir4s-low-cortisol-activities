import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import { DefaultSeo } from 'next-seo';
// import { useEventListener } from 'usehooks-ts';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { CustomCursor } from '../src/CustomCursor';
import { ThreePage } from '../src/ThreePage';
import { SiteData } from '../src/SiteData';
import { MobileVhAsCssVar } from '../src/MobileVhAsCssVar';
import { PlayAllVideosOnClickInLowPowerMode } from '../src/usePlayAllVideosOnClickInLowPowerMode';
import { BackgroundMusic } from '../src/BackgroundMusic';

function MyApp({ Component, pageProps }: AppProps) {
  const siteData: SiteData = {
    startingScene: pageProps.scene ?? 'error',
    projects: pageProps.projects ?? null,
  };

  // useEventListener('focusin', (e) => {
  //   console.log('focused on', e.target);
  // });

  const title = 'fir4s.com | Fir4s';
  const description = 'fir4s portfolio - stills, motion, design, and code.';
  const url = 'https://fir4s.com';

  return (
    <>
      <DefaultSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          url,
          title,
          description,
          type: 'website',
          images: [
            {
              url: 'https://fir4s.com/images/social.png',
              width: 2333,
              height: 1313,
              alt: 'fir4s logo over dark background with goldenrod accents',
              type: 'image/png',
            },
          ],
          site_name: 'fir4s.com',
        }}
        twitter={{
          handle: '@fir4s',
          cardType: 'summary_large_image',
        }}
      />
      <GoogleAnalytics trackPageViews />
      <MobileVhAsCssVar />
      <BackgroundMusic />
      <ThreePage
        siteData={siteData}
      />
      <Component {...pageProps} />
      <CustomCursor />
      <PlayAllVideosOnClickInLowPowerMode />
    </>
  );
}

export default MyApp;
