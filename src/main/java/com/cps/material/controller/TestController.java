package com.cps.material.controller;

import com.cps.material.common.result.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Api(tags = "测试API")
@RequestMapping("/api")
public class TestController {

    @ApiOperation("测试接口")
    @PostMapping("/test")
    public Result<String> test() {
        return Result.ok("测试成功！");
    }
}
