package com.cps.material.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cps.material.model.SysUser;
import com.cps.material.model.SysUserLogin;
import javax.servlet.http.HttpServletRequest;

/**
 * 用户表 业务接口类
 */
public interface SysUserLoginService extends IService<SysUserLogin> {

    /**
     * 记录登录用户
     */
    SysUserLogin addLoginUser(SysUser sysUser, HttpServletRequest request);

}
