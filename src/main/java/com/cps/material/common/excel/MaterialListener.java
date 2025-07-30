package com.cps.material.common.excel;

import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.event.AnalysisEventListener;
import com.cps.material.model.MaterialPurchase;
import java.util.ArrayList;
import java.util.List;

public class MaterialListener extends AnalysisEventListener<MaterialPurchase> {

    private final List<MaterialPurchase> dataList = new ArrayList<>();
    private boolean startCollect = false;

    @Override
    public void invoke(MaterialPurchase data, AnalysisContext context) {
        if (!startCollect) {
            if ("1".equals(data.getSerialNumber().trim())) {
                startCollect = true;
            } else {
                return;
            }
        }
        dataList.add(data);
    }

    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {}

    public List<MaterialPurchase> getDataList() {
        return dataList;
    }
}
