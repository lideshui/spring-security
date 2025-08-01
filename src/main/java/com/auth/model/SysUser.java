package com.auth.model;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 用户表实体类
 */
@Data
@ApiModel(description = "用户表")
@TableName("sys_user")
public class SysUser extends BaseEntity {

    @ApiModelProperty(value = "用户名")
    @TableField("user_name")
    private String userName;

    @ApiModelProperty(value = "加密后的密码")
    @TableField("password")
    private String password;

    @ApiModelProperty(value = "昵称")
    @TableField("nick_name")
    private String nickName;

    @ApiModelProperty(value = "邮箱")
    @TableField("email")
    private String email;

    @ApiModelProperty(value = "手机号")
    @TableField("phone")
    private String phone;

    @ApiModelProperty(value = "状态：0禁用，1启用")
    @TableField("status")
    private Integer status;

    @ApiModelProperty(value = "权限")
    @TableField(exist = false)
    private String role;

    @ApiModelProperty(value = "缓存Token")
    @TableField(exist = false)
    private String cacheToken;

}