package com.auth.service.impl;

import com.auth.model.LoginUser;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.auth.common.util.UserAgentUtils;
import com.auth.mapper.SysUserRecordMapper;
import com.auth.model.SysUser;
import com.auth.model.SysUserRecord;
import com.auth.service.SysUserRecordService;
import org.springframework.stereotype.Service;
import javax.servlet.http.HttpServletRequest;

/**
 * 用户登录记录表 业务实现类
 */
@Service
public class SysUserRecordServiceImpl extends ServiceImpl<SysUserRecordMapper, SysUserRecord> implements SysUserRecordService {

    @Override
    public void addUserRecord(LoginUser loginUser, HttpServletRequest request) {
        // 创建登录记录对象
        SysUserRecord loginRecord = new SysUserRecord();

        // 设置登录基本信息
        SysUser sysUser = loginUser.getUser();
        loginRecord.setUserName(sysUser.getUserName());
        loginRecord.setUserId(sysUser.getId());

        // 获取用户环境信息
        String ip= UserAgentUtils.getIpAddress(request);
        String location = UserAgentUtils.getLocationByIp(ip);
        String os = UserAgentUtils.getOperatingSystem(request);
        String browser = UserAgentUtils.getBrowser(request);

        loginRecord.setIpaddr(ip);
        loginRecord.setLoginLocation(location);
        loginRecord.setOs(os);
        loginRecord.setBrowser(browser);
        loginRecord.setStatus(0);
        loginUser.setSysUserLogin(loginRecord);

        // 保存到数据库
        this.save(loginRecord);
    }
}
