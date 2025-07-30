package com.cps.material.controller;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.write.metadata.style.WriteCellStyle;
import com.alibaba.excel.write.metadata.style.WriteFont;
import com.alibaba.excel.write.style.HorizontalCellStyleStrategy;
import com.alibaba.excel.write.style.column.LongestMatchColumnWidthStyleStrategy;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.cps.material.common.excel.MaterialListener;
import com.cps.material.common.http.DeepSeekApiUtil;
import com.cps.material.common.result.Result;
import com.cps.material.common.util.DateUtil;
import com.cps.material.model.MaterialAnalysis;
import com.cps.material.model.MaterialInfo;
import com.cps.material.model.MaterialPurchase;
import com.cps.material.service.MaterialAnalysisService;
import com.cps.material.service.MaterialInfoService;
import com.cps.material.service.MaterialPurchaseService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@Api(tags = "采购文件解析相关API")
@RequestMapping("/analysis")
public class MaterialAnalysisController {

    @Resource
    private MaterialAnalysisService materialAnalysisService;

    @Resource
    private MaterialInfoService materialInfoService;

    @Resource
    private MaterialPurchaseService materialPurchaseService;

    @ApiOperation("获取首页数据")
    @GetMapping("/getDataOverview")
    public Result<Map<String, Object>> getDataOverview(){
        Map<String, Object> result = new HashMap<>();
        result.put("materialTotal", materialInfoService.count());
        result.put("analysisTotal", materialAnalysisService.count());
        result.put("requestTotal", materialPurchaseService.count());
        result.put("tokenTotal", DeepSeekApiUtil.getBalance());
        result.put("parseSuccessRate", 100);
        result.put("pushSuccessRate", 100);
        return Result.ok(result);
    }

    @ApiOperation("AI调用统计")
    @GetMapping("/recentFull")
    public List<Map<String, Object>> recentFull() {
        return materialPurchaseService.getRecent15DaysFullData();
    }

    @ApiOperation("获取全量列表")
    @GetMapping("/getAllList")
    public Result<List<MaterialAnalysis>> getAllList(){
        LambdaQueryWrapper<MaterialAnalysis> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.orderByDesc(MaterialAnalysis::getCreateTime);
        return Result.ok(materialAnalysisService.list(queryWrapper));
    }

    @ApiOperation("获取解析分页列表")
    @GetMapping("/getPageList")
    public Result<IPage<MaterialAnalysis>> getPageList(
            // 业务查询参数
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String fileName,
            @RequestParam(required = false) Integer status,
            // 分页参数
            @RequestParam(defaultValue = "1") Long pageNum,
            @RequestParam(defaultValue = "10") Long pageSize) {
        MaterialAnalysis materialAnalysis = new MaterialAnalysis();
        materialAnalysis.setCode(code);
        materialAnalysis.setFileName(fileName);
        materialAnalysis.setStatus(status);
        return Result.ok(materialAnalysisService.getMaterialAnalysisPage(materialAnalysis, pageNum, pageSize));
    }

    @ApiOperation("删除解析")
    @GetMapping("/delete")
    public Result<String> delete(@RequestParam Long id) {
        boolean result1 = materialAnalysisService.removeById(id);
        LambdaQueryWrapper<MaterialPurchase> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(MaterialPurchase::getAnalysisId, id);
        boolean result2 = materialPurchaseService.remove(wrapper);
        if (result1 && result2) {
            return Result.ok("删除成功");
        } else {
            return Result.fail("部分删除失败，请检查数据");
        }
    }

    @ApiOperation("批量删除解析")
    @GetMapping("/batchDelete")
    public Result<String> batchDelete(@RequestParam String ids) {
        List<Long> idList = Arrays.stream(ids.split(","))
                .map(Long::valueOf)
                .collect(Collectors.toList());
        // 1. 批量删除主表记录
        boolean result1 = materialAnalysisService.removeByIds(idList);
        // 2. 批量删除关联的子表记录
        boolean result2 = true;
        for (Long id : idList) {
            LambdaQueryWrapper<MaterialPurchase> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(MaterialPurchase::getAnalysisId, id);
            boolean tempResult = materialPurchaseService.remove(wrapper);
            if (!tempResult) {
                result2 = false; // 标记为失败，但继续执行剩余删除
            }
        }
        if (result1 && result2) {
            return Result.ok("删除成功");
        } else {
            return Result.fail("部分删除失败，请检查数据");
        }
    }

    @ApiOperation("获取详情")
    @GetMapping("/getById")
    public Result<MaterialAnalysis> getById(@RequestParam Long id) {
        return Result.ok(materialAnalysisService.getById(id));
    }

    @ApiOperation("修改")
    @PostMapping("/edit")
    public Result<String> edit(@RequestBody MaterialAnalysis materialAnalysis) {
        materialAnalysis.setUpdateTime(new Date());
        boolean result = materialAnalysisService.updateById(materialAnalysis);
        if(result){
            return Result.ok("修改成功");
        }else {
            return Result.fail("修改失败");
        }
    }

    @ApiOperation("上传采购文件")
    @PostMapping("/import")
    public String importExcel(@RequestParam("file") MultipartFile file) throws IOException {
        try {
            // 获取文件名称
            String filename = file.getOriginalFilename();
            // 获取解析编码
            String code = "CPS_" + DateUtil.getCurrentWatermark();
            // 新增解析对象
            MaterialAnalysis materialAnalysis = new MaterialAnalysis();
            materialAnalysis.setFileName(filename);
            materialAnalysis.setCode(code);
            materialAnalysis.setStatus(0);
            materialAnalysis.setIsDeleted(0);
            materialAnalysis.setCreateTime(new Date());
            materialAnalysis.setUpdateTime(new Date());
            materialAnalysisService.save(materialAnalysis);

            // 读取 Excel 文件
            MaterialListener listener = new MaterialListener();
            EasyExcel.read(file.getInputStream(), MaterialPurchase.class, listener).sheet().doRead();
            List<MaterialPurchase> excelList = listener.getDataList();

            if (CollectionUtils.isEmpty(excelList)) {
                return "未识别到有效采购记录（序号=1 起始）";
            }

            // 查询物料信息
            List<String> productNameList = excelList.stream()
                    .map(MaterialPurchase::getProductName)
                    .filter(Objects::nonNull)
                    .map(name -> name.replaceAll("[（(][^）)]*[）)]", "").trim())
                    .distinct()
                    .collect(Collectors.toList());

            List<MaterialInfo> materialInfoList = materialInfoService.list();
            log.info("=========================已检索物料库信息 {}", materialInfoList.size());

            // 根据品名、品牌和材质进行过滤
            excelList.forEach(excel -> {
                excel.setMaterialList(materialInfoList);
            });
            materialPurchaseService.filterByProductName(excelList);
            materialPurchaseService.filterByBrand(excelList);
            materialPurchaseService.filterByMaterial(excelList);

            // 创建CountDownLatch来等待所有任务完成（比CyclicBarrier更适合这种场景）
            CountDownLatch latch = new CountDownLatch(excelList.size());
            // 使用线程池而不是直接创建线程
            ExecutorService threadPoolExecutor = Executors.newFixedThreadPool(excelList.size()); // 根据实际情况调整线程数
            // 新增全部物料采购数据
            excelList.forEach(excel -> {
                threadPoolExecutor.execute(() -> {
                    try {
                        // 新增物料记录
                        JSONArray materialJson = new JSONArray();
                        excel.getMaterialList().forEach(materialInfo -> {
                            JSONObject materialObj = new JSONObject();
                            materialObj.put("物料编号", materialInfo.getNumber());
                            materialObj.put("物料规格", materialInfo.getDescription());
                            materialJson.add(materialObj);
                        });
                        excel.setMaterialJson(materialJson.toString());
                        excel.setAnalysisId(materialAnalysis.getId());
                        excel.setStatus(0);
                        excel.setIsDeleted(0);
                        excel.setCreateTime(new Date());
                        excel.setUpdateTime(new Date());
                        materialPurchaseService.save(excel);
                        // 调用AI分析
                        String specification = excel.getSpecification();
                        String materialJsonText = excel.getMaterialJson();
                        JSONObject aiJson = new JSONObject();
                        aiJson.put("采购规格", specification);
                        aiJson.put("物料库", materialJsonText);
                        // 构建分析预计
                        StringBuilder aiGuide = new StringBuilder();
                        aiGuide.append("请阅读以下内容，根据采购规格，参考物料库信息中的物料规格，找到最匹配物料编号。");
                        aiGuide.append("==原始内容==");
                        aiGuide.append(aiJson);
                        aiGuide.append("==End==");
                        aiGuide.append("要求：");
                        aiGuide.append("1. 根据采购规格，参考物料库信息中的物料规格，找到最匹配物料编号，若未找到则返回空内容。");
                        aiGuide.append("2. 返回的内容必须只有物料编号，这是强制性要求，不要用字符串包裹内容，仅返回一串物料编号即可。");
                        aiGuide.append("3. 返回示例：100000000001");
                        // 处理分析结果
                        String result = "";
                        // 限制条件为1000条，超出直接pass
                        if(!CollectionUtils.isEmpty(excel.getMaterialList()) && excel.getMaterialList().size() <= 1000){
                            result = DeepSeekApiUtil.sendAIRequest(aiGuide.toString());
                            result = result.replaceAll("\"\"","");
                            log.info("==================================AI分析请求 {} {}", excel.getMaterialList().size(), aiJson);
                            log.info("==================================AI分析结果 {}", result);
                        }else {
                            log.info("==================================不满足AI分析条件 {} {}", excel.getProductName(), excel.getMaterialList().size());
                        }
                        // 更新采购文件
                        MaterialPurchase materialPurchase = new MaterialPurchase();
                        materialPurchase.setId(excel.getId());
                        materialPurchase.setMaterialCode(result);
                        materialPurchase.setStatus(StringUtils.isEmpty(result) ? 2 : 1);
                        materialPurchaseService.updateById(materialPurchase);
                    } catch (Exception e) {
                        MaterialPurchase materialPurchase = new MaterialPurchase();
                        materialPurchase.setId(excel.getId());
                        materialPurchase.setStatus(3);
                        materialPurchaseService.updateById(materialPurchase);
                        log.error("处理Excel条目时出错", e);
                    } finally {
                        latch.countDown(); // 确保无论是否成功都减少计数器
                    }
                });
            });
            try {
                latch.await(); // 等待所有任务完成
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.error("等待任务完成时被中断", e);
            } finally{
                threadPoolExecutor.shutdown();
            }
            log.info("==================================全部调用AI引擎分析完毕。");
            // 修改分析对象状态
            MaterialAnalysis updateAnalysis = new MaterialAnalysis();
            updateAnalysis.setId(materialAnalysis.getId());
            updateAnalysis.setStatus(1);
            updateAnalysis.setUpdateTime(new Date());
            materialAnalysisService.updateById(updateAnalysis);
            // 返回结果
            return "文件解析完成";
        }catch (Exception e){
            e.printStackTrace();
            return "文件解析失败，请联系开发人员";
        }
    }

    @ApiOperation("导出物料记录Excel")
    @GetMapping("/export")
    public void exportExcel(@RequestParam Long analysisId, HttpServletResponse response) throws IOException {
        // 查询数据
        LambdaQueryWrapper<MaterialPurchase> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(MaterialPurchase::getAnalysisId, analysisId);
        wrapper.orderByAsc(MaterialPurchase::getSerialNumber);
        List<MaterialPurchase> purchaseList = materialPurchaseService.list(wrapper);

        // 按序号由String转换为Integer排序
        purchaseList.sort(Comparator.comparingInt(p -> {
            try {
                return Integer.parseInt(p.getSerialNumber().trim());
            } catch (Exception e) {
                return Integer.MAX_VALUE; // 排到最后
            }
        }));

        if (CollectionUtils.isEmpty(purchaseList)) {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"code\":400,\"message\":\"无数据可导出\"}");
            return;
        }

        // 设置响应头
        String fileName = URLEncoder.encode("物料记录_" + analysisId + ".xlsx", "UTF-8").replaceAll("\\+", "%20");
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setCharacterEncoding("utf-8");
        response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + fileName);

        // === 设置表头样式 ===
        WriteCellStyle headStyle = new WriteCellStyle();
        headStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        WriteFont headFont = new WriteFont();
        headFont.setFontHeightInPoints((short) 11);
        headFont.setBold(true);
        headStyle.setWriteFont(headFont);
        headStyle.setHorizontalAlignment(HorizontalAlignment.CENTER); // 水平居中

        // === 设置内容样式 ===
        WriteCellStyle contentStyle = new WriteCellStyle();
        WriteFont contentFont = new WriteFont();
        contentFont.setFontHeightInPoints((short) 10);
        contentStyle.setWriteFont(contentFont);
        contentStyle.setHorizontalAlignment(HorizontalAlignment.CENTER); // 水平居中

        // 设置边框
        contentStyle.setBorderTop(BorderStyle.THIN);
        contentStyle.setBorderBottom(BorderStyle.THIN);
        contentStyle.setBorderLeft(BorderStyle.THIN);
        contentStyle.setBorderRight(BorderStyle.THIN);

        HorizontalCellStyleStrategy styleStrategy = new HorizontalCellStyleStrategy(headStyle, contentStyle);

        // 写出 Excel：增加列宽自适应
        EasyExcel.write(response.getOutputStream(), MaterialPurchase.class)
                .registerWriteHandler(styleStrategy)
                .registerWriteHandler(new LongestMatchColumnWidthStyleStrategy()) // 自动列宽
                .sheet("物料记录")
                .doWrite(purchaseList);
    }




}
