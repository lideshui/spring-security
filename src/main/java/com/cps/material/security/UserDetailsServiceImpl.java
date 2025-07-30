//package com.cps.material.security;
//
//import com.orca.msg.service.ISysUserService;
//import com.ruoyi.common.constant.Constants;
//import com.ruoyi.common.core.domain.entity.SysUser;
//import com.ruoyi.common.core.domain.model.LoginUser;
//import com.ruoyi.common.enums.UserStatus;
//import com.ruoyi.common.exception.ServiceException;
//import com.ruoyi.common.utils.StringUtils;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//
///**
// * 用户验证处理
// *
// * @author ruoyi
// */
//@Service
//public class UserDetailsServiceImpl implements UserDetailsService
//{
//    private static final Logger log = LoggerFactory.getLogger(UserDetailsServiceImpl.class);
//
//    @Autowired
//    private ISysUserService userService;
//
//    @Autowired
//    private SysPermissionService permissionService;
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
//    {
//        SysUser user = userService.selectUserByUserName(username);
//        if (StringUtils.isNull(user))
//        {
//            log.info("登录用户：{} 不存在.", username);
//            throw new ServiceException("登录用户：" + username + " 不存在");
//        }
//        else if (UserStatus.DELETED.getCode().equals(user.getDelFlag()))
//        {
//            log.info("登录用户：{} 已被删除.", username);
//            throw new ServiceException("对不起，您的账号：" + username + " 已被删除");
//        }
//        else if (UserStatus.DISABLE.getCode().equals(user.getStatus()))
//        {
//            log.info("登录用户：{} 已被停用.", username);
//            throw new ServiceException("对不起，您的账号：" + username + " 已停用");
//        }
//
//        return createLoginUser(user);
//    }
//
//    public UserDetails createLoginUser(SysUser user)
//    {
//        user.setProjectId(Optional.ofNullable(user.getProjectId()).orElse(Constants.DEFAULT_PROJECT_ID));
//        return new LoginUser(user.getUserId(), user.getDeptId(), user.getProjectId(), user, permissionService.getMenuPermission(user));
//    }
//}
