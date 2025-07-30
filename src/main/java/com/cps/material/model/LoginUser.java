package com.cps.material.model;

import com.alibaba.fastjson2.annotation.JSONField;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;
import java.util.Set;

@Data
@ApiModel(description = "登录用户对象")
@TableName("login_user")
public class LoginUser extends BaseEntity implements UserDetails {

    @ApiModelProperty(value = "用户ID")
    private String loginName;

    @ApiModelProperty(value = "用户ID")
    private String passwd;

    @ApiModelProperty(value = "用户ID")
    private Long userId;

    @ApiModelProperty(value = "部门ID")
    private Long deptId;

    @ApiModelProperty(value = "鉴权Token")
    private String token;

    @ApiModelProperty(value = "登录时间")
    private Long loginTime;

    @ApiModelProperty(value = "过期时间")
    private Long expireTime;

    @ApiModelProperty(value = "登录IP地址")
    private String ipaddr;

    @ApiModelProperty(value = "登录地点")
    private String loginLocation;

    @ApiModelProperty(value = "浏览器类型")
    private String browser;

    @ApiModelProperty(value = "操作系统")
    private String os;

    @ApiModelProperty(value = "权限列表")
    private Set<String> permissions;

    @ApiModelProperty(value = "用户信息")
    private UserInfo user;

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
