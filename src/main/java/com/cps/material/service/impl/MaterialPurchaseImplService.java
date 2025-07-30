package com.cps.material.service.impl;

import cn.hutool.core.collection.CollectionUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cps.material.mapper.MaterialPurchaseMapper;
import com.cps.material.model.MaterialInfo;
import com.cps.material.model.MaterialPurchase;
import com.cps.material.service.MaterialPurchaseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 物料采购服务类
 */
@Slf4j
@Service
public class MaterialPurchaseImplService extends ServiceImpl<MaterialPurchaseMapper, MaterialPurchase> implements MaterialPurchaseService {

    @Resource
    private MaterialPurchaseMapper materialPurchaseMapper;

    // 解析记录分页
    @Override
    public IPage<MaterialPurchase> getMaterialPurchasePage(MaterialPurchase materialPurchase, Long pageNum, Long pageSize) {
        // 创建分页对象
        Page<MaterialPurchase> page = new Page<>(pageNum, pageSize);
        // 直接调用 Mapper 分页查询
        return materialPurchaseMapper.selectPageList(page, materialPurchase);
    }

    // 根据品名过滤
    @Override
    public void filterByProductName(List<MaterialPurchase> excelList){
        excelList.stream().filter(excel -> excel.getProductName() != null).forEach(excel->{
            List<MaterialInfo> materialList = excel.getMaterialList();
            // 先尝试精准匹配
            List<MaterialInfo> materialFilterResult = new ArrayList<>();
            materialFilterResult = materialList.stream()
                .filter(materialInfo -> materialInfo.getDescription().contains(
                    excel.getProductName()
                            .replaceAll("[（(][^）)]*[）)]", "").trim()
                            .replaceAll("弹簧垫圈", "弹簧垫片")
                            .replaceAll("异径补芯", "补芯")
                )).collect(Collectors.toList());
            // 精准匹配结果太少再考虑模块匹配
            if(materialFilterResult.size() < 50){
                materialFilterResult = fuzzyMatch(excel.getProductName(), materialList);
            }
            excel.setMaterialList(materialFilterResult);
            log.info("================================品名过滤 {} {}", excel.getProductName(), excel.getMaterialList().size());
        });
    }

    // 根据品牌过滤
    @Override
    public void filterByBrand(List<MaterialPurchase> excelList){
        excelList.stream().filter(excel -> excel.getBrand() != null).forEach(excel->{
            List<MaterialInfo> materialList = excel.getMaterialList();
            List<MaterialInfo> filterList = materialList.stream()
                    // 法兰垫片不参与匹配
                    .filter(materialInfo -> materialInfo.getDescription().contains(excel.getBrand()) && !"法兰垫片".equals(excel.getProductName()))
                    .collect(Collectors.toList());
            if(CollectionUtil.isNotEmpty(filterList)){
                excel.setMaterialList(filterList);
            }
            log.info("================================品牌过滤 {} {}", excel.getProductName(), excel.getMaterialList().size());
        });
    }

    // 根据材质过滤
    @Override
    public void filterByMaterial(List<MaterialPurchase> excelList){
        excelList.stream().filter(excel -> excel.getMaterial() != null).forEach(excel->{
            List<MaterialInfo> materialList = excel.getMaterialList();
            List<MaterialInfo> filterList = materialList.stream()
                    .filter(materialInfo -> materialInfo.getDescription().contains(
                            excel.getMaterial()
                            .replaceAll("/", ",")
                    ))
                    .collect(Collectors.toList());
            if(CollectionUtil.isNotEmpty(filterList)){
                excel.setMaterialList(filterList);
            }
            log.info("================================材质过滤 {} {}", excel.getProductName(), excel.getMaterialList().size());
        });
    }

    // AI调用统计
    @Override
    public List<Map<String, Object>> getRecent15DaysFullData() {
        return materialPurchaseMapper.selectRecent15DaysFullData();
    }

    // 语意匹配
    private List<MaterialInfo> fuzzyMatch(String productName, List<MaterialInfo> MaterialInfoList) {
        List<MaterialInfo> resultList = new ArrayList<>();
        List<String> productNameList = Arrays.asList(productName.split(""));

        MaterialInfoList.forEach(materialInfo->{
            List<String> materialDescriptionList = Arrays.asList(materialInfo.getDescription().split(""));
            long matchCount = productNameList.stream().filter(materialDescriptionList::contains).count();
            // 至少有50%以上的字符能匹配，或者匹配数 >= 某阈值
            double ratio = matchCount * 1.0 / productNameList.size();
            if(ratio >= 0.75 || matchCount >= 3){
                resultList.add(materialInfo);
            }
        });
        return resultList;
    }

}
