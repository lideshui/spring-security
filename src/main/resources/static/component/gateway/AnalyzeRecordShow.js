Vue.component('analyze-record-show', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component gateway-show">
        <div class="title">
            <span style="color: #a1a0a0;">网关管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('analyze-record-list')">解析记录<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            解析详情
        </div>
        <template class="tabs-container">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: 20px">
                <!--第一个tag页-->
                <el-tab-pane label="解析详情" name="first">
                   <div class="nav-title">解析信息</div>
                   <el-card :body-style="{ background: '#fafbfc' }">
                        <div style="display: flex;">
                            <img width="240px" src="/img/gateway.png">
                            <el-row class="card-container">
                                <el-col :span="24" style="margin-bottom: 20px">
                                    <div class="card-nav">{{data.gatewayName}}</div>
                                    <div class="card-desc">{{data.gatewayIp}}</div>
                                    <el-divider></el-divider>
                                </el-col>
                                <el-col :span="10" style="display: flex">
                                    <div>
                                        <div class="card-attr">解析状态:</div>
                                        <div class="card-attr">模板名称:</div>
                                        <div class="card-attr">设备名称:</div>
                                        <div class="card-attr">设备编码:</div>
                                        <div class="card-attr">报文名称:</div>
                                        <div class="card-attr">解析结果:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">
                                            <span v-if="data.analyzeStatus === 0" style="color: #13ce66"><i class="el-icon-s-tools"></i> 成功</span>
                                            <span v-else-if="data.analyzeStatus === 1" style="color: #cd6767"><i class="el-icon-s-tools"></i> 失败</span>
                                            <span v-else-if="data.analyzeStatus === 2" style="color: #f1a633"><i class="el-icon-s-tools"></i> 异常</span>
                                            <span v-else style="color: #b3b5b4"><i class="el-icon-s-tools"></i> 无效状态</span>
                                        </div>
                                        <div class="card-text">{{data.templateName}}</div>
                                        <div class="card-text">{{data.deviceName}}</div>
                                        <div class="card-text">{{data.deviceCode}}</div>
                                        <div class="card-text">{{data.messageName}}</div>
                                        <div class="card-text">{{data.analyzeResult}}</div>
                                    </div>
                                </el-col>
                                <el-col :span="14" style="display: flex">
                                    <div style="flex-shrink: 0">
                                        <div class="card-attr">请求报文:</div>
                                        <div class="card-attr">响应报文:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">{{data.requestMessage}}</div>
                                        <div class="card-text" style="word-break: break-all; overflow-wrap: anywhere;">{{data.responseMessage}}</div>
                                   </div>
                                </el-col>
                            </el-row>
                        </div>
                   </el-card>
                </el-tab-pane>
                <!--第二个tag页-->
                <el-tab-pane v-if="this.data.analyzeStatus == 1 || this.data.analyzeStatus == 2" label="异常信息" name="second">
                    <template class="tabs-container">
                        <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: -13px!important;">
                           <el-card>
                              <el-row>
                                  <el-col :span="24">
                                      <div class="card-nav">解析状态</div>
                                      <div class="card-nav">
                                          <span v-if="data.analyzeStatus === 0" style="color: #13ce66"><i class="el-icon-s-tools"></i> 成功</span>
                                          <span v-else-if="data.analyzeStatus === 1" style="color: #cd6767"><i class="el-icon-s-tools"></i> 失败</span>
                                          <span v-else-if="data.analyzeStatus === 2" style="color: #f1a633"><i class="el-icon-s-tools"></i> 异常</span>
                                          <span v-else style="color: #b3b5b4"><i class="el-icon-s-tools"></i> 无效状态</span>
                                      </div>
                                      <el-divider></el-divider>
                                  </el-col>
                              </el-row>
<pre><code class="language-javascript line-numbers">{{formattedJson}}</code></pre>
                           </el-card>
                        </el-tabs>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
    `,
    data() {
        return {
            timeChecked: true,
            activeName: 'first',
            gateway: {
                gatewayName: '',
                gatewayCode: '',
                gatewayIp: '',
                gatewayPort: '',
                gatewaySn: '',
                heartbeat: '',
                gatewayStatus: '',
                gatewayMac: '',
                gatewayImei: '',
                gatewayTag: '',
                gatewayType: '',
                gatewayCoordinates: '',
                installationLocation: '',
            },
        }
    },
    created() {},
    computed: {
        formattedJson() {
            return JSON.stringify(JSON.parse(this.data.exceptionInfo), null, 2); // 格式化 JSON，缩进为 2 个空格
        },
    },
    mounted() {
        // 确保 Prism.js 在组件挂载后重新初始化
        this.$nextTick(() => {
            Prism.highlightAll();
        });
    },
    methods: {
        // 标签切换
        handleClick(tab) {
        },
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