package com.cps.material.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cps.material.mapper.MaterialInfoMapper;
import com.cps.material.model.MaterialInfo;
import com.cps.material.service.MaterialInfoService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

/**
 * 物料信息服务类
 */
@Service
public class MaterialInfoImplService extends ServiceImpl<MaterialInfoMapper, MaterialInfo> implements MaterialInfoService {

    @Resource
    private MaterialInfoMapper materialInfoMapper;

    // 物料分页
    @Override
    public IPage<MaterialInfo> getMaterialInfoPage(Map<String, String> paramMap, Long pageNum, Long pageSize) {
        // 创建建分页对象
        IPage<MaterialInfo> iPage = new Page<>(pageNum, pageSize);

        // 查询分页数据
        LambdaQueryWrapper<MaterialInfo> queryWrapper = new LambdaQueryWrapper<>();
        if(paramMap.get("number") != null && !StringUtils.isEmpty(paramMap.get("number"))){
            queryWrapper.eq(MaterialInfo::getNumber, paramMap.get("number"));
        }
        if(paramMap.get("descriptionFilter1") != null && !StringUtils.isEmpty(paramMap.get("descriptionFilter1"))){
            queryWrapper.like(MaterialInfo::getDescription, paramMap.get("descriptionFilter1"));
        }
        if(paramMap.get("descriptionFilter2") != null && !StringUtils.isEmpty(paramMap.get("descriptionFilter2"))){
            queryWrapper.like(MaterialInfo::getDescription, paramMap.get("descriptionFilter2"));
        }
        if(paramMap.get("descriptionFilter3") != null && !StringUtils.isEmpty(paramMap.get("descriptionFilter3"))){
            queryWrapper.like(MaterialInfo::getDescription, paramMap.get("descriptionFilter3"));
        }

        // 根据最新更新日期排序
        queryWrapper.orderByDesc(MaterialInfo::getUpdateTime);
        return page(iPage, queryWrapper);
    }

    @Override
    public List<MaterialInfo> selectMaterialListByExcel(List<String> productNameList) {
        return materialInfoMapper.selectMaterialListByExcel(productNameList);
    }
}
