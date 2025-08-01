package com.auth.config;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.spring.boot.autoconfigure.DruidDataSourceBuilder;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.sql.DataSource;

/**
 * Druid 多数据源配置类
 *
 * 这个配置类用于在Spring Boot应用中配置Druid连接池的多数据源支持。
 * Druid是一个开源的数据库连接池，支持多种数据库，并提供了强大的监控和扩展功能。
 */
@Configuration
public class DruidConfig {

    /**
     * 配置主数据源
     *
     * 此方法用于配置应用的主数据源。它使用了`@ConfigurationProperties`注解来绑定`spring.datasource.druid.master`前缀的配置属性。
     * 这些属性包括数据库URL、用户名、密码等，它们将用于初始化`DruidDataSource`对象。
     *
     * @param druidProperties Druid配置属性类，包含了初始化数据源所需的方法。
     * @return 配置好的主数据源`DataSource`对象。
     */
    @Bean
    @ConfigurationProperties("spring.datasource.druid.master")
    public DataSource masterDataSource(DruidProperties druidProperties) {
        // 使用DruidDataSourceBuilder创建一个DruidDataSource实例，然后通过druidProperties中的配置方法初始化它。
        DruidDataSource dataSource = DruidDataSourceBuilder.create().build();
        return druidProperties.dataSource(dataSource); // 返回配置好的数据源
    }

    /**
     * 条件性地配置从数据源
     *
     * 此方法用于配置应用的从数据源（或称为读写分离中的读库）。它使用了`@ConditionalOnProperty`注解来确保只有在
     * `spring.datasource.druid.slave.enabled`属性被设置为`true`时，才会创建和配置从数据源。
     *
     * 同样的，它使用`@ConfigurationProperties`注解来绑定`spring.datasource.druid.slave`前缀的配置属性。
     *
     * @param druidProperties Druid配置属性类，包含了初始化数据源所需的方法。
     * @return 如果条件满足，返回配置好的从数据源`DataSource`对象；否则不创建此Bean。
     */
    @Bean
    @ConfigurationProperties("spring.datasource.druid.slave")
    @ConditionalOnProperty(prefix = "spring.datasource.druid.slave", name = "enabled", havingValue = "true")
    public DataSource slaveDataSource(DruidProperties druidProperties) {
        // 使用DruidDataSourceBuilder创建一个DruidDataSource实例，然后通过druidProperties中的配置方法初始化它。
        DruidDataSource dataSource = DruidDataSourceBuilder.create().build();
        return druidProperties.dataSource(dataSource); // 返回配置好的数据源
    }
}