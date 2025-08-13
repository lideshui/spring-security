package com.auth.controller;

import com.auth.common.result.Result;
import com.auth.model.SysUser;
import com.auth.security.AuthService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

@RestController
@Api(tags = "鉴权API")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @ApiOperation("用户登录")
    public Result<String> login(@RequestBody SysUser user, HttpServletRequest request) {
        String token = authService.login(user.getUserName(), user.getPassword(), request);
        return Result.ok(token);
    }

    @GetMapping("/logout")
    @ApiOperation("用户退出")
    public Result<String> logout(@RequestHeader("token") String token) throws Exception {
        authService.logout(token);
        return Result.ok("用户已退出系统");
    }

    @PostMapping("/register")
    @ApiOperation("用户注册")
    public Result<String> register(@RequestBody SysUser sysUser) {
        String result = authService.register(sysUser);
        if("注册成功".equals(result)){
            return Result.ok(result);
        }else {
            return Result.fail(result);
        }
    }

    @GetMapping("/getLoginUser")
    @ApiOperation("获取当前登录用户信息")
    public Result getLoginUser(HttpServletRequest request) {
        for (Cookie cookie : request.getCookies()) {
            if ("token".equals(cookie.getName())) {
                return Result.ok(authService.getLoginUser(cookie.getValue()));
            }
        }
        return Result.fail("获取当前登录用户失败");
    }

}
