package com.cps.material.controller;

import com.cps.material.common.result.Result;
import com.cps.material.vo.User;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Api(tags = "鉴权API")
@RequestMapping("/api")
public class LoginController {

    @ApiOperation("登录")
    @PostMapping("/login")
    public Result<String> login(@RequestBody User user) {
        // 获取用户名和密码
        String username = user.getUsername();
        String password = user.getPassword();
        if("cps".equals(username) && "cps123".equals(password)) {
            return Result.ok("登录成功！");
        }else {
            return Result.fail("登录失败，用户名或密码错误！");
        }
    }
}
