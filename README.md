## 前端自动化工具[gulp](http://www.gulpjs.com.cn/)使用方法
![image](https://cloud.githubusercontent.com/assets/18028533/20460560/bef82c04-af21-11e6-9827-b891425d7f8c.png)

## gulp优势与使用步骤
最近一段时间研究了一下前端打包工具grunt与gulp，发现gulp的配置相比较于grunt，配置更加的简介，所以去配置并初步使用了一下，发现gulp确实是比较方便的
具体步骤如下：
## 一、下载并安装node.js
- 由于此类自动化方案都是基于node环境的，因此这里先需要在本地搭建好node环境，安装好node的同时，node中自动集成了npm。
```
node -v //查看node版本号
npm -v  //查看npm版本号
```
## 二、下载并安装gulp
- 这里我推荐git来进行代码的bush，方便快捷[git下载地址](https://git-scm.com/downloads)
-然后全局安装 gulp安装以后可以通过`$ gulp -v`查看版本,可以在任何一个文件夹中使用。
```c
$ npm install --global gulp  //全局安装。

 // 作为项目的开发依赖（devDependencies）安装,指定某个文件夹,如果全局没办法安装。
 // 一般生产环境都是用局部安装方法安装的
 // 这里要注意的是如果在桌面的文件夹下面bush可能node_module在桌面，而且不能重复安装
$ npm install --save-dev gulp 
// cli命令
$ npm install -g gulp-cli # 通过cli命令可以将 局部安装命令进行全局调用
```

### 局部安装完毕（node_modules大约为7MB）
- 仅限在当前文件夹使用脚本命令
![image](https://cloud.githubusercontent.com/assets/18028533/20479491/60b49f44-b019-11e6-8dd1-072a57b94ecf.png)

## 创建一个package.json
- 输入指令，然后一路enter即可
```git
$ npm init
```

## 插件下载代码 
- 下载完毕后，package.json会多出"devDependencies"属性，里面是插件名称。（大小到达150MB）
```
$ npm install --save-dev browser-sync gulp-imagemin gulp-gzip gulp-clean gulp-livereload gulp-minify-css gulp-rename gulp-concat gulp-uglify gulp-notify gulp-cache

```
### 如果npm下载速度很慢，推荐使用淘宝镜像cnpm
[cnpm地址](https://npm.taobao.org/)，只需要执行一段代码
```
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
```
## 创建一个gulpfile.js文件
[gulpfile.js](https://github.com/Kelichao/gulp/blob/master/gulpfile.js)

## 使用方法
- 如果能够全局使用
```
$ gulp
$ gulp styles // 调用gulp内部对应方法即可
```

- 如果不能够全局使用（可以在scripts中写好对应调用方式）
```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "log": "gulp con",
    "start": "gulp scripts"
  }
```
**命令行**
```
$ npm run log
$ npm run start
```

> 如果node_modules中的模块不小心被删除了，或者不全可以使用
    
    # 修复
    $ npm install
    
    
>　会自动下载package.json文件中列出名字的所有包模块。
