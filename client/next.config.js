/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        styledComponents: true,
    },
    env: {
        // API_URL: 'https://healthcaretrackingserverapp.azurewebsites.net',
        API_URL: 'http://localhost:8000',
        NEXT_PUBLIC_GOOGLE_MAPS_KEY: 'AIzaSyATM1Qlzkrcsc-SgfcYEbtTayEBhj5yCo8',
    }
}

module.exports = nextConfig
