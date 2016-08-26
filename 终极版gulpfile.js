
// gulp配置文件


// gulp配置文件

var gulp = require('gulp'),  
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    browserSync = require('browser-sync').create();
    //var reload = browserSync.reload;

    var jshintConfig = {
    	bitwise: true ,     // 禁用位运算符，经常是把 && 错输成 &
    	curly: true,        // 循环或者条件语句必须使用花括号包围
    	eqeqeq: true ,      // 强制使用三等号
    	freeze: true,		// 禁止重写原生对象的原型，比如 Array ， Date
    	quotmark: true,		// 为 true 时，禁止单引号和双引号混用
    	newcap: true,  		// 构造器函数首字母大写
    	undef:true,			// 如果是ture，则所有的局部变量必须先声明之后才能使用
		unused: true, 		// 变量未使用
		maxparams: 4,		// 最多参数个数
		maxdepth: 4,		// 最大嵌套深度
		bitwise:false,		// 如果是true，则禁止使用位运算符
		debug:false,		// 如果是true，则允许使用debugger的语句
		evil:false,			// 如果是true，则允许使用eval方法
		forin:true,			// 如果是true，则不允许for in在没有hasOwnProperty时使用
		maxerr	:10,		// 默认是50。 表示多少错误时，jsLint停止分析代码
		nomen:false,		// 如果是true，则不允许在名称首部和尾部加下划线
		onevar:true,		// 如果是true，则在一个函数中只能出现一次var
		passfail:false,		// 如果是true，则在遇到第一个错误的时候就终止
		plusplus:false,		// 如果是true，则不允许使用++或者- -的操作
		regexp:false,		// 如果是true，则正则中不允许使用.或者[^…]
		sub	:true, 			// 如果是true，则允许使用各种写法获取属性(一般使用.来获取一个对象的属性值)
		strict:false,		// 如果是true，则需要使用strict的用法，
		white:true,			// 如果是true，则需要严格使用空格用法。
	    predef: [ "alert", "window", "jQuery", "$"] // 声明几个全局变量
  	};

    // jshintConfig.lookup = false;

    gulp.task('jshint', function(){
    	gulp.watch('src/scripts/main.js')
    		.on("change", function() {
    			var x=jshint.reporter('default');
    			//console.log(x)
    			gulp.src('src/scripts/main.js')
    			    .pipe(jshint(jshintConfig))
    			    .pipe(jshint.reporter('default'))
    			    .pipe(notify({
      message: "文件<%= file.relative %> 错误个数"}))
    		})
        
    })
    //highWaterMark,buffer,length,pipes,pipesCount,flowing,ended,endEmitted,reading,calledRead,sync,needReadable,emittedReadable,
    readableListening,objectMode,defaultEncoding,
    ranOut,awaitDrain,readingMore,decoder,encoding

//domain,_events,_eventsCount,_maxListeners,_writableState,writable,allowHalfOpen,_transformState,_destroyed,_transform,_flush

    // 静态服务器
	gulp.task('sync', function() {
	    browserSync.init({
	        server: {
	            baseDir: "./"
	        }
	    });

	    gulp.watch("src/html/*.html")
	    	.on("change", function(){
	    		browserSync.reload();
	    	})   	

	});

	// gulp.task('watch', function (done) {

	//     gulp.watch('src/**/*')
	//         .on('change', reload)
	//         .on('end', done);
	        
	// });

 //    gulp.task("watch",function() {
 //    	var watcher = gulp.watch("src/html/*.html");
 //    	watcher.on("change", function(){
 //    		browserSync.reload();
 //    	})   	
 //    })

 //    gulp.task('dev', ['browser-sync','watch']);
    // 代理

    // gulp.task('browser-sync', function() {
    //     browserSync.init({
    //         proxy: "file:///E:/glup/src/html/aaa.html"
    //     });
    // });


gulp.task('styles', function() {  
    gulp.src(['src/styles/main1.css','src/styles/main2.css','src/styles/main3.css'])
    .pipe(concat("all.css"))
    // .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer({browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
    					cascade:true,
    					remove:false
}))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(notify({ message: 'css压缩完毕' }));
});


gulp.task('scripts', function() {  
  return gulp.src('src/scripts/**/*.js')
    // .pipe(jshint('.jshintrc'))
    // .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify({
    	compress:false,
    	mangle:{
    		except:["require","exports","module","$"]
    	}
    }))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({ message: "压缩完成" }));
});

gulp.task('clean', function() {  
  return gulp.src(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], {read: false})
  	.pipe(notify({message:""}))
    .pipe(clean());
});

// gulp.task('default', ['clean'], function() {  
//     gulp.start('styles', 'scripts', 'images');
// });

gulp.task("mytask", function() {
	console.log("aaaaaaaaaaaaaa")
	return gulp.src('src/scripts/**/*.js')
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest("dist/assets/js"))
})

gulp.task('images', function() {  
  return gulp.src('src/images/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task("one", function() {
	return gulp.src('src/images/**/*')
		.pipe(notify({message:"开始执行1111111111111111111111111111"}))
});

gulp.task("two",["three","one"], function() {
	return gulp.src("src/images/**/*")
		.pipe(notify({message:"开始执行22222222222222222222222222222"}))
});

gulp.task("three", function() {
	 gulp.src("src/images/**/*")
	.pipe(notify({message:"开始执行333333333333333333"}))
})

gulp.task("four", ["one","one"], function() {
	gulp.start("one","two","one")
})

// gulp.task("watch", function(event) {
// 	var watcher = gulp.watch("src/images/**/*",["images"]);
// 	// console.log("file" + event.path + "was" + event.type + ",running tasks.../")
// 	watcher.on('change', function(event) {
//   		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
// 	});
// });

// gulp.watch("src/images/**/*",["images"],function(event) {
// 	console.log("file" + event.path + "was" + event.type + ",running tasks.../")
// })
	// .pipe(notify({message:"我监听到了"}))
