package com.cps.material.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

@Api(tags = "前端页面接口")
@Controller
public class WebController {

    /**
     * 登录页
     */
    @ApiOperation("登录页")
    @GetMapping("/login")
    public String login(HttpServletRequest request, Model model) {
        // 获取所有的Cookie
        Cookie[] cookies = request.getCookies();
        boolean isLoggedIn = false;

        // 遍历Cookies查找指定的登录标志
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("login_flag".equals(cookie.getName())) {
                    if ("success_login".equals(cookie.getValue())) {
                        isLoggedIn = true;
                    }
                    break;
                }
            }
        }

        // 如果已经登录，则重定向到功能页
        if (isLoggedIn) {
            return "redirect:/";  // 重定向到功能页
        }

        return "login";  // 返回登录页面
    }

    /**
     * 首页
     */
    @ApiOperation("首页")
    @GetMapping({"/",  "/index",  "/index.html"})
    public String index(HttpServletRequest request, Model model) {
        // 获取所有的Cookie
        Cookie[] cookies = request.getCookies();
        boolean isLoggedIn = false;

        // 遍历Cookies查找指定的登录标志
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("login_flag".equals(cookie.getName())) {
                    if ("success_login".equals(cookie.getValue())) {
                        isLoggedIn = true;
                    }
                    break;
                }
            }
        }

        // 如果未登录，则重定向到登录页
        if (!isLoggedIn) {
            return "redirect:/login";  // 重定向到登录页面
        }

        return "index";  // 返回功能页面
    }


}
