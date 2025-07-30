Vue.component('device-show', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component device-show">
        <div class="title">
            <span style="color: #a1a0a0;">设备管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('device-list')">设备列表<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            设备详情
        </div>
        <template class="tabs-container">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: 20px">
                <!--第一个tag页-->
                <el-tab-pane label="设备详情" name="first">
                   <div class="nav-title">设备信息</div>
                   <el-card :body-style="{ background: '#fafbfc' }">
                        <div style="display: flex;">
                            <img width="240px" src="/img/gateway.png">
                            <el-row class="card-container">
                                <el-col :span="24" style="margin-bottom: 20px">
                                    <div class="card-nav">{{data.deviceName}}</div>
                                    <div class="card-desc">{{data.deviceCode}}</div>
                                    <el-divider></el-divider>
                                </el-col>
                                <el-col :span="10" style="display: flex">
                                    <div>
                                        <div class="card-attr">所属模板:</div>
                                        <div class="card-attr">所属网关:</div>
                                        <div class="card-attr">十进制地址位:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">{{data.templateName}}</div>
                                        <div class="card-text">{{data.gatewayName}}</div>
                                        <div class="card-text">{{data.deviceAddressBit}}</div>
                                    </div>
                                </el-col>
                                <el-col :span="10" style="display: flex">
                                    <div>
                                        <div class="card-attr">设备编号:</div>
                                        <div class="card-attr">设备类型:</div>
                                        <div class="card-attr">设备状态:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">{{data.deviceNumber}}</div>
                                        <div class="card-text">{{data.deviceType}}</div>
                                        <div class="card-text">{{data.deviceStatus}}</div>
                                    </div>
                                </el-col>
                                <el-col :span="4" style="display: flex">
                                    <div>
                                        <div class="card-attr">电流变比:</div>
                                        <div class="card-attr">电压变比:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">{{data.ctRatio}}</div>
                                        <div class="card-text">{{data.ptRatio}}</div>
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