package com.auth.service;

import com.auth.model.LoginUser;
import com.baomidou.mybatisplus.extension.service.IService;
import com.auth.model.SysUserRecord;
import javax.servlet.http.HttpServletRequest;

/**
 * 用户表 业务接口类
 */
public interface SysUserRecordService extends IService<SysUserRecord> {

    /**
     * 记录登录用户
     */
    void addUserRecord(LoginUser loginUser, HttpServletRequest request);

}
