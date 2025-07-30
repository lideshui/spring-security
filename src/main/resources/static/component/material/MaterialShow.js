Vue.component('material-show', {
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
            <span style="color: #a1a0a0;">物料信息<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('material-list')">物料信息列表<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            物料信息详情
        </div>
        <template class="tabs-container">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: 20px">
                <!--第一个tag页-->
                <el-tab-pane label="物料信息详情" name="first">
                   <div class="nav-title">物料信息</div>
                   <el-card :body-style="{ background: '#fafbfc' }">
                        <div style="display: flex;">
                            <img width="240px" src="/img/material.png">
                            <el-row class="card-container">
                                <el-col :span="24" style="margin-bottom: 20px">
                                    <div class="card-nav">{{data.number}}</div>
                                    <div class="card-desc">{{data.description}}</div>
                                    <el-divider></el-divider>
                                </el-col>
                                <el-col :span="10" style="display: flex">
                                    <div>
                                        <div class="card-attr">物料编号:</div>
                                        <div class="card-attr">物料描述:</div>
                                        <div class="card-attr">创建时间:</div>
                                        <div class="card-attr">修改时间:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">{{data.number}}</div>
                                        <div class="card-text">{{data.description}}</div>
                                        <div class="card-text">{{data.createTime}}</div>
                                        <div class="card-text">{{data.updateTime}}</div>
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