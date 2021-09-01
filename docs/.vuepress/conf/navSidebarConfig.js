/**
 * 生成 导航栏和侧边栏 配置信息
 */
const path = require("path");
const dirTree = require("directory-tree");

function name2text(name) {
    // 文件名去除前缀
    return name.replace(/_[0-9]+_/, "");
}

function getNavConfig() {
    let navList = [];
    let sidebarConfig = {};

    // 获取 目录结构
    const SRC_PATH = path.resolve(__dirname, "../../");
    let dirs = dirTree(SRC_PATH);
    // 根目录（docs）的路径
    const basePath = dirs.path;
    // 根目录下一二级的内容都会被识别为 nav
    dirs.children.filter(dir => {
        return dir.name !== ".vuepress" && dir.name !== "img"
    }).forEach(navDir => {
        // 一级目录处理
        let navName = navDir.name; // 目录名即为导航菜单名
        if (navDir.type === "directory") { // 文件夹
            let dirConf = {
                text: navName,
                items: [],
            }

            navDir.children.filter(dir => {
                return dir.name !== ".vuepress" && dir.name !== "img"
            }).forEach(subNavDir => {
                // 二级目录处理
                let subNavName = subNavDir.name;
                let routePath = subNavDir.path
                    .replace(basePath, "")  // 去除根路径
                    .replace(/\\/g, "/") // 反斜杠 变 斜杆
                if (subNavDir.type === "directory") { // 文件夹
                    routePath += "/";  // 目录要以 / 结尾，否则会被视为 html文件 路径


                    // 三级目录处理 生成侧边栏配置
                    let sidebarChildren = [];
                    subNavDir.children.forEach(md => {
                        // 三级目录下只处理 md 文件，其余文件及文件夹均被舍弃
                        if (md.type === "file" && md.name.endsWith(".md")) {
                            if (md.name.toLowerCase() === "readme.md") {
                                // readme 文件特殊处理
                                sidebarChildren.unshift(["","readme"])
                            } else {
                                // 非 readme 文件
                                let mdName = md.name.replace(".md", "");
                                sidebarChildren.push([mdName, name2text(mdName)]);
                            }
                        }
                    })
                    if (sidebarChildren.length !== 0) {
                        sidebarConfig[routePath] = [{
                            title: name2text(subNavName),   // 必要的
                            collapsable: false, // 可选的, 默认值是 true,
                            sidebarDepth: 1,    // 可选的, 默认值是 1
                            children: sidebarChildren,
                        }]
                        dirConf.items.push({
                            text: name2text(subNavName),
                            // 二级 nav 的路由为 对应文件夹下的第一个文件
                            link: routePath + sidebarChildren[0][0]
                        });
                    }


                } else if (subNavName.endsWith(".md")) {  // 只处理 md 文件
                    if (subNavName.toLowerCase() === "readme.md") {
                        // readme 文件
                        routePath = routePath.substring(0, routePath.lastIndexOf("/") + 1);
                        dirConf.items.unshift({text: "readme", link: routePath});
                    } else {
                        // 去除后缀
                        subNavName = subNavName.replace(".md", "");
                        routePath = routePath.replace(".md", "");
                        dirConf.items.push({text: name2text(subNavName), link: routePath});
                    }
                }
            })

            navList.push(dirConf);

        } else if (navName.endsWith(".md")) {  // 只处理 md 文件

            if (navName.toUpperCase() === "README.MD") {
                navList.unshift({text: "首页", link: "/"})
            } else {
                navName = navName.replace(".md", "");
                let routePath = navDir.path
                    .replace(basePath, "")  // 去除根路径
                    .replace(/\\/g, "/") // 反斜杠 变 斜杆
                    .replace(".md", ""); // 去除后缀
                navList.push({text: name2text(navName), link: routePath});
            }

        }
    })

    return [navList, sidebarConfig];
}

// 调用方法 生成配置信息
let config = getNavConfig();

// 配置信息输出到文件，以备debug
let fs = require("fs");
let ws = fs.createWriteStream(path.resolve(__dirname, "./debug-")+"navConfig.js");
ws.write("// 此文件 [nav配置] 进用于debug，没有其他作用。\n");
ws.write("module.exports = "+JSON.stringify(config[0],null,4))
ws.close();
ws = fs.createWriteStream(path.resolve(__dirname, "./debug-")+"sidebarConfig.js");
ws.write("// 此文件 [sidebar配置] 进用于debug，没有其他作用。\n");
ws.write("module.exports = "+JSON.stringify(config[1],null,4))
ws.close();

// 配置信息导出
module.exports = {
    navConfig: config[0],
    sidebarConfig: config[1],
}
