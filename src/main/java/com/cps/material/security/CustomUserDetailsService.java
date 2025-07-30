package com.cps.material.security;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 这里可以从数据库查，这里写死用户名密码为 admin/123456
        if ("admin".equals(username)) {
            return User.builder()
                    .username("admin")
                    .password("{noop}123456") // {noop}表示明文密码（不加密）
                    .authorities("ROLE_USER")
                    .build();
        }
        throw new UsernameNotFoundException("用户不存在");
    }
}
