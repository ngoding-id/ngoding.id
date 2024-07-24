import type {
  LicenseConfig,
  NavBarConfig,
  ProfileConfig,
  SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
  title: "Moshi",
  subtitle: "Developer Blog",
  lang: "id",
  themeColor: {
    hue: 300, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
    fixed: true, // Hide the theme color picker for visitors
  },
  banner: {
    enable: false,
    src: 'assets/images/banner.jpg',
    position: 'center', // Equivalent to object-position, defaults center
    credit: {
      enable: false,         // Display the credit text of the banner image
      text: '',              // Credit text to be displayed
      url: ''                // (Optional) URL link to the original artwork or artist's page
    }
  },
  favicon: [
    // Leave this array empty to use the default favicon
    // {
    //   src: '/favicon/icon.png',    // Path of the favicon, relative to the /public directory
    //   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
    //   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
    // }
  ],
};

export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.About,
  ],
}

export const profileConfig: ProfileConfig = {
  avatar: "assets/images/avatar.jpeg",
  name: "Moshi",
  bio: "/* #AndroidDev fueled by curiosity. Debugging code & life 🌱🐞 Sharing my journey & lessons learned 🍵 */",
  links: [
    {
      name: "Mastodon",
      icon: "fa6-brands:mastodon",
      url: "https://androiddev.social/@gradlew",
    },
    {
      name: "GitHub",
      icon: "fa6-brands:github",
      url: "https://github.com/akbarhmu",
    },
    {
      name: "Play Store",
      icon: "fa6-brands:google-play",
      url: "https://play.google.com/store/apps/dev?id=9002881621187826045",
    },
  ],
};

export const licenseConfig: LicenseConfig = {
  enable: true,
  name: "CC BY-NC-SA 4.0",
  url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  author: "Akbar Hamaminatu",
};
