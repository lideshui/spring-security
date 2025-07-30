package com.cps.material.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cps.material.mapper.MaterialAnalysisMapper;
import com.cps.material.model.MaterialAnalysis;
import com.cps.material.service.MaterialAnalysisService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * 解析记录服务类
 */
@Service
public class MaterialAnalysisImplService extends ServiceImpl<MaterialAnalysisMapper, MaterialAnalysis> implements MaterialAnalysisService {



    // 解析记录分页
    @Override
    public IPage<MaterialAnalysis> getMaterialAnalysisPage(MaterialAnalysis materialAnalysis, Long pageNum, Long pageSize) {
        // 创建建分页对象
        IPage<MaterialAnalysis> iPage = new Page<>(pageNum, pageSize);

        // 查询分页数据
        LambdaQueryWrapper<MaterialAnalysis> queryWrapper = new LambdaQueryWrapper<>();
        if(materialAnalysis.getCode() != null && !StringUtils.isEmpty(materialAnalysis.getCode())){
            queryWrapper.like(MaterialAnalysis::getCode, materialAnalysis.getCode());
        }
        if(materialAnalysis.getFileName() != null && !StringUtils.isEmpty(materialAnalysis.getFileName())){
            queryWrapper.like(MaterialAnalysis::getFileName, materialAnalysis.getFileName());
        }
        if(materialAnalysis.getStatus() != null && !StringUtils.isEmpty(materialAnalysis.getStatus())){
            queryWrapper.eq(MaterialAnalysis::getStatus, materialAnalysis.getStatus());
        }

        // 根据最新更新日期排序
        queryWrapper.orderByDesc(MaterialAnalysis::getCreateTime);
        return page(iPage, queryWrapper);
    }

}
