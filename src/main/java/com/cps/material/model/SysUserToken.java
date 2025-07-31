package com.cps.material.model;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import java.util.Date;

/**
 * 用户Token记录表 实体类
 */
@ApiModel(description = "用户Token记录表")
@TableName("sys_user_token")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class SysUserToken extends BaseEntity {

    @ApiModelProperty(value = "用户ID")
    @TableField("user_id")
    private Long userId;

    @ApiModelProperty(value = "JWT Token")
    @TableField("token")
    private String token;

    @ApiModelProperty(value = "客户端标识（如：web, app）")
    @TableField("client_id")
    private String clientId;

    @ApiModelProperty(value = "登录IP地址")
    @TableField("ip_address")
    private String ipAddress;

    @ApiModelProperty(value = "登录时间")
    @TableField("login_time")
    private Date loginTime;

    @ApiModelProperty(value = "Token过期时间")
    @TableField("expire_time")
    private Date expireTime;

    @ApiModelProperty(value = "是否有效（1=有效，0=已登出）")
    @TableField("is_active")
    private Integer isActive;
}
