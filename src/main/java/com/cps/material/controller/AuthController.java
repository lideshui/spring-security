package com.cps.material.controller;

import com.cps.material.common.result.Result;
import com.cps.material.common.util.JwtTokenUtil;
import com.cps.material.model.LoginRequest;
import com.cps.material.model.LoginResponse;
import com.cps.material.model.LoginUser;
import com.cps.material.model.UserInfo;
import com.cps.material.service.AuthService;
import com.cps.material.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserInfoService userInfoService;

    @Autowired
    private AuthService authService;

    /**
     * 用户登录接口，也可提供给PC端小程序端使用
     *
     * @param loginUser
     */
    @PostMapping("/passport/login")
    public Result login(@RequestBody LoginUser loginUser, HttpServletRequest request){
        // 用户认证逻辑
        UserInfo authUser = new UserInfo();
        authUser.setLoginName(loginUser.getLoginName());
        authUser.setPasswd(loginUser.getPasswd());
        UserInfo userInfo = userInfoService.userAuth(authUser);
        if (userInfo != null) {
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
    @GetMapping("/passport/logout")
    public Result logout(@RequestHeader("token") String token){
        userInfoService.logout(token);
        return Result.ok();
    }


    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {
        // 认证用户名密码
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()));

        // 生成 Token
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
        String token = jwtTokenUtil.generateToken(userDetails.getUsername());
        return new LoginResponse(token);
    }
}
