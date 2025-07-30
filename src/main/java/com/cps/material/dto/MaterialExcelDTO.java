package com.cps.material.dto;

import com.alibaba.excel.annotation.ExcelProperty;
import com.cps.material.model.MaterialInfo;
import lombok.Data;

import java.util.List;

@Data
public class MaterialExcelDTO {
    @ExcelProperty("序号")
    private Integer serialNumber;

    @ExcelProperty("系统号")
    private String systemNumber;

    @ExcelProperty("物料编码")
    private String materialCode;

    @ExcelProperty("品名")
    private String productName;

    @ExcelProperty("英文名称")
    private String englishName;

    @ExcelProperty("材质")
    private String material;

    @ExcelProperty("规格")
    private String specification;

    @ExcelProperty("品牌")
    private String brand;

    @ExcelProperty("单位")
    private String unit;

    @ExcelProperty("数量")
    private Double quantity;

    @ExcelProperty("货号")
    private String itemNumber;

    @ExcelProperty("交货期")
    private String deliveryDate;

    @ExcelProperty("处理后的物料编号对象")
    MaterialInfo materialInfo;

    @ExcelProperty("处理后的物料编号对象列表")
    List<MaterialInfo> materialList;
}