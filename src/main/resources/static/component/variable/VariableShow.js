Vue.component('variable-show', {
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
            <span style="color: #a1a0a0;">变量管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('variable-list')">变量列表<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            变量详情
        </div>
        <template class="tabs-container">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: 20px">
                <!--第一个tag页-->
                <el-tab-pane label="变量详情" name="first">
                   <div class="nav-title">变量信息</div>
                   <el-card :body-style="{ background: '#fafbfc' }">
                        <div style="display: flex;">
                            <img width="240px" src="/img/gateway.png">
                            <el-row class="card-container">
                                <el-col :span="24" style="margin-bottom: 20px">
                                    <div class="card-nav">{{data.variableName}}</div>
                                    <div class="card-desc">{{data.variableCode}}</div>
                                    <el-divider></el-divider>
                                </el-col>
                                <el-col :span="10" style="display: flex">
                                    <div>
                                        <div class="card-attr">寄存器地址:</div>
                                        <div class="card-attr">寄存器长度:</div>
                                        <div class="card-attr">变量单位:</div>
                                        <div class="card-attr">计算系数:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">{{data.registerAddress}}</div>
                                        <div class="card-text">{{data.registerLength}}</div>
                                        <div class="card-text">{{data.variableUnit}}</div>
                                        <div class="card-text">{{data.coefficient}}</div>
                                    </div>
                                </el-col>
                                <el-col :span="10" style="display: flex">
                                    <div>
                                        <div class="card-attr">变量类型:</div>
                                        <div class="card-attr">所属模板:</div>
                                        <div class="card-attr">所属报文:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">{{data.variableType}}</div>
                                        <div class="card-text">{{data.templateName}}</div>
                                        <div class="card-text">{{data.messageName}}</div>
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