# Beego + Angular + Gulp

This is a demo that shows how to use Beego with Angular.

## Requirements
- [GoLang](https://golang.org/dl/) (Only tested on `go version go1.7.3`)
- [Glide](https://github.com/Masterminds/glide/releases) as a dependency manager. Binary must reside in PATH env var.  
- [Bee Tool](https://github.com/beego/bee/releases) for BeeGo development. Binary must reside in PATH env var.  
- [NodeJS & NPM](https://nodejs.org) Needed for [Gulp](https://webpack.github.io/) and JS dependencies (angular, jquery, materializecss, etc)
- Gulp `npm install -g gulp` for assets packing. Global install is a must for gulp.  

### Run Locally
1. This application uses [Glide](https://glide.sh/) as a dependency manager for Go    
`glide install` will vendor all required go packages for you  
2. [BeeGo](https://beego.me/docs/intro/) development is aided by [Bee Tool](https://beego.me/docs/install/bee.md) `bee run -runmode=dev -downdoc=true -gendoc=true`  
3. Navigate App: [http://localhost:9090/](http://localhost:9090/)  
   Navigate Swagger: [http://localhost:9090/swagger](http://localhost:9090/swagger)  

### Watchers & Automatic respawn
Bee Tool attachs a file watcher that matches all go files in project, so a rebuild (app / apidoc) and launch will be performed on code changes.
Also, on `main.go`, another filewatcher is setup to match all JS, CSS and SASS files, which fires `gulp` for assets packing when changed.  
Notes: Bee watcher package (bee tool v1.6.2) had a [bug](https://github.com/beego/bee/issues/351) that could fail to trigger the rebuild process on file changes, if needed, check [patched binaries](https://spaces.hightail.com/space/PUZwR).

### Pack for deployment
Packing with Bee tool `bee pack -exp=.:node_modules -f=zip`  
Packing excluding node_modules (will be fetch on run) `bee pack -f=zip`  