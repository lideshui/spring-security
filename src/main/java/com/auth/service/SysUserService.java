package com.auth.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.auth.model.SysUser;

/**
 * 用户表 业务接口类
 */
public interface SysUserService extends IService<SysUser> {

    /**
     * 通过用户名搜索用户
     */
    SysUser getByUserName(String username);

}
