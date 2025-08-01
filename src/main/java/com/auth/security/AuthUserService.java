package com.auth.security;

import com.auth.model.LoginUser;
import com.auth.model.SysUser;
import com.auth.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

/**
 * 用户验证处理
 */
@Service
public class AuthUserService implements UserDetailsService {

    @Autowired
    private SysUserService sysUserService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. 从数据库查询用户
        SysUser sysUser = sysUserService.getByUserName(username);
        if (sysUser == null) {
            throw new UsernameNotFoundException("用户名 " + username + " 不存在");
        }

        // 2. 检查用户是否禁用
        if (sysUser.getStatus() == 0) {
            throw new DisabledException("账号已禁用，请联系管理员");
        }

        // 3. 返回 UserDetails 对象
        return createLoginUser(sysUser);
    }

    public UserDetails createLoginUser(SysUser sysUser) {
        LoginUser loginUser = new LoginUser();
        loginUser.setUser(sysUser);
        loginUser.setUserId(sysUser.getId());

        // todo 从数据库或缓存中加载权限
        // Set<String> permissions = sysPermissionService.getUserPermissions(sysUser.getId());
        // loginUser.setPermissions(permissions);
        return loginUser;
    }

}