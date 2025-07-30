package com.cps.material;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication
@MapperScan("com.cps.material.mapper")
public class StartApp {
    public static void main(String[] args) {
        new SpringApplicationBuilder(StartApp.class).build().run(args);
    }
}
