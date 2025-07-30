package com.cps.material.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.cps.material.model.MaterialAnalysis;

import java.util.Map;

public interface MaterialAnalysisService extends IService<MaterialAnalysis> {

    // 物料文件解析分页列表
    IPage<MaterialAnalysis> getMaterialAnalysisPage(MaterialAnalysis materialAnalysis, Long pageNum, Long pageSize);

}
