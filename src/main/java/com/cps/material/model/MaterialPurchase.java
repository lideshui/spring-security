package com.cps.material.model;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import java.util.List;

@Data
@ApiModel(description = "物料记录")
@TableName("material_purchase")
public class MaterialPurchase extends BaseEntity {

    @ExcelIgnore
    @ApiModelProperty(value = "文件解析ID")
    private Long analysisId;

    @ExcelProperty("序号")
    @ApiModelProperty(value = "序号")
    private String serialNumber;

    @ExcelProperty("系统号")
    @ApiModelProperty(value = "系统号")
    private String systemNumber;

    @ExcelProperty("物料编码")
    @ApiModelProperty(value = "物料编号")
    private String materialCode;

    @ExcelProperty("品名")
    @ApiModelProperty(value = "品名")
    private String productName;

    @ExcelProperty("英文名称")
    @ApiModelProperty(value = "英文名称")
    private String englishName;

    @ExcelProperty("材质")
    @ApiModelProperty(value = "材质")
    private String material;

    @ExcelProperty("规格")
    @ApiModelProperty(value = "规格")
    private String specification;

    @ExcelProperty("品牌")
    @ApiModelProperty(value = "品牌")
    private String brand;

    @ExcelProperty("单位")
    @ApiModelProperty(value = "单位")
    private String unit;

    @ExcelProperty("数量")
    @ApiModelProperty(value = "数量")
    private String quantity;

    @ExcelProperty("货号")
    @ApiModelProperty(value = "货号")
    private String itemNumber;

    @ExcelProperty("交货期")
    @ApiModelProperty(value = "交货期")
    private String deliveryDate;

    @ExcelIgnore
    @ApiModelProperty(value = "物料JSON")
    private String materialJson;

    @ExcelIgnore
    @ApiModelProperty(value = "状态")
    private Integer status;

    @ExcelIgnore
    @TableField(exist = false)
    @ApiModelProperty(value = "解析文件编号")
    private String code;

    @ExcelIgnore
    @TableField(exist = false)
    @ApiModelProperty(value = "物料描述")
    private String description;

    @ExcelIgnore
    @TableField(exist = false)
    @ApiModelProperty(value = "文件名称")
    private String fileName;

    @ExcelIgnore
    @TableField(exist = false)
    @ApiModelProperty(value = "处理后的物料编号对象列表")
    List<MaterialInfo> materialList;

}
