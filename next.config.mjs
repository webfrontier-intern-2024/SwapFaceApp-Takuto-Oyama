/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      // Webpackキャッシュの設定
      config.cache = {
        type: 'filesystem',
        compression: 'gzip', // キャッシュを圧縮してパフォーマンスを向上
      };
  
      return config;
    },
  };

  export default nextConfig;
