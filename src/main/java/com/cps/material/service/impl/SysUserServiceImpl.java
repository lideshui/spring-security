package com.cps.material.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cps.material.model.SysUser;
import com.cps.material.service.SysUserService;
import mapper.SysUserMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

/**
 * 用户表 业务实现类
 */
@Service
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser> implements SysUserService {

    /**
     * 用户验证 验证用户名和密码是否正确
     */
    @Override
    public SysUser userAuth(SysUser sysUser){
        // 根据用户认证信息 账号(手机号,邮箱,用户名称)跟密码 查询用户记录-判断用户是否存在
        // 对用户提交密码进行MD5加密
        String passwordMd5 = DigestUtils.md5DigestAsHex(sysUser.getPassword().getBytes());

        // 构建查询条件
        LambdaQueryWrapper<SysUser> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(SysUser::getPassword, passwordMd5);

        //参数wrapper是当前的查询对象，分别根据名字或邮箱或电话登陆
        queryWrapper.and(wrapper -> {
            wrapper.or().eq(SysUser::getUserName, sysUser.getUserName())
                    .or().eq(SysUser::getEmail, sysUser.getUserName())
                    .or().eq(SysUser::getPhone, sysUser.getPhone());
        });

        //根据查询对象获取查询结果
        return this.getOne(queryWrapper);
    }
}
