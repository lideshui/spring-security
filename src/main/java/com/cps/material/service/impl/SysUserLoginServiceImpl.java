package com.cps.material.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cps.material.common.util.UserAgentUtils;
import com.cps.material.mapper.SysUserLoginMapper;
import com.cps.material.model.SysUser;
import com.cps.material.model.SysUserLogin;
import com.cps.material.service.SysUserLoginService;
import org.springframework.stereotype.Service;
import javax.servlet.http.HttpServletRequest;

/**
 * 用户登录记录表 业务实现类
 */
@Service
public class SysUserLoginServiceImpl extends ServiceImpl<SysUserLoginMapper, SysUserLogin> implements SysUserLoginService {

    @Override
    public SysUserLogin addLoginUser(SysUser sysUser, HttpServletRequest request) {
        // 创建登录记录对象
        SysUserLogin loginRecord = new SysUserLogin();

        // 设置登录基本信息
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

        // 保存到数据库
        this.save(loginRecord);
        return loginRecord;
    }
}
