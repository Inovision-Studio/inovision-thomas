import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Space_Grotesk, Sora, Inter } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/settings";
import ChatWidget from "@/components/public/ChatWidget";
import { fontHead, parseFont } from "@/lib/fonts";
import AgeGate from "@/components/public/AgeGate";
import { ageGate, bizName, chatBrand, logoOf } from "@/lib/brand";
import { text } from "@/lib/content";
import MobileActionBar from "@/components/public/MobileActionBar";
import SpinToWin from "@/components/public/SpinToWin";
import Analytics from "@/components/public/Analytics";
import PublicOnly from "@/components/public/PublicOnly";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings().catch(() => ({}) as Record<string, string>);
  const name = bizName(s);
  return { title: { default: name, template: `%s — ${name}` }, description: s.business_blurb || `${name} — visit us in store.` };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0e0a",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings().catch(() => ({}) as Record<string, string>);
  const accent = s.accent_color || "#ff5a1f";
  const fonts = fontHead(parseFont(s.font_display), parseFont(s.font_body));
  return (
    <html lang="en" className={`${bebas.variable} ${grotesk.variable} ${sora.variable} ${inter.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `:root{--accent:${accent}}` }} />
        {fonts.links.length ? (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            {fonts.links.map((href) => (
              <link key={href} rel="stylesheet" href={href} />
            ))}
          </>
        ) : null}
        {fonts.css ? <style dangerouslySetInnerHTML={{ __html: fonts.css }} /> : null}
        {s.favicon_ref?.trim() ? <link rel="icon" href={s.favicon_ref.trim()} /> : null}
        {s.ga_measurement_id ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${s.ga_measurement_id}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${s.ga_measurement_id}');`,
              }}
            />
          </>
        ) : null}
      </head>
      <body>
        {children}
        <PublicOnly>
          <ChatWidget brand={chatBrand(s)} />
          {ageGate(s) ? <AgeGate logo={logoOf(s)} name={bizName(s)} age={ageGate(s)} title={text(s, "agegate_title")} /> : null}
          <MobileActionBar />
          <SpinToWin />
          <Analytics />
        </PublicOnly>
      </body>
    </html>
  );
}
