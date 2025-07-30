Vue.component('purchase-show', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component variable-show">
        <div class="title">
            <span style="color: #a1a0a0;">物料记录<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('purchase-list')">物料记录列表<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            物料记录详情
        </div>
        <template class="tabs-container">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: 20px">
                <!--第一个tag页-->
                <el-tab-pane label="物料记录详情" name="first">
                   <div class="nav-title">物料记录</div>
                   <el-card :body-style="{ background: '#fafbfc' }">
                        <div style="display: flex;">
                            <img width="240px" src="/img/material.png">
                            <el-row class="card-container">
                                <el-col :span="24" style="margin-bottom: 20px">
                                    <div class="card-nav">{{data.productName}}</div>
                                    <div class="card-desc">{{data.fileName}}</div>
                                    <el-divider></el-divider>
                                </el-col>
                                <el-col :span="10" style="display: flex">
                                    <div>
                                        <div class="card-attr">物料编码:</div>
                                        <div class="card-attr">物料品牌:</div>
                                        <div class="card-attr">物料材质:</div>
                                        <div class="card-attr">物料规格:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">{{data.materialCode}}</div>
                                        <div class="card-text">{{data.brand}}</div>
                                        <div class="card-text">{{data.material}}</div>
                                        <div class="card-text">{{data.specification}}</div>
                                    </div>
                                </el-col>
                                <el-col :span="10" style="display: flex">
                                    <div>
                                        <div class="card-attr">系统号:</div>
                                        <div class="card-attr">交货期:</div>
                                        <div class="card-attr">英文名称:</div>
                                        <div class="card-attr">解析编码:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">{{data.systemNumber}}</div>
                                        <div class="card-text">{{data.deliveryDate}}</div>
                                        <div class="card-text">{{data.englishName}}</div>
                                        <div class="card-text">{{data.code}}</div>
                                    </div>
                                </el-col>
                                <el-col :span="4" style="display: flex">
                                    <div>
                                        <div class="card-attr">序号:</div>
                                        <div class="card-attr">货号:</div>
                                        <div class="card-attr">单位:</div>
                                        <div class="card-attr">数量:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">{{data.serialNumber}}</div>
                                        <div class="card-text">{{data.itemNumber}}</div>
                                        <div class="card-text">{{data.unit}}</div>
                                        <div class="card-text">{{data.quantity}}</div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                   </el-card>
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
    `,
    data() {
        return {
            activeName: 'first',
        }
    },
    created() {},
    methods: {
        // 标签切换
        handleClick(tab) {},
        // 跳转页面
        linkPage(component) {
            let paramObj = {
                component: component,
                data: {}
            }
            this.$emit('change-component', paramObj);
        },
    }
})