package com.auth.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletRequest;

@Slf4j
@Api(tags = "前端页面接口")
@Controller
public class WebController {

    @ApiOperation("登录页")
    @GetMapping("/login")
    public String login(HttpServletRequest request, Model model) {
        return "login";  // 返回登录页面
    }

    @ApiOperation("注册页")
    @GetMapping("/register")
    public String register(HttpServletRequest request, Model model) {
        return "register";  // 返回登录页面
    }

    @ApiOperation("首页")
    @GetMapping({"/"})
    public String index(HttpServletRequest request, Model model) {
        return "index";  // 返回功能页面
    }

}
