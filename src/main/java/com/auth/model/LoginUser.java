package com.auth.model;

import com.alibaba.fastjson2.annotation.JSONField;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;
import java.util.Set;

@Data
@ApiModel(description = "登录用户身份权限")
public class LoginUser implements UserDetails {

    @ApiModelProperty(value = "用户ID")
    private Long userId;

    @ApiModelProperty(value = "部门ID")
    private Long deptId;

    @ApiModelProperty(value = "用户唯一标识")
    private String token;

    @ApiModelProperty(value = "登录时间")
    private Long loginTime;

    @ApiModelProperty(value = "过期时间")
    private Long expireTime;

    @ApiModelProperty(value = "权限列表")
    private Set<String> permissions;

    @ApiModelProperty(value = "用户信息")
    private SysUser user;

    @ApiModelProperty(value = "用户信息")
    private SysUserRecord sysUserLogin;


    @JSONField(serialize = false)
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 如果接入权限系统，这里可以返回权限列表
        return Collections.emptyList();
    }

    @JSONField(serialize = false)
    @Override
    public String getUsername() {
        return user != null ? user.getUserName() : null;
    }

    @JSONField(serialize = false)
    @Override
    public String getPassword() {
        return user != null ? user.getPassword() : null;
    }

    @JSONField(serialize = false)
    @Override
    public boolean isAccountNonExpired() {
        return true; // 账号不过期
    }

    @JSONField(serialize = false)
    @Override
    public boolean isAccountNonLocked() {
        return true; // 关键：返回true，否则报"User account is locked"
    }

    @JSONField(serialize = false)
    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 凭证（密码）不过期
    }

    @JSONField(serialize = false)
    @Override
    public boolean isEnabled() {
        return user != null && user.getStatus() == 1; // 用户状态：1 表示启用
    }
}
