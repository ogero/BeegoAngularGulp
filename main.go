package main

import (
	"os"
	"github.com/astaxie/beego"
	_ "github.com/ogero/BeegoAngularGulp/routers"
	"github.com/ogero/BeegoAngularGulp/components"
)

func main() {
	runModeOverride := os.Getenv("BEEGO_RUNMODE")
	if runModeOverride != "" {
		beego.BConfig.RunMode = runModeOverride
	}

	isDev := beego.BConfig.RunMode == "dev"
	if isDev {
		beego.BConfig.WebConfig.DirectoryIndex = true
		beego.BConfig.WebConfig.StaticDir["/swagger"] = "swagger"
	}
	components.AssetsPacker(true, !isDev, isDev, []string{"static/app", "static/css"}, "(?:js|css|scss)$")
	beego.Run()
}
