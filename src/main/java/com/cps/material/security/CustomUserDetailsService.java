package com.cps.material.security;

import com.cps.material.model.SysUser;
import com.cps.material.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private SysUserService sysUserService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. 从数据库查询用户
        SysUser sysUser = sysUserService.findByUsername(username);
        if (sysUser == null) {
            throw new UsernameNotFoundException("用户不存在");
        }

        // 2. 检查用户是否禁用
        if (sysUser.getStatus() == 1) {
            throw new DisabledException("用户已被禁用");
        }

        // 3. 构建权限列表（将 Role 的 code 转换为 Spring Security 的权限格式）
//        List<GrantedAuthority> authorities = user.getRoles().stream()
//                .map(role -> new SimpleGrantedAuthority(role.getCode()))
//                .collect(Collectors.toList());

        // 4. 返回 UserDetails 对象
        return org.springframework.security.core.userdetails.User.builder()
                .username(sysUser.getUserName())
                .password(sysUser.getPassword()) // 数据库应存储加密后的密码（如 BCrypt）
//                .authorities(authorities)
//                .disabled(!user.isEnabled())
                .build();
    }
}