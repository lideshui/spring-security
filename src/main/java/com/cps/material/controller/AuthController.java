package com.cps.material.controller;

import com.cps.material.common.result.Result;
import com.cps.material.model.SysUser;
import com.cps.material.service.AuthService;
import com.cps.material.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private SysUserService sysUserService;

    @Autowired
    private AuthService authService;

    /**
     * 用户登录接口，也可提供给PC端小程序端使用
     */
    @PostMapping("/login")
    public Result login(@RequestBody SysUser sysUser, HttpServletRequest request){
        // 用户认证逻辑
        SysUser loginUser = sysUserService.userAuth(sysUser);
        if (loginUser != null) {
            return Result.ok(authService.createToken(loginUser));
        }else {
            return Result.fail().message("用户名或密码错误");
        }
    }

    /**
     * 用户退出系统
     *
     * @param token
     */
    @GetMapping("/logout")
    public Result logout(@RequestHeader("token") String token){
        userInfoService.logout(token);
        return Result.ok();
    }


}
