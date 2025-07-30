Vue.component('analysis-show', {
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
            <span style="color: #a1a0a0;">解析管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('analysis-list')">文件解析列表<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            文件解析详情
        </div>
        <template class="tabs-container">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: 20px">
                <!--第一个tag页-->
                <el-tab-pane label="文件解析详情" name="first">
                   <div class="nav-title">文件信息</div>
                   <el-card :body-style="{ background: '#fafbfc' }">
                        <div style="display: flex;">
                            <img width="240px" src="/img/analysis.png">
                            <el-row class="card-container">
                                <el-col :span="24" style="margin-bottom: 20px">
                                    <div class="card-nav">{{data.fileName}}</div>
                                    <div class="card-desc">{{data.code}}</div>
                                    <el-divider></el-divider>
                                </el-col>
                                <el-col :span="10" style="display: flex">
                                    <div>
                                        <div class="card-attr">文件名称:</div>
                                        <div class="card-attr">解析编号:</div>
                                        <div class="card-attr">解析状态:</div>
                                        <div class="card-attr">创建时间:</div>
                                        <div class="card-attr">修改时间:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">{{data.fileName}}</div>
                                        <div class="card-text">{{data.code}}</div>
                                        <div class="card-text">
                                            <span v-if="data.status === 1" style="color: #13ce66"><i class="el-icon-s-tools"></i> 已解析</span>
                                            <span v-else style="color: #a19e9e"><i class="el-icon-s-tools"></i> 未解析</span>
                                        </div>
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