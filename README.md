## 前端自动化工具[gulp](http://www.gulpjs.com.cn/)使用方法
![image](https://cloud.githubusercontent.com/assets/18028533/20460560/bef82c04-af21-11e6-9827-b891425d7f8c.png)

## gulp优势与使用步骤
最近一段时间研究了一下前端打包工具grunt与gulp，发现gulp的配置相比较于grunt，配置更加的简介，所以去配置并初步使用了一下，发现gulp确实是比较方便的
具体步骤如下：
- 由于此类自动化方案都是基于node环境的，因此这里先需要在本地搭建好node环境，安装好node的同时，node中自动集成了npm。
```
node -v //查看node版本号
npm -v  //查看npm版本号
```
- 这里我推荐git来进行代码的bush，方便快捷[git下载地址](https://git-scm.com/downloads)
-然后全局安装 gulp安装以后可以通过`$ gulp -v`查看版本
```
$ npm install --global gulp  //全局安装。
$ npm install --save-dev gulp  //作为项目的开发依赖（devDependencies）安装,指定某个文件夹,如果全局没办法安装。
```
# 插件下载代码 
```
npm install --save-dev gulp-sass browser-sync gulp-imagemin gulp-gzip gulp-minify-css 
gulp-rename gulp-concat gulp-uglify gulp-notify gulp-cache
```
