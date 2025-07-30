package com.cps.material.common.http;

import lombok.extern.slf4j.Slf4j;
import org.apache.http.*;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.*;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * HttpClient 工具类，封装了常用的 HTTP 请求方法（GET、POST、PUT、DELETE 等）。
 * 支持表单数据、JSON 数据、文件下载等操作。
 */
@Slf4j
public class HttpClientUtil {

    // 超时时间设置为 5000 毫秒（5 秒）
    private static final int TIMEOUT = 5000;

    /**
     * 创建一个带有默认配置的 HttpClient 实例。
     *
     * @return CloseableHttpClient 实例
     */
    private static CloseableHttpClient createHttpClient() {
        RequestConfig config = RequestConfig.custom()
                .setConnectTimeout(TIMEOUT) // 设置连接超时时间
                .setConnectionRequestTimeout(TIMEOUT) // 设置从连接池获取连接的超时时间
                .setSocketTimeout(TIMEOUT) // 设置读取数据的超时时间
                .build();

        return HttpClients.custom()
                .setDefaultRequestConfig(config) // 设置默认请求配置
                .build();
    }

    /**
     * 设置 HTTP 请求头。
     *
     * @param request HTTP 请求对象（如 HttpGet、HttpPost 等）
     * @param headers 请求头键值对
     */
    private static void setHeaders(HttpRequestBase request, Map<String, String> headers) {
        if (headers != null) {
            headers.forEach(request::addHeader); // 遍历并添加请求头
        }
    }

    /**
     * 处理 HTTP 响应。
     *
     * @param response HTTP 响应对象
     * @return 响应体内容（字符串形式）
     * @throws IOException 如果发生 I/O 错误
     */
    private static String handleResponse(CloseableHttpResponse response) throws IOException {
        try {
            int statusCode = response.getStatusLine().getStatusCode(); // 获取响应状态码
            if (statusCode == HttpStatus.SC_OK) { // 判断是否为 200 OK
                HttpEntity entity = response.getEntity(); // 获取响应实体
                return entity != null ? EntityUtils.toString(entity, StandardCharsets.UTF_8) : null; // 将实体转换为字符串
            } else {
                throw new IOException("HTTP error code: " + statusCode); // 抛出异常，包含错误状态码
            }
        } finally {
            if (response != null) {
                response.close(); // 确保响应对象被关闭，释放资源
            }
        }
    }

    /**
     * 发送 GET 请求。
     *
     * @param url     请求 URL
     * @param headers 请求头
     * @param params  查询参数
     * @return 响应体内容（字符串形式）
     * @throws IOException 如果发生 I/O 错误
     */
    public static String doGet(String url, Map<String, String> headers, Map<String, String> params) throws IOException {
        setRequestParam(params);
        if (params != null && !params.isEmpty()) {
            StringBuilder sb = new StringBuilder(url);
            sb.append("?"); // 构造查询参数字符串
            for (Map.Entry<String, String> entry : params.entrySet()) {
                sb.append(entry.getKey()).append("=").append(entry.getValue()).append("&");
            }
            url = sb.substring(0, sb.length() - 1); // 去掉最后一个多余的 "&"
        }

        HttpGet request = new HttpGet(url); // 创建 GET 请求对象
        setHeaders(request, headers); // 设置请求头

        log.info("[HTTP-REQUEST] 成功调用 HttpClientUtil 发送请求接口 {} {}", url, headers);
        try (CloseableHttpClient client = createHttpClient()) {
            return handleResponse(client.execute(request)); // 执行请求并处理响应
        }
    }

    /**
     * 发送 POST 请求（表单格式）。
     *
     * @param url        请求 URL
     * @param headers    请求头
     * @param formParams 表单参数
     * @return 响应体内容（字符串形式）
     * @throws IOException 如果发生 I/O 错误
     */
    public static String doPostForm(String url, Map<String, String> headers, Map<String, String> formParams) throws IOException {
        HttpPost post = new HttpPost(url); // 创建 POST 请求对象
        setHeaders(post, headers); // 设置请求头

        if (formParams != null && !formParams.isEmpty()) {
            List<NameValuePair> params = new ArrayList<>(); // 构造表单参数列表
            for (Map.Entry<String, String> entry : formParams.entrySet()) {
                params.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
            }
            post.setEntity(new UrlEncodedFormEntity(params, StandardCharsets.UTF_8)); // 设置表单实体
        }

        try (CloseableHttpClient client = createHttpClient()) {
            return handleResponse(client.execute(post)); // 执行请求并处理响应
        }
    }

    /**
     * 发送 POST 请求（JSON 格式）。
     *
     * @param url      请求 URL
     * @param headers  请求头
     * @param jsonBody JSON 格式的请求体
     * @return 响应体内容（字符串形式）
     * @throws IOException 如果发生 I/O 错误
     */
    public static String doPostJson(String url, Map<String, String> headers, String jsonBody) throws IOException {
        HttpPost post = new HttpPost(url); // 创建 POST 请求对象
        setHeaders(post, headers); // 设置请求头
        post.setHeader("Content-Type", "application/json"); // 设置 Content-Type 为 JSON
        post.setEntity(new StringEntity(jsonBody, StandardCharsets.UTF_8)); // 设置 JSON 请求体

        try (CloseableHttpClient client = createHttpClient()) {
            return handleResponse(client.execute(post)); // 执行请求并处理响应
        }
    }

    /**
     * 发送 PUT 请求（JSON 格式）。
     *
     * @param url      请求 URL
     * @param headers  请求头
     * @param jsonBody JSON 格式的请求体
     * @return 响应体内容（字符串形式）
     * @throws IOException 如果发生 I/O 错误
     */
    public static String doPutJson(String url, Map<String, String> headers, String jsonBody) throws IOException {
        HttpPut put = new HttpPut(url); // 创建 PUT 请求对象
        setHeaders(put, headers); // 设置请求头
        put.setHeader("Content-Type", "application/json"); // 设置 Content-Type 为 JSON
        put.setEntity(new StringEntity(jsonBody, StandardCharsets.UTF_8)); // 设置 JSON 请求体

        try (CloseableHttpClient client = createHttpClient()) {
            return handleResponse(client.execute(put)); // 执行请求并处理响应
        }
    }

    /**
     * 发送 PUT 请求（表单格式）。
     *
     * @param url        请求 URL
     * @param headers    请求头
     * @param formParams 表单参数
     * @return 响应体内容（字符串形式）
     * @throws IOException 如果发生 I/O 错误
     */
    public static String doPutForm(String url, Map<String, String> headers, Map<String, String> formParams) throws IOException {
        HttpPut put = new HttpPut(url); // 创建 PUT 请求对象
        setHeaders(put, headers); // 设置请求头

        if (formParams != null && !formParams.isEmpty()) {
            List<NameValuePair> params = new ArrayList<>(); // 构造表单参数列表
            for (Map.Entry<String, String> entry : formParams.entrySet()) {
                params.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
            }
            put.setEntity(new UrlEncodedFormEntity(params, StandardCharsets.UTF_8)); // 设置表单实体
        }

        try (CloseableHttpClient client = createHttpClient()) {
            return handleResponse(client.execute(put)); // 执行请求并处理响应
        }
    }

    /**
     * 发送 DELETE 请求（无请求体）。
     *
     * @param url     请求 URL
     * @param headers 请求头
     * @return 响应体内容（字符串形式）
     * @throws IOException 如果发生 I/O 错误
     */
    public static String doDelete(String url, Map<String, String> headers) throws IOException {
        HttpDelete delete = new HttpDelete(url); // 创建 DELETE 请求对象
        setHeaders(delete, headers); // 设置请求头

        try (CloseableHttpClient client = createHttpClient()) {
            return handleResponse(client.execute(delete)); // 执行请求并处理响应
        }
    }

    /**
     * 发送 DELETE 请求（带请求体）。
     *
     * @param url      请求 URL
     * @param headers  请求头
     * @param jsonBody JSON 格式的请求体
     * @return 响应体内容（字符串形式）
     * @throws IOException 如果发生 I/O 错误
     */
    public static String doDeleteWithBody(String url, Map<String, String> headers, String jsonBody) throws IOException {
        HttpDeleteWithBody delete = new HttpDeleteWithBody(url); // 创建自定义 DELETE 请求对象
        setHeaders(delete, headers); // 设置请求头
        delete.setHeader("Content-Type", "application/json"); // 设置 Content-Type 为 JSON
        delete.setEntity(new StringEntity(jsonBody, StandardCharsets.UTF_8)); // 设置 JSON 请求体

        try (CloseableHttpClient client = createHttpClient()) {
            return handleResponse(client.execute(delete)); // 执行请求并处理响应
        }
    }

    /**
     * 下载文件。
     *
     * @param url      文件的下载地址
     * @param headers  请求头
     * @param savePath 文件保存路径
     * @return 是否下载成功
     */
    public static boolean downloadFile(String url, Map<String, String> headers, String savePath) {
        HttpGet get = new HttpGet(url); // 创建 GET 请求对象
        setHeaders(get, headers); // 设置请求头

        try (CloseableHttpClient client = createHttpClient();
             CloseableHttpResponse response = client.execute(get);
             InputStream in = response.getEntity().getContent(); // 获取响应输入流
             FileOutputStream out = new FileOutputStream(savePath)) { // 创建文件输出流

            byte[] buffer = new byte[1024]; // 缓冲区大小
            int len;
            while ((len = in.read(buffer)) != -1) { // 循环读取数据
                out.write(buffer, 0, len); // 写入文件
            }
            return true; // 下载成功
        } catch (IOException e) {
            e.printStackTrace(); // 打印异常信息
            return false; // 下载失败
        }
    }

    /**
     * 下载文件，通过浏览器响应直接下载文件。
     * @param url 文件下载的 URL
     * @param headers 请求头
     * @param response HttpServletResponse 用于发送响应给浏览器
     */
    public static void downloadFileByBrowser(String url, Map<String, String> headers, HttpServletResponse response) {
        HttpGet get = new HttpGet(url); // 创建 GET 请求对象
        setHeaders(get, headers); // 设置请求头

        try (CloseableHttpClient client = createHttpClient();
             CloseableHttpResponse httpResponse = client.execute(get)) {

            // 获取响应实体
            HttpEntity entity = httpResponse.getEntity();
            if (entity == null) {
                throw new IOException("Empty response from server");
            }

            // 从响应头中获取文件名
            String fileName = getFileNameFromHeaders(httpResponse);
            if (fileName == null || fileName.isEmpty()) {
                // 如果响应头中没有文件名，则使用URL中的文件名作为后备方案
                fileName = url.substring(url.lastIndexOf("/") + 1);
            }

            // 从响应头中获取内容类型
            String contentType = httpResponse.getFirstHeader("Content-Type") != null
                    ? httpResponse.getFirstHeader("Content-Type").getValue()
                    : "application/octet-stream";

            // 设置响应头
            response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
            response.setContentType(contentType);
            response.setContentLengthLong(entity.getContentLength());

            // 输出文件内容到浏览器
            try (InputStream in = entity.getContent();
                 OutputStream out = response.getOutputStream()) {
                byte[] buffer = new byte[1024]; // 缓冲区
                int len;
                while ((len = in.read(buffer)) != -1) { // 循环读取数据
                    out.write(buffer, 0, len); // 写入浏览器输出流
                }
                out.flush(); // 刷新输出流，确保文件内容完全写入浏览器
            }
        } catch (IOException e) {
            log.error("文件下载失败", e); // 错误日志
            throw new RuntimeException("文件下载失败", e);
        }
    }

    /**
     * 从响应头中提取文件名
     * @param response HTTP响应
     * @return 文件名
     */
    private static String getFileNameFromHeaders(HttpResponse response) {
        // 1. 尝试从Content-Disposition头获取文件名
        Header contentDisposition = response.getFirstHeader("Content-Disposition");
        if (contentDisposition != null) {
            String value = contentDisposition.getValue();
            if (value != null && value.contains("filename=")) {
                // 处理filename*=UTF-8''格式
                if (value.startsWith("filename*=")) {
                    String[] parts = value.split("'");
                    if (parts.length > 1) {
                        return parts[1];
                    }
                }
                // 处理filename=格式
                String[] parts = value.split(";");
                for (String part : parts) {
                    part = part.trim();
                    if (part.startsWith("filename=")) {
                        String fileName = part.substring(part.indexOf('=') + 1).trim();
                        // 去除可能的引号
                        if (fileName.startsWith("\"") && fileName.endsWith("\"")) {
                            fileName = fileName.substring(1, fileName.length() - 1);
                        }
                        return fileName;
                    }
                }
            }
        }

        // 2. 尝试从Content-Type头获取文件名（某些API可能会这样返回）
        Header contentType = response.getFirstHeader("Content-Type");
        if (contentType != null) {
            String value = contentType.getValue();
            if (value != null && value.contains("name=")) {
                String[] parts = value.split(";");
                for (String part : parts) {
                    part = part.trim();
                    if (part.startsWith("name=")) {
                        return part.substring(part.indexOf('=') + 1).trim();
                    }
                }
            }
        }

        return null;
    }

    /**
     * 自定义 HttpDeleteWithBody 类，用于支持带请求体的 DELETE 请求。
     */
    private static class HttpDeleteWithBody extends HttpEntityEnclosingRequestBase {
        public static final String METHOD_NAME = "DELETE"; // 定义 HTTP 方法名称为 DELETE

        /**
         * 构造函数。
         *
         * @param uri 请求 URI
         */
        public HttpDeleteWithBody(String uri) {
            super();
            setURI(URI.create(uri)); // 设置请求 URI
        }

        /**
         * 获取 HTTP 方法名称。
         *
         * @return HTTP 方法名称（DELETE）
         */
        @Override
        public String getMethod() {
            return METHOD_NAME;
        }
    }

    /**
     * 过滤下为null的无效参数
     * @param params
     * @return
     */
    public static Map<String, String> setRequestParam(Map<String, String> params){
        // 使用迭代器删除值为 null 或空字符串的条目
        Iterator<Map.Entry<String, String>> iterator = params.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, String> entry = iterator.next();
            if (entry.getValue() == null || entry.getValue().isEmpty()) {
                iterator.remove();
            }
        }
        return params;
    }

    /**
     * 专为 DeepSeek 使用的 POST 请求方法。
     * 设置超时时间为 10 秒，并实现三次重试机制。
     *
     * @param url      请求 URL
     * @param headers  请求头
     * @param jsonBody JSON 格式的请求体
     * @return 响应体内容（字符串形式）
     * @throws IOException 如果最终所有重试均失败，则抛出异常
     */
    public static String doPostJsonForDeepSeek(String url, Map<String, String> headers, String jsonBody) throws IOException {
        // 超时时间设置为 5 分钟
        final int TIMEOUT = 60000 * 10;
        final int MAX_RETRIES = 2; // 最大重试次数

        RequestConfig config = RequestConfig.custom()
                .setConnectTimeout(TIMEOUT) // 设置连接超时时间
                .setConnectionRequestTimeout(TIMEOUT) // 设置从连接池获取连接的超时时间
                .setSocketTimeout(TIMEOUT) // 设置读取数据的超时时间
                .build();

        CloseableHttpClient client = HttpClients.custom()
                .setDefaultRequestConfig(config) // 设置默认请求配置
                .build();

        int retryCount = 0;
        boolean success = false;
        String responseBody = null;

        while (retryCount < MAX_RETRIES && !success) {
            try {
                HttpPost post = new HttpPost(url); // 创建 POST 请求对象
                setHeaders(post, headers); // 设置请求头
                post.setHeader("Content-Type", "application/json"); // 设置 Content-Type 为 JSON
                post.setEntity(new StringEntity(jsonBody, StandardCharsets.UTF_8)); // 设置 JSON 请求体

                try (CloseableHttpResponse response = client.execute(post)) {
                    int statusCode = response.getStatusLine().getStatusCode(); // 获取响应状态码
                    if (statusCode == HttpStatus.SC_OK) { // 判断是否为 200 OK
                        HttpEntity entity = response.getEntity(); // 获取响应实体
                        responseBody = entity != null ? EntityUtils.toString(entity, StandardCharsets.UTF_8) : null; // 将实体转换为字符串
                        success = true; // 标记请求成功
                        log.info("[DeepSeek-POST] 请求成功: {}", url);
                    } else {
                        throw new IOException("HTTP error code: " + statusCode); // 抛出异常，包含错误状态码
                    }
                }
            } catch (Exception e) {
                retryCount++;
                if (retryCount >= MAX_RETRIES) {
                    log.error("[DeepSeek-POST] 请求失败，已达到最大重试次数。URL: {}, 错误信息: {}", url, e.getMessage());
                    throw e; // 如果达到最大重试次数，抛出异常
                } else {
                    log.warn("[DeepSeek-POST] 请求失败，正在重试... 当前尝试次数: {}", retryCount);
                }
            }
        }

        return responseBody;
    }
}