package com.auth.config;

import com.alibaba.druid.pool.DruidDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * Druid数据源配置类，用于配置Druid数据库连接池的属性。
 */
@Configuration
public class DruidProperties {

    // 初始化时建立物理连接的个数
    @Value("${spring.datasource.druid.initialSize}")
    private int initialSize;

    // 数据库连接池中最小的空闲连接数
    @Value("${spring.datasource.druid.minIdle}")
    private int minIdle;

    // 数据库连接池中最大的活动连接数
    @Value("${spring.datasource.druid.maxActive}")
    private int maxActive;

    // 获取连接时最大等待时间，单位毫秒。配置了maxWait之后，缺省启用公平锁，并发量大的话建议设置为true
    @Value("${spring.datasource.druid.maxWait}")
    private int maxWait;

    // 两次空闲连接回收器执行之间间隔的毫秒数
    @Value("${spring.datasource.druid.timeBetweenEvictionRunsMillis}")
    private int timeBetweenEvictionRunsMillis;

    // 连接在池中保持空闲而不被逐出的最小时间
    @Value("${spring.datasource.druid.minEvictableIdleTimeMillis}")
    private int minEvictableIdleTimeMillis;

    // 连接在池中保持空闲而不被逐出的最大时间
    @Value("${spring.datasource.druid.maxEvictableIdleTimeMillis}")
    private int maxEvictableIdleTimeMillis;

    // 用来检测连接是否有效的sql语句，要求是一个查询语句，常用select 'x'
    @Value("${spring.datasource.druid.validationQuery}")
    private String validationQuery;

    // 建议配置为true，不影响性能，并且保证安全性。申请连接的时候检测，如果空闲时间大于timeBetweenEvictionRunsMillis，执行validationQuery检测连接是否有效
    @Value("${spring.datasource.druid.testWhileIdle}")
    private boolean testWhileIdle;

    // 申请连接时执行validationQuery检测连接是否有效，做了这个配置会降低性能
    @Value("${spring.datasource.druid.testOnBorrow}")
    private boolean testOnBorrow;

    // 归还连接时执行validationQuery检测连接是否有效，做了这个配置会降低性能
    @Value("${spring.datasource.druid.testOnReturn}")
    private boolean testOnReturn;

    /**
     * 配置Druid数据源。
     *
     * @param datasource Druid数据源实例
     * @return 配置好的Druid数据源实例
     */
    public DruidDataSource dataSource(DruidDataSource datasource) {
        /** 配置初始化大小 */
        datasource.setInitialSize(initialSize); // 初始化时建立物理连接的个数
        datasource.setMaxActive(maxActive); // 数据库连接池中最大的活动连接数
        datasource.setMinIdle(minIdle); // 数据库连接池中最小的空闲连接数

        /** 配置获取连接等待超时的时间 */
        datasource.setMaxWait(maxWait); // 获取连接时最大等待时间，单位毫秒

        /** 配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒 */
        datasource.setTimeBetweenEvictionRunsMillis(timeBetweenEvictionRunsMillis); // 两次空闲连接回收器执行之间间隔的毫秒数

        /** 配置一个连接在池中最小、最大生存的时间，单位是毫秒 */
        datasource.setMinEvictableIdleTimeMillis(minEvictableIdleTimeMillis); // 连接在池中保持空闲而不被逐出的最小时间
        datasource.setMaxEvictableIdleTimeMillis(maxEvictableIdleTimeMillis); // 连接在池中保持空闲而不被逐出的最大时间

        /**
         * 用来检测连接是否有效的sql，要求是一个查询语句，常用select 'x'。
         * 如果validationQuery为null，testOnBorrow、testOnReturn、testWhileIdle都不会起作用。
         */
        datasource.setValidationQuery(validationQuery); // 用来检测连接是否有效的sql语句

        /**
         * 建议配置为true，不影响性能，并且保证安全性。
         * 申请连接的时候检测，如果空闲时间大于timeBetweenEvictionRunsMillis，执行validationQuery检测连接是否有效。
         */
        datasource.setTestWhileIdle(testWhileIdle); // 申请连接时是否检测空闲连接的有效性

        /**
         * 申请连接时执行validationQuery检测连接是否有效，做了这个配置会降低性能。
         */
        datasource.setTestOnBorrow(testOnBorrow); // 申请连接时是否检测连接的有效性

        /**
         * 归还连接时执行validationQuery检测连接是否有效，做了这个配置会降低性能。
         */
        datasource.setTestOnReturn(testOnReturn); // 归还连接时是否检测连接的有效性

        return datasource; // 返回配置好的Druid数据源实例
    }
}