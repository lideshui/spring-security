package com.cps.material.model;

import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel(description = "物料信息")
@TableName("material_info")
public class MaterialInfo extends BaseEntity {

    @ApiModelProperty(value = "物料编号")
    private String number;

    @ApiModelProperty(value = "物料描述")
    private String description;

}
