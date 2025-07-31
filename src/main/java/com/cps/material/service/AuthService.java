package com.cps.material.service;

import cn.hutool.core.util.IdUtil;
import com.cps.material.config.RedisConst;
import com.cps.material.model.LoginUser;
import com.cps.material.model.SysUser;
import com.cps.material.model.SysUserLogin;
import com.cps.material.vo.LoginResultVO;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;
import javax.crypto.SecretKey;
import javax.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 令牌服务：负责创建、验证、刷新和管理用户登录令牌（Token）
 * 使用 RedisConst 定义的常量，并直接操作 RedisTemplate
 */
@Service
public class AuthService {

    @Resource
    private RedisTemplate redisTemplate;

    @Autowired
    private SysUserService sysUserService;

    @Autowired
    private SysUserLoginService sysUserLoginService;


    // JWT 签名密钥 从配置文件读取
    @Value("${jwt.secret}")
    private String secret;

    // 常量：用于在 JWT Claims 中存储用户唯一标识的 Key
    public static final String LOGIN_USER_KEY = "login_user_key";

    /**
     * 登录功能
     */
    public String login(String username, String password, HttpServletRequest request){
        // 登录结果对象
        LoginResultVO loginResult = new LoginResultVO();

        // 1.用户验证
        SysUser sysUser = sysUserService.userAuth(username, password);
        loginResult.setSysUser(sysUser);
        if(sysUser == null){
            return "用户名或密码错误";
        }

        // 2.登录日志记录
        SysUserLogin sysUserLogin = sysUserLoginService.addLoginUser(sysUser, request);
        loginResult.setSysUserLogin(sysUserLogin);

        // 3.创建并返回用户登录令牌 Token
        return createToken(loginResult);
    }

    /**
     * 登录日志记录
     */


    /**
     * 创建用户登录令牌，生成的 JWT 令牌字符串
     */
    public String createToken(LoginResultVO loginResult) {
        // 1. 生成一个唯一的、用于标识本次登录会话的 UUID
        String cacheToken = IdUtil.fastUUID();
        loginResult.setCacheToken(cacheToken);

        // 2. 刷新用户的登录时间和过期时间，并将 loginUser 对象存入 Redis
        refreshToken(loginResult);

        // 3. 构建 JWT 的 Claims
        Map<String, Object> claims = new HashMap<>();
        claims.put(LOGIN_USER_KEY, cacheToken);

        // 4. 生成并返回 JWT 字符串
        return createToken(claims);
    }

    /**
     * 刷新令牌有效期
     * 更新登录时间、计算新的过期时间，并将更新后的 loginUser 对象存入 Redis
     *
     * @param loginResult 登录用户信息
     */
    public void refreshToken(LoginResultVO loginResult) {
        // 1. 更新登录时间
        loginResult.setLoginTime(System.currentTimeMillis());
        // 2. 计算过期时间 (毫秒)
        loginResult.setExpireTime(loginResult.getLoginTime() + RedisConst.USER_LOGIN_TIMEOUT * 1000L); // 注意：RedisConst 是秒，这里转为毫秒
        // 3. 根据 token 生成 Redis Key (使用 RedisConst)
        String userKey = getTokenKey(loginResult.getCacheToken());
        // 4. 将 loginUser 对象存入 Redis
        redisTemplate.opsForValue().set(userKey, loginResult);
        // 5. 单独设置过期时间 (使用 RedisConst 定义的秒数)
        redisTemplate.expire(userKey, RedisConst.USER_LOGIN_TIMEOUT, TimeUnit.SECONDS);
    }

    /**
     * 根据数据声明（Claims）生成 JWT 令牌
     *
     * @param claims 数据声明
     * @return JWT 令牌字符串
     */
    private String createToken(Map<String, Object> claims) {
        // 加入密钥到 JWT Claims
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        // 加入签发时间和过期时间到 JWT Claims
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        Date expiryDate = new Date(nowMillis + RedisConst.USER_LOGIN_TIMEOUT * 1000L);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)  // 设置过期时间，双保险，即使 Redis 中未删除，JWT 本身也会失效
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * 从请求中获取 JWT Token
     *
     * @param request HTTP 请求
     * @return JWT Token 字符串，如果未找到则返回 null
     */
    public String getToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    /**
     * 根据 JWT Token 获取登录用户信息
     *
     * @param requestToken 从请求头提取的 JWT Token
     * @return LoginUser 对象，如果验证失败则返回 null
     */
    public LoginResultVO getLoginUser(String requestToken) {
        LoginResultVO loginUser = null;
        try {
            if (requestToken != null && !requestToken.isEmpty()) {
                Claims claims = parseToken(requestToken);
                String token = (String) claims.get(LOGIN_USER_KEY);
                if (token != null) {
                    String userKey = getTokenKey(token);
                    // 从 Redis 获取 loginUser 对象
                    System.out.println("==========================================userKeyyy " + userKey);
                    System.out.println("==========================================redisTemplate.opsForValue().get(userKey) " + redisTemplate.opsForValue().get(userKey));
                    loginUser = (LoginResultVO) redisTemplate.opsForValue().get(userKey);
                    System.out.println("==========================================Redis-LoginUser " + loginUser);
                }
            }
        } catch (ExpiredJwtException e) {
            e.printStackTrace();
            // Token过期
        } catch (UnsupportedJwtException | MalformedJwtException | SignatureException | IllegalArgumentException e) {
            e.printStackTrace();
            // Token不合法
        } catch (Exception e) {
            e.printStackTrace();
            // 解析 JWT 失败
            // log.warn("Token 解析失败: {}", e.getMessage());
        }
        return loginUser;
    }

    /**
     * 验证并检查 Token 有效性 (核心方法)
     *
     * @param requestToken 从请求头获取的 JWT Token
     * @return 如果验证通过并成功刷新，则返回 LoginUser；否则返回 null
     */
    public LoginResultVO checkToken(String requestToken) {
        LoginResultVO loginUser = getLoginUser(requestToken);
        if (loginUser != null) {
            // 检查 loginUser 对象自身的过期时间 (毫秒)
            if (System.currentTimeMillis() > loginUser.getExpireTime()) {
                // 已过期，清理 Redis
                String userKey = getTokenKey(loginUser.getToken());
                System.out.println("==========================================已过期，清理 Redis " + userKey);
                redisTemplate.delete(userKey);
                return null;
            }
            // 未过期，刷新 Redis 中的过期时间
            refreshToken(loginUser); // 这会更新 expireTime 并重新设置 Redis 过期
            return loginUser;
        }
        return null;
    }

    /**
     * 解析 JWT Token 字符串
     *
     * @param token JWT Token 字符串
     * @return Claims 对象
     * @throws Exception 如果解析失败
     */
    private Claims parseToken(String token) throws Exception {
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * 构建 Redis 缓存 Key
     * 使用 RedisConst 中定义的前缀和后缀
     *
     * @param uuid 唯一标识 (fastUUID)
     * @return Redis Key (格式: user:uuid:info)
     */
    private String getTokenKey(String uuid) {
        return LOGIN_USER_KEY + uuid;
    }

    /**
     * 强制注销用户（退出登录）
     * 删除 Redis 中的用户信息，使 Token 立即失效
     *
     * @param token 从 JWT Claims 中解析出的唯一标识 (fastUUID)
     */
    public void logout(String token) throws Exception {
        if (token != null && !token.isEmpty()) {
            Claims claims = parseToken(token);
            String token2 = (String) claims.get(LOGIN_USER_KEY);
            System.out.println("==============================1 " + token);
            System.out.println("==============================11 " + token2);
            String userKey = getTokenKey(token2);
            System.out.println("==============================2 " + userKey);
            redisTemplate.delete(userKey);
        }
    }



}
