package com.cps.material.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cps.material.model.MaterialInfo;
import java.util.List;

public interface MaterialInfoMapper extends BaseMapper<MaterialInfo> {

    // 查询物料信息
    List<MaterialInfo> selectMaterialListByExcel(List<String> productNameList);

}
