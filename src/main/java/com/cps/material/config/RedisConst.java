package com.cps.material.config;

/**
 * Redis常量配置类
 */
public class RedisConst {

    // 请求报文缓存信息格式
    public static final String REQUEST_MESSAGE_PREFIX = "request:";
    public static final long REQUEST_MESSAGE_TIMEOUT = 24 * 60 * 60; // 单位：秒
    public static final String REQUEST_MESSAGE_SUFFIX = ":message";

    // 响应报文缓存信息格式
    public static final String RESPONSE_MESSAGE_PREFIX = "response:";
    public static final long RESPONSE_MESSAGE_TIMEOUT = 24 * 60 * 60; // 单位：秒
    public static final String RESPONSE_MESSAGE_SUFFIX = ":message";

    // 数采结果缓存格式
    public static final String ACQUISITION_REQUEST_PREFIX = "acquisition:";
    public static final long ACQUISITION_REQUEST_TIMEOUT = 3 * 60; // 单位：秒
    public static final String ACQUISITION_REQUEST_SUFFIX = ":result";

    // 鉴权信息缓存格式
    public static final String AUTH_KEY = "auth:";
    public static final String AUTH_PREFIX = "auth:";
    public static final long AUTH_TIMEOUT = 24 * 60 * 60;
    public static final String AUTH_SUFFIX = ":info";
}
