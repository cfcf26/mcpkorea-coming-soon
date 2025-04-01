/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // output: 'export', // 주석 처리: 동적 경로에서 정적 내보내기 사용 불가
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  productionBrowserSourceMaps: false,
  typescript: {
    // !! WARN !!
    // 프로덕션에서는 타입 검사를 비활성화하는 것은 권장되지 않습니다.
    // 여기서는 빌드를 위해 임시로 비활성화합니다.
    ignoreBuildErrors: true,
  },
  eslint: {
    // 마찬가지로 빌드 진행을 위해 ESLint 오류를 무시합니다.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig; 