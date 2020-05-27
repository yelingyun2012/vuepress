---
sidebar: auto
---

# Vuepress 构建问题集

## 部署地址
base
   - 部署站点的基础路径，如果你想让你的网站部署到一个子路径下, 需要设置具体的子路径。
   - `base` 将会作为前缀自动地插入到所有以 / 开始的其他选项的链接中

## deploy.sh 配置

``` bash{13,20,23}
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 运行package.json build命令，生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io, 发布地址为部署地址(git 仓库master 地址)
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -
```

master 分支可作为页面发布分支，dev分支作为vuepress编写分支