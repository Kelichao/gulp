var gulp = require('gulp'),  
    sass = require('gulp-sass'),
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
    var reload = browserSync.reload;

    gulp.task("con" ,function() {
    	console.log(111);
    });


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

gulp.task('default', ['clean'], function() {  
    gulp.start('styles', 'scripts', 'images');
});

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

