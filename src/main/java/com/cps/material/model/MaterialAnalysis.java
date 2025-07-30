package com.cps.material.model;

import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel(description = "物料文件解析")
@TableName("material_analysis")
public class MaterialAnalysis extends BaseEntity {

    @ApiModelProperty(value = "解析编号")
    private String code;

    @ApiModelProperty(value = "文件名称")
    private String fileName;

    @ApiModelProperty(value = "AI解析状态")
    private Integer status;

}
