package com.cps.material.model;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * 用户登录记录表实体类
 */
@ApiModel(description = "用户登录记录表")
@TableName("sys_user_login")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class SysUserLogin extends BaseEntity {

    @ApiModelProperty(value = "登录用户名")
    @TableField("user_name")
    private String userName;

    @ApiModelProperty(value = "登录用户ID")
    @TableField("user_id")
    private Long userId;

    @ApiModelProperty(value = "登录IP地址")
    @TableField("ipaddr")
    private String ipaddr;

    @ApiModelProperty(value = "登录地点")
    @TableField("login_location")
    private String loginLocation;

    @ApiModelProperty(value = "浏览器类型")
    @TableField("browser")
    private String browser;

    @ApiModelProperty(value = "操作系统")
    @TableField("os")
    private String os;

    @ApiModelProperty(value = "登录状态（0失败 1成功）")
    @TableField("status")
    private Integer status;

}
