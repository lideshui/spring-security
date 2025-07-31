package com.cps.material.controller;

import com.cps.material.common.result.Result;
import com.cps.material.service.AuthService;
import com.cps.material.service.SysUserService;
import com.cps.material.vo.LoginUserVO;
import org.springframework.beans.factory.annotation.Autowired;
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
     * 用户登录接口，也可提供给PC端小程序端使用，返回 JWT Token
     */
    @PostMapping("/login")
    public Result<String> login(@RequestBody LoginUserVO loginUser, HttpServletRequest request) {
        String token = authService.login(loginUser.getUsername(), loginUser.getPassword(), request);
        return Result.ok(token);
    }

    /**
     * 用户退出系统
     */
    @GetMapping("/logout")
    public Result<String> logout(@RequestHeader("token") String token) throws Exception {
        authService.logout(token);
        return Result.ok("用户已退出系统");
    }

}
