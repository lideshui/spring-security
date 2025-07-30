package com.cps.material.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.cps.material.model.MaterialPurchase;
import java.util.List;
import java.util.Map;

public interface MaterialPurchaseService extends IService<MaterialPurchase> {

    // 物料记录分页列表
    IPage<MaterialPurchase> getMaterialPurchasePage(MaterialPurchase materialPurchase, Long page, Long limit);

    // 根据品名过滤
    void filterByProductName(List<MaterialPurchase> excelList);

    // 根据品牌过滤
    void filterByBrand(List<MaterialPurchase> excelList);

    // 根据材质过滤
    void filterByMaterial(List<MaterialPurchase> excelList);

    // AI调用统计
    List<Map<String, Object>> getRecent15DaysFullData();

}
