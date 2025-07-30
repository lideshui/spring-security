package com.cps.material.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.cps.material.model.MaterialInfo;

import java.util.List;
import java.util.Map;

public interface MaterialInfoService extends IService<MaterialInfo> {

    // 物料信息分页列表
    IPage<MaterialInfo> getMaterialInfoPage(Map<String, String> paramMap, Long pageNum, Long pageSize);

    // 查询物料信息
    List<MaterialInfo> selectMaterialListByExcel(List<String> productNameList);
}
