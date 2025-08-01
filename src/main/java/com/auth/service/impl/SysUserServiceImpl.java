package com.auth.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.auth.model.SysUser;
import com.auth.service.SysUserService;
import com.auth.mapper.SysUserMapper;
import org.springframework.stereotype.Service;

/**
 * 用户表 业务实现类
 */
@Service
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser> implements SysUserService {

    /**
     * 通过用户名查询用户（仅匹配 userName 字段）
     */
    @Override
    public SysUser getByUserName(String username) {
        // 直接查询 userName 字段
        LambdaQueryWrapper<SysUser> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(SysUser::getUserName, username);
        return this.getOne(queryWrapper);
    }
}
