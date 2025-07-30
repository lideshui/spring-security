package com.cps.material.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cps.material.common.result.Result;
import com.cps.material.common.util.IpUtil;
import com.cps.material.common.util.JwtTokenUtil;
import com.cps.material.config.RedisConst;
import com.cps.material.mapper.UserInfoMapper;
import com.cps.material.model.UserInfo;
import com.cps.material.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.concurrent.TimeUnit;

/**
 * 用户表 业务实现类
 */

@Service
public class UserInfoServiceImpl extends ServiceImpl<UserInfoMapper, UserInfo> implements UserInfoService {

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * 用户登录接口，也可提供给PC端小程序端使用
     * 1. 先根据用户认证信息查询该用户是否存在
     * 2. 若用户存在-生成用户令牌(UUID等) 将令牌信息 (token等) 存入Redis
     * 3. 按照前端要求响应登录结果 token nickName
     *
     * @param loginUser
     */
    @Override
    public Result login(UserInfo loginUser, HttpServletRequest request) {
        // 1.验证用户名、密码
        UserInfo userInfo = this.userAuth(loginUser);
        if (userInfo == null) {
            return Result.fail().message("用户名或者密码错误!");
        }

        // 2.刷新令牌有效期，并写入缓存
        String token = this.refreshToken(userInfo);

        // 3.记录登录信息
        String ipAddress = IpUtil.getIpAddress(request);
        // 根据IP获取用户所在城市。这里先写死，需要调用第三方SDK，比如百度API⚠️
        HashMap<String, String> userRedis = new HashMap<>();
        userRedis.put("userId", userInfo.getId().toString());
        userRedis.put("ip", ipAddress);
        userRedis.put("city", "北京市");

        // 4.按照前端要求响应登录结果 token nickName
        HashMap<String, String> loginResult = new HashMap<>();
        loginResult.put("token", token);
        loginResult.put("nickName", userInfo.getNickName());
        return Result.ok(loginResult);
    }

    /**
     * 退出系统 只需要将存储在Redis中的token删除即可
     *
     * @param token
     */
    @Override
    public void logout(String token) {
        String redisKey = "user:login:" + token;
        redisTemplate.delete(redisKey);
    }

    /**
     * 用户验证 验证用户名和密码是否正确
     */
    @Override
    public UserInfo userAuth(UserInfo loginUser){
        // 根据用户认证信息 账号(手机号,邮箱,用户名称)跟密码 查询用户记录-判断用户是否存在
        // 对用户提交密码进行MD5加密
        String userPwd = DigestUtils.md5DigestAsHex(loginUser.getPasswd().getBytes());

        // 构建查询条件
        LambdaQueryWrapper<UserInfo> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(UserInfo::getPasswd, userPwd);

        //参数wrapper是当前的查询对象，分别根据名字或邮箱或电话登陆⚠️⚠️⚠️
        queryWrapper.and(wrapper -> {
            wrapper.or().eq(UserInfo::getPhoneNum, loginUser.getLoginName())
                    .or().eq(UserInfo::getEmail, loginUser.getLoginName())
                    .or().eq(UserInfo::getLoginName, loginUser.getLoginName());
        });

        //根据查询对象获取查询结果
        return this.getOne(queryWrapper);
    }

    /**
     * 刷新令牌有效期，并写入缓存
     */
    private String refreshToken(UserInfo loginUser){
        // 获取Token
        String token = jwtTokenUtil.generateToken(loginUser.getLoginName());

        // 写入缓存
        String userKey = RedisConst.USER_LOGIN_PREFIX + token + RedisConst.USER_LOGIN_SUFFIX;
        redisTemplate.opsForValue().set(userKey, loginUser, RedisConst.USER_LOGIN_TIMEOUT, TimeUnit.SECONDS);
        return token;
    }


}
