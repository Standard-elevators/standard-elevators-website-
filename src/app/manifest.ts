import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Standard Engineering Works Elevators",
    short_name: "Standard Elevators",
    description:
      "Premier elevator design, new installation, repairs, modernization, and maintenance in Hyderabad, Telangana, and Andhra Pradesh since 2016.",
    start_url: "/",
    display: "standalone",
    background_color: "#051326",
    theme_color: "#051326",
    icons: [
      {
        src: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
