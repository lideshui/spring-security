package com.auth.security;

import cn.hutool.core.util.IdUtil;
import com.auth.config.RedisConst;
import com.auth.model.LoginUser;
import com.auth.model.SysUser;
import com.auth.service.SysUserRecordService;
import com.auth.service.SysUserService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private AuthenticationManager authenticationManager;

    @Resource
    private RedisTemplate redisTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    SysUserService sysUserService;

    @Autowired
    private SysUserRecordService sysUserRecordService;

    // JWT 签名密钥 从配置文件读取
    @Value("${jwt.secret}")
    private String secret;

    // 常量：用于在 JWT Claims 中存储用户唯一标识的 Key
    public static final String LOGIN_USER_KEY = "login_user_key";

    /**
     * 登录功能
     */
    public String login(String username, String password, HttpServletRequest request){
        // 1. 创建认证令牌
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);

        // 2. 执行认证
        Authentication authentication = authenticationManager.authenticate(authenticationToken);

        // 3. 认证通过后存入上下文
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 4. 获取用户信息
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();

        // 5. 记录登录日志
        sysUserRecordService.addUserRecord(loginUser, request);

        // 6. 返回生成的 JWT Token
        return createToken(loginUser);
    }

    /**
     * 创建用户登录令牌，生成的 JWT 令牌字符串
     */
    public String createToken(LoginUser loginUser) {
        // 1. 生成一个唯一的、用于标识本次登录会话的 UUID
        String sessionToken = IdUtil.fastUUID();
        loginUser.setToken(sessionToken);

        // 2. 刷新用户的登录时间和过期时间，并将 loginUser 对象存入 Redis
        refreshToken(loginUser);

        // 3. 构建 JWT 的 Claims
        Map<String, Object> claims = new HashMap<>();
        claims.put(LOGIN_USER_KEY, sessionToken);

        // 4. 生成并返回 JWT 字符串
        return createToken(claims);
    }

    /**
     * 刷新令牌有效期
     * 更新登录时间、计算新的过期时间，并将更新后的 loginUser 对象存入 Redis
     *
     * @param loginUser 用户验证信息
     */
    public void refreshToken(LoginUser loginUser) {
        // 1. 更新登录时间
        loginUser.setLoginTime(System.currentTimeMillis());
        // 2. 计算过期时间 (毫秒)
        loginUser.setExpireTime(loginUser.getLoginTime() + RedisConst.AUTH_TIMEOUT * 1000L); // 注意：RedisConst 是秒，这里转为毫秒
        // 3. 根据 token 生成 Redis Key (使用 RedisConst)
        String userKey = getTokenKey(loginUser.getToken());
        // 4. 将 loginUser 存入 Redis
        redisTemplate.opsForValue().set(userKey, loginUser);
        // 5. 单独设置过期时间 (使用 RedisConst 定义的秒数)
        redisTemplate.expire(userKey, RedisConst.AUTH_TIMEOUT, TimeUnit.SECONDS);
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
        Date expiryDate = new Date(nowMillis + RedisConst.AUTH_TIMEOUT * 1000L);

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
    public LoginUser getLoginUser(String requestToken) {
        LoginUser loginUser = null;
        try {
            if (requestToken != null && !requestToken.isEmpty()) {
                Claims claims = parseToken(requestToken);
                String token = (String) claims.get(LOGIN_USER_KEY);
                if (token != null) {
                    String userKey = getTokenKey(token);
                    // 从 Redis 获取 loginUser 对象
                    loginUser = (LoginUser) redisTemplate.opsForValue().get(userKey);
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
    public LoginUser checkToken(String requestToken) {
        LoginUser loginUser = getLoginUser(requestToken);
        if (loginUser != null) {
            // 检查 loginUser 对象自身的过期时间 (毫秒)
            if (System.currentTimeMillis() > loginUser.getExpireTime()) {
                // 已过期，清理 Redis
                String userKey = getTokenKey(loginUser.getToken());
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
        return RedisConst.AUTH_PREFIX + uuid + RedisConst.AUTH_SUFFIX;
    }

    /**
     * 强制注销用户（退出登录）
     * 删除 Redis 中的用户信息，使 Token 立即失效
     *
     * @param jwtToken 从 JWT Claims 中解析出的唯一标识 (fastUUID)
     */
    public void logout(String jwtToken) throws Exception {
        if (jwtToken != null && !jwtToken.isEmpty()) {
            Claims claims = parseToken(jwtToken);
            String token = (String) claims.get(LOGIN_USER_KEY);
            String cacheKey = getTokenKey(token);
            redisTemplate.delete(cacheKey);
        }
    }

    /**
     * 注册功能
     */
    public String register(SysUser user){
        // 1. 参数校验（你可扩展成完整校验）
        if (StringUtils.isBlank(user.getUserName()) || StringUtils.isBlank(user.getPassword())) {
            return "用户名和密码不能为空";
        }

        // 2. 查询用户名是否已存在
        SysUser existing = sysUserService.getByUserName(user.getUserName());
        if (existing != null) {
            return "用户名已存在";
        }

        // 3. 加密密码
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        // 4. 设置默认值
        user.setStatus(1); // 默认启用

        // 5. 保存用户
        boolean saved = sysUserService.save(user);
        return saved ? "注册成功" : "注册失败";
    }

}
