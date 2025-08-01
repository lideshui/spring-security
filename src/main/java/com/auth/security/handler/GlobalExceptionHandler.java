package com.auth.security.handler;

import com.auth.common.result.Result;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BadCredentialsException.class)
    public Result<?> handleBadCredentials(BadCredentialsException ex) {
        return Result.fail("用户名或密码错误").code(401);
    }

    @ExceptionHandler(DisabledException.class)
    public Result<?> handleDisabledUser(DisabledException ex) {
        return Result.fail("账号已被禁用").code(403);
    }

    @ExceptionHandler(Exception.class)
    public Result<?> handleOther(Exception ex) {
        return Result.fail("系统异常：" + ex.getMessage()).code(500);
    }
}
