Vue.component('quartz-show', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component quartz-show">
        <div class="title">
            <span style="color: #a1a0a0;">任务管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('quartz-list')">任务列表<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            任务详情
        </div>
        <template class="tabs-container">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: 20px">
                <!--第一个tag页-->
                <el-tab-pane label="任务详情" name="first">
                   <div class="nav-title">任务信息</div>
                   <el-card :body-style="{ background: '#fafbfc' }">
                        <div style="display: flex;">
                            <img width="240px" src="/img/gateway.png">
                            <el-row class="card-container">
                                <el-col :span="24" style="margin-bottom: 20px">
                                    <div class="card-nav">{{data.jobName}}</div>
                                    <div class="card-desc">{{data.jobClass}}</div>
                                    <el-divider></el-divider>
                                </el-col>
                                <el-col :span="10" style="display: flex">
                                    <div>
                                        <div class="card-attr">任务状态:</div>
                                        <div class="card-attr">任务方法名:</div>
                                        <div class="card-attr">执行策略:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">
                                            <span v-if="data.jobStatus === 0" style="color: #13ce66"><i class="el-icon-message-solid"></i> 启用</span>
                                            <span v-else-if="data.jobStatus === 1" style="color: #cd6767"><i class="el-icon-message-solid"></i> 停用</span>
                                            <span v-else style="color: #b3b5b4"><i class="el-icon-message-solid"></i> 无效状态</span>
                                        </div>
                                        <div class="card-text">{{data.jobMethod}}</div>
                                        <div class="card-text">{{data.cronExpression}}</div>
                                    </div>
                                </el-col>
                                <el-col :span="10" style="display: flex">
                                    <div>
                                        <div class="card-attr">触发器名称:</div>
                                        <div class="card-attr">触发器组:</div>
                                        <div class="card-attr">定时任务组:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">{{data.jobTrigger}}</div>
                                        <div class="card-text">{{data.jobTriggerGroup}}</div>
                                        <div class="card-text">{{data.jobGroup}}</div>
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