import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  let GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
  return (
    <Html lang="he">
      <Head>
      <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=GTM-WPC9JGKS`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GTM-WPC9JGKS', {
                page_path: window.location.pathname,
              });
            `,
            }}
          />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
