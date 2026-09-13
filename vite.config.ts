import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import {createSvgIconsPlugin} from "vite-plugin-svg-icons";

export default defineConfig({
    plugins: [
        react(),
        createSvgIconsPlugin({

            iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],

            symbolId: 'icon-[name]',
        }),
    ],
    resolve: {
        alias: {
            '@/': `${path.resolve(__dirname, 'src')}/`,
        },
    },
})
