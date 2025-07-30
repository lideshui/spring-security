package com.cps.material.service;


import com.baomidou.mybatisplus.extension.service.IService;
import com.cps.material.common.result.Result;
import com.cps.material.model.UserInfo;
import javax.servlet.http.HttpServletRequest;

/**
 * 用户表 业务接口类
 */

public interface UserInfoService extends IService<UserInfo> {

    /**
     * 用户登录接口，也可提供给PC端小程序端使用
     *
     * @param loginUser
     */
    Result login(UserInfo loginUser, HttpServletRequest request);

    /**
     * 用户退出系统
     *
     * @param token
     */
    void logout(String token);

    UserInfo userAuth(UserInfo loginUser);
}
