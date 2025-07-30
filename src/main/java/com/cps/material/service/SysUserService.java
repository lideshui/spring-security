package com.cps.material.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cps.material.model.SysUser;

/**
 * 用户表 业务接口类
 */
public interface SysUserService extends IService<SysUser> {

    /**
     * 用户验证 验证用户名和密码是否正确
     */
    SysUser userAuth(SysUser sysUser);

}
