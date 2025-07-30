package com.cps.material.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.cps.material.common.result.Result;
import com.cps.material.model.MaterialInfo;
import com.cps.material.model.MaterialPurchase;
import com.cps.material.service.MaterialPurchaseService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.models.auth.In;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@Api(tags = "采购文件记录相关API")
@RequestMapping("/purchase")
public class MaterialPurchaseController {

    @Resource
    private MaterialPurchaseService materialPurchaseService;

    @ApiOperation("获取采购分页列表")
    @GetMapping("/getPageList")
    public Result<IPage<MaterialPurchase>> getPageList(
            // 查询参数
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String productName,
            @RequestParam(required = false) String material,
            @RequestParam(required = false) String specification,
            @RequestParam(required = false) String materialCode,
            @RequestParam(required = false) Long analysisId,
            // 业务参数
            @RequestParam(defaultValue = "1") Long pageNum,
            @RequestParam(defaultValue = "10") Long pageSize) {
        MaterialPurchase materialPurchase = new MaterialPurchase();
        materialPurchase.setStatus(status);
        materialPurchase.setCode(code);
        materialPurchase.setBrand(brand);
        materialPurchase.setProductName(productName);
        materialPurchase.setMaterial(material);
        materialPurchase.setSpecification(specification);
        materialPurchase.setMaterialCode(materialCode);
        materialPurchase.setAnalysisId(analysisId);
        return Result.ok(materialPurchaseService.getMaterialPurchasePage(materialPurchase, pageNum, pageSize));
    }

    @ApiOperation("获取采购列表")
    @GetMapping("/getList")
    public Result<List<MaterialPurchase>> getList() {
        return Result.ok(materialPurchaseService.list());
    }

    @ApiOperation("删除物料")
    @GetMapping("/delete")
    public Result<String> delete(@RequestParam Long id) {
        boolean result = materialPurchaseService.removeById(id);
        if(result){
            return Result.ok("删除成功");
        }else {
            return Result.fail("删除失败");
        }
    }

    @ApiOperation("新增物料")
    @PostMapping("/add")
    public Result<String> add(@RequestBody MaterialPurchase materialPurchase) {
        materialPurchase.setCreateTime(new Date());
        materialPurchase.setUpdateTime(new Date());
        materialPurchase.setIsDeleted(0);
        boolean result = materialPurchaseService.save(materialPurchase);
        if(result){
            return Result.ok("新增成功");
        }else {
            return Result.fail("新增失败");
        }
    }

    @ApiOperation("批量删除物料")
    @GetMapping("/batchDelete")
    public Result<String> batchDelete(@RequestParam String ids) {
        // 将字符串数组转换为Long列表
        List<Long> idList = Arrays.stream(ids.split(","))
                .map(Long::valueOf)
                .collect(Collectors.toList());
        // 批量删除
        boolean result = materialPurchaseService.removeByIds(idList);  // 注意是removeByIds(复数)
        if(result){
            return Result.ok("删除成功");
        } else {
            return Result.fail("删除失败");
        }
    }

    @ApiOperation("获取详情")
    @GetMapping("/getById")
    public Result<MaterialPurchase> getById(@RequestParam Long id) {
        return Result.ok(materialPurchaseService.getById(id));
    }

    @ApiOperation("修改信息")
    @PostMapping("/edit")
    public Result<String> edit(@RequestBody MaterialPurchase materialPurchase) {
        materialPurchase.setUpdateTime(new Date());
        boolean result = materialPurchaseService.updateById(materialPurchase);
        if(result){
            return Result.ok("修改成功");
        }else {
            return Result.fail("修改失败");
        }
    }

}
