package com.cps.material.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.cps.material.mapper.MaterialInfoMapper;
import com.cps.material.model.MaterialInfo;
import com.cps.material.common.result.Result;
import com.cps.material.service.MaterialInfoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@Api(tags = "物料信息相关API")
@RequestMapping("/material")
public class MaterialInfoController {

    @Resource
    private MaterialInfoService materialInfoService;

    @Resource
    private MaterialInfoMapper materialInfoMapper;

    @ApiOperation("获取物料列表")
    @GetMapping("/getList")
    public Result<List<MaterialInfo>> getList() {
        QueryWrapper<MaterialInfo> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("id", "number", "description");
        List<MaterialInfo> materialInfos = materialInfoMapper.selectList(queryWrapper);
        return Result.ok(materialInfos);
    }

    @ApiOperation("获取物料分页列表")
    @GetMapping("/getPageList")
    public Result<IPage<MaterialInfo>> getPageList(
            // 业务查询参数
            @RequestParam(required = false) String number,
            @RequestParam(required = false) String  descriptionFilter1,
            @RequestParam(required = false) String descriptionFilter2,
            @RequestParam(required = false) String descriptionFilter3,
            // 分页参数
            @RequestParam(defaultValue = "1") Long pageNum,
            @RequestParam(defaultValue = "10") Long pageSize) {
        Map<String, String> paramMap = new HashMap<>();
        paramMap.put("number", number);
        paramMap.put("descriptionFilter1", descriptionFilter1);
        paramMap.put("descriptionFilter2", descriptionFilter2);
        paramMap.put("descriptionFilter3", descriptionFilter3);
        return Result.ok(materialInfoService.getMaterialInfoPage(paramMap, pageNum, pageSize));
    }

    @ApiOperation("新增物料")
    @PostMapping("/add")
    public Result<String> add(@RequestBody MaterialInfo materialInfo) {
        materialInfo.setCreateTime(new Date());
        materialInfo.setUpdateTime(new Date());
        materialInfo.setIsDeleted(0);
        boolean result = materialInfoService.save(materialInfo);
        if(result){
            return Result.ok("新增成功");
        }else {
            return Result.fail("新增失败");
        }
    }

    @ApiOperation("删除物料")
    @GetMapping("/delete")
    public Result<String> delete(@RequestParam Long id) {
        boolean result = materialInfoService.removeById(id);
        if(result){
            return Result.ok("删除成功");
        }else {
            return Result.fail("删除失败");
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
        boolean result = materialInfoService.removeByIds(idList);  // 注意是removeByIds(复数)
        if(result){
            return Result.ok("删除成功");
        } else {
            return Result.fail("删除失败");
        }
    }

    @ApiOperation("获取详情")
    @GetMapping("/getById")
    public Result<MaterialInfo> getById(@RequestParam Long id) {
        return Result.ok(materialInfoService.getById(id));
    }

    @ApiOperation("修改信息")
    @PostMapping("/edit")
    public Result<String> edit(@RequestBody MaterialInfo materialInfo) {
        materialInfo.setUpdateTime(new Date());
        boolean result = materialInfoService.updateById(materialInfo);
        if(result){
            return Result.ok("修改成功");
        }else {
            return Result.fail("修改失败");
        }
    }

}
