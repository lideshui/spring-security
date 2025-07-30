Vue.component('mqtt-record-show', {
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
            <span style="color: #a1a0a0;">消息队列<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('mqtt-record-list')">MQTT消息记录<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            MQTT消息记录详情
        </div>
        <template class="tabs-container">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: 20px">
                <!--第一个tag页-->
                <el-tab-pane label="消息记录详情" name="first">
                   <div class="nav-title">消息记录信息</div>
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
                                        <div class="card-attr">消息状态:</div>
                                        <div class="card-attr">消息类型:</div>
                                        <div class="card-attr">收发时间:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">
                                            <span v-if="data.recordStatus === 0" style="color: #13ce66"><i class="el-icon-s-tools"></i> 正常</span>
                                            <span v-else-if="data.recordStatus === 1" style="color: #cd6767"><i class="el-icon-s-tools"></i> 异常</span>
                                            <span v-else style="color: #b3b5b4"><i class="el-icon-s-tools"></i> 无效状态</span>
                                        </div>
                                        <div class="card-text">
                                            <span v-if="data.recordStatus === 0" >推送</span>
                                            <span v-else>接收</span>
                                        </div>
                                    </div>
                                    <div class="card-text">{{data.commTime}}</div>
                                </el-col>
                            </el-row>
                        </div>
                   </el-card>
                </el-tab-pane>
                <!--第二个tag页-->
                <el-tab-pane label="消息内容" name="second">
                    <template class="tabs-container">
                        <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: -13px!important;">
                           <el-card>
                              <el-row>
                                  <el-col :span="24">
                                      <div class="card-nav">消息状态</div>
                                      <div class="card-nav">
                                            <span v-if="data.recordStatus === 0" style="color: #13ce66"><i class="el-icon-s-tools"></i> 正常</span>
                                            <span v-else-if="data.recordStatus === 1" style="color: #cd6767"><i class="el-icon-s-tools"></i> 异常</span>
                                            <span v-else style="color: #b3b5b4"><i class="el-icon-s-tools"></i> 无效状态</span>
                                      </div>
                                      <el-divider></el-divider>
                                  </el-col>
                              </el-row>
<pre><code class="language-javascript line-numbers">{{formattedJson1}}</code></pre>
                           </el-card>
                        </el-tabs>
                    </template>
                </el-tab-pane>
                <!--第三个tag页-->
                <el-tab-pane v-if="this.data.recordStatus == 1" label="异常信息" name="third">
                    <template class="tabs-container">
                        <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: -13px">
                           <el-card>
                              <el-row>
                                  <el-col :span="24">
                                      <div class="card-nav">消息状态</div>
                                      <div class="card-nav">
                                            <span v-if="data.recordStatus === 0" style="color: #13ce66"><i class="el-icon-s-tools"></i> 正常</span>
                                            <span v-else-if="data.recordStatus === 1" style="color: #cd6767"><i class="el-icon-s-tools"></i> 异常</span>
                                            <span v-else style="color: #b3b5b4"><i class="el-icon-s-tools"></i> 无效状态</span>
                                      </div>
                                      <el-divider></el-divider>
                                  </el-col>
                              </el-row>
<pre><code class="language-javascript line-numbers">{{formattedJson2}}</code></pre>
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
            mqttRecord: {
                mqttRecordId: '',
                topic: '',
                payload: '',
                messageType: '',
                recordStatus: '',
                exceptionInfo: '',
                policyName: '',
            },
        }
    },
    created() {},
    computed: {
        formattedJson1() {
            return JSON.stringify(JSON.parse(this.data.payload), null, 2); // 格式化 JSON，缩进为 2 个空格
        },
        formattedJson2() {
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