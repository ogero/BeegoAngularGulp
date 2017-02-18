package components

import (
	"github.com/astaxie/beego"
	"github.com/ogero/BeegoAngularGulp/models"
)

type ApiBaseController struct {
	beego.Controller
	AuthUserId    string
	AuthUserToken string
}

func (c *ApiBaseController) CheckAuthorization() {
	c.AuthUserToken = c.Ctx.Request.Header.Get("Token")
	c.AuthUserId = models.AuthorizeUserToken(c.AuthUserToken)
	if c.AuthUserId == "" {
		c.CustomAbort(401, "Invalid Token")
	}
}