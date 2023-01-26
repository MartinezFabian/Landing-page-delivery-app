// compilar Sass

//dependencias CSS Y Sass
const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

//dependencias Imagenes
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

function css(done) {
  // identificar archivo scss, luego compilarlo y por ultimo guardar el .css
  src("src/scss/app.scss")
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest("build/css"));

  done(); // indica que aqui acaba la tarea
}

//Tarea para tratamiento de imagenes
function images(done) {
  src("src/img/**/*")
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(dest("build/img"));

  done(); // indica que aqui acaba la tarea
}

//Tarea para convertir imagenes en webp
function convertToWebp(done) {
  const options = {
    quality: 50,
  };

  src("src/img/**/*.{png,jpg}").pipe(webp(options)).pipe(dest("build/img"));

  done();
}

//Tarea para convertir imagenes en avif
function convertToAvif(done) {
  const options = {
    quality: 50,
  };

  src("src/img/**/*.{png,jpg}").pipe(avif(options)).pipe(dest("build/img"));

  done();
}

// Watch

function dev() {
  //watch("ruta archivo que queremos que escuche", función a ejecutar si se produjo un cambio en el archivo);
  watch("src/scss/**/*.scss", css); //usamos un comodin para que busque todos los archivos .scss
  watch("src/img/**/*", images);
}

// exports.nombreParaLlamarTarea = nombreFuncion;
exports.css = css; //usamos exports para que sea ejecutable por Gulp
exports.dev = dev;
exports.images = images;
exports.convertToWebp = convertToWebp;
exports.convertToAvif = convertToAvif;

exports.default = series(images, convertToWebp, convertToAvif, css, dev);
