// @APIVersion 1.0.0
// @Title BeegoAngularGulp API
// @Description API for management of BeegoAngularGulp
package routers

import (
	"github.com/astaxie/beego"
	"github.com/ogero/BeegoAngularGulp/controllers"
)

func init() {
	ns := beego.NewNamespace("/api",
		beego.NSNamespace("/user",
			beego.NSInclude(
				&controllers.ApiUserController{},
			),
		),
	)
	beego.AddNamespace(ns)
	beego.Router("/*", &controllers.MainController{})
}
