package com.auth;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication
@MapperScan("com.auth.mapper")
public class StartApp {
    public static void main(String[] args) {
        new SpringApplicationBuilder(StartApp.class).build().run(args);
    }
}
