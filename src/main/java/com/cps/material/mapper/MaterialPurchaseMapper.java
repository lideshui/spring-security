package com.cps.material.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.cps.material.model.MaterialPurchase;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

public interface MaterialPurchaseMapper extends BaseMapper<MaterialPurchase> {

    // 分页查询
    IPage<MaterialPurchase> selectPageList(IPage<MaterialPurchase> page, @Param("param") MaterialPurchase materialPurchase);

    // AI调用统计
    @Select("SELECT to_char(d.day, 'MM-DD') AS date, COALESCE(t.value, 0) AS value " +
            "FROM generate_series(CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE, INTERVAL '1 day') d(day) " +
            "LEFT JOIN ( " +
            "  SELECT DATE(create_time) AS day, COUNT(*) AS value " +
            "  FROM material_purchase " +
            "  WHERE create_time >= CURRENT_DATE - INTERVAL '14 days' " +
            "  GROUP BY DATE(create_time) " +
            ") t ON d.day = t.day " +
            "ORDER BY d.day")
    List<Map<String, Object>> selectRecent15DaysFullData();

}
