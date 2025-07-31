package com.cps.material.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * MybatisPlus配置类
 *
 */
@EnableTransactionManagement
@Configuration
@MapperScan("com.cps.material.mapper")
public class MybatisPlusConfig {

    /**
     * 插件配置
     * 1.分页拦截器配置
     * MybatisPlusInterceptor 是 Mybatis-Plus 框架自定义拦截器的接口
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        //`addInnerInterceptor` 是 `MybatisPlusInterceptor` 接口中的方法，用于添加拦截器的内部拦截器
        //`DbType`: 表示数据库类型
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.POSTGRE_SQL));
        return interceptor;
    }
}
