import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

/**
 * # MyDocument
 *
 * Static icon stuff, some SEO stuff, hardly ever changes
 *
 * {@link public/icons}
 */
export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="application-name" content="Shrt" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="Shrt" />
          <meta
            name="description"
            content="URL Shortener and Personal Landing Page by GVEMPIRE"
          />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="msapplication-config"
            content="/icons/browserconfig.xml"
          />
          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#000000" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content="https://shrtme.app" />
          <meta name="twitter:title" content="Shrt" />
          <meta
            name="twitter:description"
            content="URL Shortener and Personal Landing Page by GVEMPIRE"
          />
          <meta
            name="twitter:image"
            content="https://shrtme.app/icons/android-chrome-192x192.png"
          />
          <meta name="twitter:creator" content="@tkjohnson121" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Shrt" />
          <meta
            property="og:description"
            content="URL Shortener and Personal Landing Page by GVEMPIRE"
          />
          <meta property="og:site_name" content="Shrt" />
          <meta property="og:url" content="https://shrtme.app" />
          <meta
            property="og:image"
            content="https://shrtme.app/icons/apple-touch-icon.png"
          />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/icons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/icons/favicon-16x16.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="mask-icon"
            href="/icons/safari-pinned-tab.svg"
            color="#5bbad5"
          />
          <link rel="shortcut icon" href="/icons/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
