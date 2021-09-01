:: 进入当前文件夹
call cdDir.bat

pause

:: 安装依赖
call npm install
:: 生成静态文件
call npm run build

git add -A
git commit -m 'deploy'
git push origin master

:: 自动部署Gitee Pages
java -DgiteeUserName=13931154861 -DgiteePwd=n8dxtb001j -DgiteeName=mochen2020 -DrepoName=mochen2020 -Dbranch=master -Dbuild_directory=/docs/.vuepress/dist/ -jar autodeploy-jar-with-dependencies.jar

pause

timeout /t 5