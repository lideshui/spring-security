package com.cps.material.common.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import eu.bitwalker.useragentutils.UserAgent;
import javax.servlet.http.HttpServletRequest;
import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * 解析客户端信息类
 */
@Slf4j
public class UserAgentUtils {

    /**
     * 获取客户端真实 IP 地址（适用于常规 Servlet 请求）
     */
    public static String getIpAddress(HttpServletRequest request) {
        String ip = getHeaderIp(
                request.getHeader("x-forwarded-for"),
                request.getHeader("Proxy-Client-IP"),
                request.getHeader("WL-Proxy-Client-IP"),
                request.getRemoteAddr()
        );

        if ("127.0.0.1".equals(ip) || "::1".equals(ip)) {
            try {
                ip = InetAddress.getLocalHost().getHostAddress();
            } catch (UnknownHostException e) {
                log.error("获取本地 IP 异常", e);
            }
        }

        return trimMultiIp(ip);
    }

    /**
     * 网关中获取 IP 地址（适用于 Spring Cloud Gateway）
     */
    public static String getGatwayIpAddress(ServerHttpRequest request) {
        HttpHeaders headers = request.getHeaders();

        String ip = getHeaderIp(
                headers.getFirst("x-forwarded-for"),
                headers.getFirst("Proxy-Client-IP"),
                headers.getFirst("WL-Proxy-Client-IP"),
                headers.getFirst("HTTP_CLIENT_IP"),
                headers.getFirst("HTTP_X_FORWARDED_FOR"),
                headers.getFirst("X-Real-IP"),
                request.getRemoteAddress() != null ? request.getRemoteAddress().getAddress().getHostAddress() : null
        );
        return trimMultiIp(ip);
    }

    /**
     * 从多个可能的头中选一个有效 IP
     */
    private static String getHeaderIp(String... candidates) {
        for (String ip : candidates) {
            if (StringUtils.isNotBlank(ip) && !"unknown".equalsIgnoreCase(ip)) {
                return ip;
            }
        }
        return "";
    }

    /**
     * 多重代理的情况下只取第一个 IP
     */
    private static String trimMultiIp(String ip) {
        if (ip != null && ip.length() > 15 && ip.contains(",")) {
            return ip.split(",")[0];
        }
        return ip;
    }

    /**
     * 获取操作系统
     */
    public static String getOperatingSystem(HttpServletRequest request) {
        UserAgent userAgent = getUserAgent(request);
        return userAgent.getOperatingSystem().getName();
    }

    /**
     * 获取浏览器
     */
    public static String getBrowser(HttpServletRequest request) {
        UserAgent userAgent = getUserAgent(request);
        return userAgent.getBrowser().getName();
    }

    private static UserAgent getUserAgent(HttpServletRequest request) {
        String ua = request.getHeader("User-Agent");
        return UserAgent.parseUserAgentString(ua);
    }

    /**
     * 获取 IP 所在地（可集成纯真、高德、百度等）
     */
    public static String getLocationByIp(String ip) {
        // 示例返回固定值，建议接入 IP 归属地服务
        return "江苏省苏州市（示例）";
    }
}