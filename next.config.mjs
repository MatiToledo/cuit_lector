/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/search",
        destination: "https://www.cuitonline.com/search.php",
      },
      {
        source: "/api/detail/:cuit/:name",
        destination: "https://www.cuitonline.com/detalle/:cuit/:name.html",
      },
    ];
  },
};

export default nextConfig;
