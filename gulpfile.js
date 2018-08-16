var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    del = require('del'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect'),
    proxy = require('http-proxy-middleware'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    less = require('gulp-less'),
    postcss = require('gulp-postcss');

//清除老旧压缩文件
gulp.task('clean', function() {
    return del(['dist']);
});

//迁移html和静态文件
gulp.task('transfer', function() {
    return gulp.src(['src/**/*.*', '!src/index.html', '!src/admin.html', '!src/directSell.html', '!src/less/*.*', '!src/js'])
        .pipe(gulp.dest('dist'))
});

gulp.task('transferJs', function() {
    return gulp.src(['src/js'])
        .pipe(gulp.dest('dist/js'))
});


//把less转为css
gulp.task('toCss', function() {
    return gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('src/css'));
});


//合并并压缩页面公共的js
gulp.task('useref', function() {
    return gulp.src(['src/index.html', 'src/admin.html', 'src/directSell.html'])
        .pipe(useref())
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

gulp.task('revJs', function() {
    return gulp.src('dist/js/*.js')
        .pipe(rev())
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/js'));
});

//Html替换css、js文件版本
gulp.task('revHtml', function() {
    return gulp.src(['dist/**/*.json', 'dist/index.html'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest('dist'))
});

//删掉版本号生成的文件
gulp.task('cleanFile', function() {
    return del(['dist/**/*.json', 'dist/js/base.min.js']);
});

//构建发布的代码
gulp.task('build', ['clean'], function() {
    runSequence(['useref'], ['transfer']);
});


//构建本地服务
gulp.task('service', function() {
    connect.server({
        name: 'Dist App',
        root: 'dist',
        port: 8008,
        livereload: true,
        middleware: function(connect, opt) {
            return [
                proxy('/business-recommendation', {
                    target: 'http://10.22.0.67:8080',
                    changeOrigin: true
                })
            ]
        }
    });
});
//把src的文件转移
gulp.task('transferDev', function() {
    return gulp.src(['src/**/*.*', '!src/index.html', '!src/admin.html', '!src/directSell.html', '!src/less/*.*'], {})
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

gulp.task('develop', function() {
    runSequence('toCss', 'useref', 'transferDev');
});

gulp.task('watch', function() {
    //livereload.listen();
    //gulp.watch('src/**/*.*', function(file) {
    //    livereload.changed(file.path);
    //});
    gulp.watch('src/**/*.*', ['develop']);
});



gulp.task('default', ['clean'], function() {
    runSequence('develop', 'watch', 'service');
});