package com.cps.material.common.http;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * DeepSeek API 工具类
 */
@Slf4j
public class    DeepSeekApiUtil {

    private static final String BASE_URL = "https://api.deepseek.com/chat/completions";
    private static final String BALANCE_URL = "https://api.deepseek.com/user/balance";
    private static final String AUTHORIZATION_HEADER = "Bearer sk-fcb6d82d7d3d47a0bd89cd7776c17e69";

    /**
     * 发送请求到 DeepSeek API 并提取响应内容
     *
     * @param userMessage 用户消息内容
     * @return CompletableFuture<String> 异步返回的响应内容
     */
    public static CompletableFuture<String> sendRequest(String userMessage) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // 定义请求头
                Map<String, String> headers = new HashMap<>();
                headers.put("Content-Type", "application/json");
                headers.put("Authorization", AUTHORIZATION_HEADER);

                // 构建请求体
                Map<String, Object> requestBody = new HashMap<>();
                // requestBody.put("model", "deepseek-chat");
                requestBody.put("model", "deepseek-reasoner");

                // 消息列表
                List<Map<String, String>> messages = new ArrayList<>();
                Map<String, String> message = new HashMap<>();
                message.put("role", "user");
                message.put("content", userMessage);
                messages.add(message);

                requestBody.put("messages", messages);
                requestBody.put("stream", false);

                // 将 Map 转换为 JSON 字符串
                ObjectMapper objectMapper = new ObjectMapper();
                String jsonBody = objectMapper.writeValueAsString(requestBody);

                // 发送 POST 请求
                String response = HttpClientUtil.doPostJsonForDeepSeek(BASE_URL, headers, jsonBody);

                // 解析返回内容
                JSONObject jsonObject = new JSONObject(response);
                JSONArray choicesArray = jsonObject.getJSONArray("choices");
                if (choicesArray != null && !choicesArray.isEmpty()) {
                    JSONObject firstChoice = choicesArray.getJSONObject(0);
                    JSONObject messageObj = firstChoice.getJSONObject("message");
                    return messageObj.getStr("content");
                } else {
                    log.warn("未找到 choices 数据！");
                    return "未找到有效响应数据";
                }
            } catch (Exception e) {
                log.error("请求 DeepSeek API 失败: {}", e.getMessage(), e);
                throw new RuntimeException("请求 DeepSeek API 失败", e);
            }
        });
    }

    public static String sendAIRequest(String userMessage) {
        try {
            // 定义请求头
            Map<String, String> headers = new HashMap<>();
            headers.put("Content-Type", "application/json");
            headers.put("Authorization", AUTHORIZATION_HEADER);

            // 构建请求体
            Map<String, Object> requestBody = new HashMap<>();
            // requestBody.put("model", "deepseek-chat");
            requestBody.put("model", "deepseek-reasoner");

            // 消息列表
            List<Map<String, String>> messages = new ArrayList<>();
            Map<String, String> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", userMessage);
            messages.add(message);

            requestBody.put("messages", messages);
            requestBody.put("stream", false);

            // 将 Map 转换为 JSON 字符串
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonBody = objectMapper.writeValueAsString(requestBody);

            // 发送 POST 请求
            String response = HttpClientUtil.doPostJsonForDeepSeek(BASE_URL, headers, jsonBody);

            // 解析返回内容
            JSONObject jsonObject = new JSONObject(response);
            JSONArray choicesArray = jsonObject.getJSONArray("choices");
            if (choicesArray != null && !choicesArray.isEmpty()) {
                JSONObject firstChoice = choicesArray.getJSONObject(0);
                JSONObject messageObj = firstChoice.getJSONObject("message");
                return messageObj.getStr("content");
            } else {
                log.warn("未找到 choices 数据！");
                return "未找到有效响应数据";
            }
        } catch (Exception e) {
            log.error("请求 DeepSeek API 失败: {}", e.getMessage(), e);
            throw new RuntimeException("请求 DeepSeek API 失败", e);
        }

    }


    // 查询余额
    public static double getBalance() {
        double balance = 0;
        // 构建请求头
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Authorization", AUTHORIZATION_HEADER);
        // 构建请求参数
        Map<String, String> params = new HashMap<>();
        try {
            String result = HttpClientUtil.doGet(BALANCE_URL, headers, params);
            JSONObject jsonObject = new JSONObject(result);
            JSONArray info = jsonObject.getJSONArray("balance_infos");
            JSONObject balance_infos = info.getJSONObject(0);
            balance = balance_infos.getDouble("total_balance");
            log.info("=========================DeepSeek余额 {}", balance);
            return balance;
        } catch (Exception e) {
            log.error("请求 DeepSeek 查询余额失败: {}", e.getMessage(), e);
            throw new RuntimeException("请求 DeepSeek API 失败", e);
        }
    }

    public static void main(String[] args) {
        String trim = "单由令球形逆止阀(弹簧)".replaceAll("[（(][^）)]*[）)]", "").trim();
        System.out.println(123);
        System.out.println(trim);
    }
}