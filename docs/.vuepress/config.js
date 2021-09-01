const {navConfig, sidebarConfig} = require("./conf/navSidebarConfig");

module.exports = {
    title: "秋雨",
    lang: 'zh-CN',
    description: '在知识的海洋里遨游',
    head: [
        ['link', { rel: 'icon', href: '/logo.ico' }],
    ],
    themeConfig: {
        // 开启 更新时间
        lastUpdated: '更新时间',
        // 左上角logo
        logo: '/logo.png',
        // 自动生成 导航 及 侧边栏
        nav: navConfig,
        sidebar: sidebarConfig,

    },
    markdown: {
        // 引入markdown-it-disable-url-encode解决相对路径问题
        extendMarkdown: md => {
            md.use(require("markdown-it-disable-url-encode"));
        }
    },
    plugins: {
        // 图片放大支持
        '@vuepress/medium-zoom': {
            // 选择器 所有img使用此功能
            selector: 'img',
            options: {
                margin: 8
            }
        },
        // 格式化 最后跟新时间
        '@vuepress/last-updated': {
            transformer: (timestamp, lang) => {
                // 不要忘了安装 moment
                const moment = require('moment')
                moment.locale(lang)
                // return moment(timestamp).fromNow()
                return moment(timestamp).format("YYYY年MM月DD日")
            }
        },
        // 启用 搜索功能 （此插件已包含在默认主体中）
        '@vuepress/search': {
            searchMaxSuggestions: 10
        },
    },

}
