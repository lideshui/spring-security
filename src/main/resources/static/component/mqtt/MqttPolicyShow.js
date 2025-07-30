Vue.component('mqtt-policy-show', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component mqtt-show">
        <div class="title">
            <span style="color: #a1a0a0;">消息队列<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('mqtt-policy-list')">MQTT推送策略<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            推送策略详情
        </div>
        <template class="tabs-container">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: 20px">
                <!--第一个tag页-->
                <el-tab-pane label="推送策略详情" name="first">
                   <div class="nav-title">推送策略信息</div>
                   <el-card :body-style="{ background: '#fafbfc' }">
                        <div style="display: flex;">
                            <img width="240px" src="/img/gateway.png">
                            <el-row class="card-container">
                                <el-col :span="24" style="margin-bottom: 20px">
                                    <div class="card-nav">{{data.policyName}}</div>
                                    <div class="card-desc">{{data.topic}}</div>
                                    <el-divider></el-divider>
                                </el-col>
                                <el-col :span="10" style="display: flex">
                                    <div>
                                        <div class="card-attr">策略状态:</div>
                                        <div class="card-attr">策略表达式:</div>
                                        <div class="card-attr">策略模板:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">
                                            <span v-if="data.policyStatus === 0" style="color: #13ce66"><i class="el-icon-s-tools"></i> 启用</span>
                                            <span v-else-if="data.policyStatus === 1" style="color: #cd6767"><i class="el-icon-s-tools"></i> 停用</span>
                                            <span v-else style="color: #b3b5b4"><i class="el-icon-s-tools"></i> 无效状态</span>
                                        </div>
                                        <div class="card-text">{{data.cronExpression}}</div>
                                        <div class="card-text" style="word-break: break-all; overflow-wrap: anywhere;">{{data.policyTemplate}}</div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                   </el-card>
                </el-tab-pane>
                <!--第二个tag页-->
                <el-tab-pane label="关联网关" name="second">
                    <div class="table-area">
                        <!-- 报文表格 -->
                        <el-table :data="gatewayList" style="width: 100%" v-if="this.gatewayList.length > 0">
                            <el-table-column
                                type="index"
                                width="50">
                            </el-table-column>
                            <!-- 状态列 -->
                            <el-table-column
                                label="网关状态"
                                width="150">
                                align="left">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.gatewayStatus === 0" style="color: #13ce66"><i class="el-icon-upload"></i> 在线</span>
                                    <span v-else-if="scope.row.gatewayStatus === 1" style="color: #cd6767"><i class="el-icon-upload"></i> 离线</span>
                                    <span v-else-if="scope.row.gatewayStatus === 2" style="color: #f1a633"><i class="el-icon-upload"></i> 停用</span>
                                    <span v-else style="color: #b3b5b4"><i class="el-icon-upload"></i> 无效状态</span>
                                </template>
                            </el-table-column>
                            <!-- 动态渲染 -->
                            <el-table-column 
                                v-for="column in tableColumns" 
                                :key="column.prop"
                                :prop="column.prop"
                                :label="column.label"
                            />
                            <!-- 操作列 -->
                            <el-table-column
                                label="操作"
                                width="80"
                                align="left">
                                <template slot-scope="scope">
                                    <el-link class="link-container" type="primary" @click="handleGatewayShow(scope.row)">查看</el-link>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-empty description="该MQTT策略下暂无关联网关数据" v-else></el-empty>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
    `,
    data() {
        return {
            activeName: 'first',
            gatewayList: this.data.gatewayList,
            tableColumns: [
                { prop: 'gatewayName', label: '网关名称' },
                { prop: 'gatewayCode', label: '网关编码' },
                { prop: 'gatewayIp', label: '网关IP' },
                { prop: 'gatewaySn', label: '网关SN' },
                { prop: 'heartbeat', label: '心跳包' },
            ],
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
        // 查看关联网关详情跳转
        handleGatewayShow(row) {
            let paramObj = {
                component: 'gateway-show',
                data: row
            }
            this.$emit('change-component', paramObj);
        },
    }
})