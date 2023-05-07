// *Створюємо дві константи, яким передаємо всі можливості плагіна gulp який ми встановили 
// *(у файлі package.json в графі "devDependencies" вказано "gulp": "^4.0.2" ну або інша версія)
const {src, dest, watch, parallel, series} = require('gulp');

// *Створюємо константу, якій передаємо всі можливості плагіна gulp-sass та sass
const scss = require('gulp-sass')(require('sass'));

// *Створюємо константу, якій передаємо всі можливості плагіна gulp-concat
// TODO Цей плагін потрібен для того, щоб з декількох файлів створити один або конкатинація файлів
// TODO Також цей плагін вміє переіменовувати готові файли
const concat = require('gulp-concat');

// *Створюємо константу, якій передаємо всі можливості плагіна gulp-uglify-es
// TODO Цей плагін потрібен для того, щоб максиально зжимати файли js
const uglify = require('gulp-uglify-es').default;

// *Створюємо константу, якій передаємо всі можливості плагіна browser-sync
// TODO Цей плагін потрібен для того, автоматично оновлювати сторінку після зміни у файлах
const browserSync = require('browser-sync').create();

// *Створюємо константу, якій передаємо всі можливості плагіна gulp-autoprefixer
// TODO Цей плагін потрібен для того, автоматично додавати префікси для старих версіій браузерів
const autoprefixer = require('gulp-autoprefixer');

// *Створюємо константу, якій передаємо всі можливості плагіна gulp-clean
// TODO Цей плагін потрібен для того, щоб видаляти вказані теки перед build
const clean = require('gulp-clean');

// *Створюємо константу, якій передаємо всі можливості плагіна gulp-avif
// TODO Цей плагін потрібен для того, щоб конвертувати картинки у формат avif
const avif = require('gulp-avif');

// *Створюємо константу, якій передаємо всі можливості плагіна gulp-webp
// TODO Цей плагін потрібен для того, щоб конвертувати картинки у формат webp
const webp = require('gulp-webp');

// *Створюємо константу, якій передаємо всі можливості плагіна gulp-imagemin
// TODO Цей плагін потрібен для того, щоб зменшувати картиники формату jpeg, png, svg
const imagemin = require('gulp-imagemin');

// *Створюємо константу, якій передаємо всі можливості плагіна gulp-cached
// TODO Цей плагін потрібен для того, щоб працювати з кешом
const newer = require('gulp-newer');


// *Функція для конвертації картинок у формат avif, якщо не підтримується то у формат webp ну і надалі у формат png 
// *Для запуску потрібно в терміналі написати gulp images або автоматичне надаштування далі
function images() {
    return src(['app/images/src/*.*', '!app/images/src/*.svg'])
    .pipe(newer('app/images/dist'))
    .pipe(avif({ quality: 50 }))

    .pipe(src('app/images/src/*.*'))
    .pipe(newer('app/images/dist'))
    .pipe(webp())
    
    .pipe(src('app/images/src/*.*'))
    .pipe(newer('app/images/dist'))
    .pipe(imagemin())

    .pipe(dest('app/images/dist'))
}
// *---------------------------------------------------------------------------------------


// *Функція для перекодування файла scss в файл css
// *Для запуску потрібно в терміналі написати gulp styles або автоматичне надаштування далі
function styles() {
    return src('app/scss/style.scss')
        .pipe(autoprefixer({overrideBrowserslist: ['last 10 version']}))
        .pipe(concat('style.min.css')) // Конкатинація всіх файлів та переіменування фінального
        .pipe(scss({outputStyle: 'compressed'})) // Перетворення файлу scss в css
        .pipe(dest('app/css')) // Збереження файлу в задану папку
        .pipe(browserSync.stream()) // Оновлюємо сторінку
}
// *---------------------------------------------------------------------------------------


// *Функція для зжимання файлів js
// *Для запуску потрібно в терміналі написати gulp scripts або автоматичне надаштування далі
function scripts() {
    return src([
        'app/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream()) // Оновлюємо сторінку
        
}
// *---------------------------------------------------------------------------------------


// *Функція для перекодування файла scss в файл css
// *Для запуску потрібно в терміналі написати gulp styles або автоматичне надаштування далі
function watching() {
    // *Функція для автоматичного оновення сторінки після змін у файлах
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
    // *===============================================================
    watch(['app/scss/style.scss'], styles)
    watch(['app/images/src'], images)
    watch(['app/js/main.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload)
}
// *---------------------------------------------------------------------------------------


// *Функція для видалення теки dist
function cleanDist() {
    return src('dist')
    .pipe(clean())
}
// *---------------------------------------------------------------------------------------


// *Функція для автоматичного відбору потрібних зжатих файлів та файлів html і збереження їх у вказане місце
function building() {
    return src([
        'app/css/style.min.css',
        'app/images/dist/*.*',
        'app/js/main.min.js',
        'app/**/*.html'
    ], {base: 'app'})
    .pipe(dest('dist'))
}
// *---------------------------------------------------------------------------------------


exports.styles = styles;
exports.images = images;
exports.scripts = scripts;
exports.watching = watching;

// *Запуск всіх функцій паралельно за допомогою плагіна gulp
exports.default = parallel(styles, images, scripts, watching);
// *--------------------------------------------------------

// *Автоматичне видалення теки dits та аново її створення та збереження туди зжатих файлів
exports.build = series(cleanDist, building);
// *--------------------------------------------------------