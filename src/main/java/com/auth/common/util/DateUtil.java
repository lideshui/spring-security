package com.auth.common.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 日期类
 */
public class DateUtil {

    public static String getCurrentWatermark() {
        // 获取当前时间
        LocalDateTime now = LocalDateTime.now();

        // 定义日期时间格式（不含毫秒）
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        // 格式化日期时间部分
        String dateTimePart = now.format(formatter);

        // 获取毫秒部分
        int millis = now.getNano() / 1_000;

        // 组合成完整水印
        return dateTimePart + millis;
    }

    public static void main(String[] args) {
        System.out.println(getCurrentWatermark()); // 输出示例：20250629155630123
    }
}
