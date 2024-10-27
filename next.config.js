/** @type {import('next').NextConfig} */
require('dotenv').config();

const isDev = process.env.IS_DEV === 'true';
const doExport = process.env.DO_EXPORT === 'true';

module.exports = {
    images: {
        unoptimized: true,
        domains: ['127.0.0.1'] // Add the hostname(s) here
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    ...(!isDev && {
        basePath: '/static',
        assetPrefix: '/static'
    }),
    ...(doExport && {
        output: 'export'
    })
};