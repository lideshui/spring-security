package com.cps.material.vo;

import com.alibaba.fastjson2.annotation.JSONField;
import com.cps.material.model.SysUser;
import com.cps.material.model.SysUserLogin;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;

@ApiModel(value = "LoginResultVO", description = "登录结果类")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResultVO implements UserDetails {

    @ApiModelProperty(value = "鉴权Token")
    private String token;

    @ApiModelProperty(value = "登录时间")
    private Long loginTime;

    @ApiModelProperty(value = "过期时间")
    private Long expireTime;

    @ApiModelProperty(value = "缓存Token")
    private String cacheToken;

    @ApiModelProperty(value = "缓存Key")
    private String cacheKey;


    @ApiModelProperty(value = "用户对象")
    private SysUser sysUser;

    @ApiModelProperty(value = "用户登录记录对象")
    private SysUserLogin sysUserLogin;

    @JSONField(serialize = false)
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    @JSONField(serialize = false)
    @Override
    public String getPassword() {
        return "";
    }

    @JSONField(serialize = false)
    @Override
    public String getUsername() {
        return "";
    }

    @JSONField(serialize = false)
    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    @JSONField(serialize = false)
    @Override
    public boolean isAccountNonLocked() {
        return false;
    }

    @JSONField(serialize = false)
    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }

    @JSONField(serialize = false)
    @Override
    public boolean isEnabled() {
        return false;
    }
}
