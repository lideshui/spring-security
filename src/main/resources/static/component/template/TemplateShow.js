Vue.component('template-show', {
    props: {
        // 声明接收 data 属性（对应父组件的 propsData）
        data: {
            type: Object,
            default: () => ({}) // 设置默认值避免 undefined
        }
    },
    template: `
    <div class="component template-show">
        <div class="title">
            <span style="color: #a1a0a0;">模板管理<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('template-list')">模板列表<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            模板详情
        </div>
        <template class="tabs-container">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: 20px">
                <!--第一个tag页-->
                <el-tab-pane label="模板详情" name="first">
                   <div class="nav-title">模板信息</div>
                   <el-card :body-style="{ background: '#fafbfc' }">
                        <div style="display: flex;">
                            <img width="240px" src="/img/gateway.png">
                            <el-row class="card-container">
                                <el-col :span="24" style="margin-bottom: 20px">
                                    <div class="card-nav">{{data.templateName}}</div>
                                    <div class="card-desc">{{data.templateCode}}</div>
                                    <el-divider></el-divider>
                                </el-col>
                                <el-col :span="24" style="display: flex">
                                    <div>
                                        <div class="card-attr">轮询方法:</div>
                                        <div class="card-attr">通信协议:</div>
                                        <div class="card-attr">报文总数:</div>
                                        <div class="card-attr">变量总数:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">{{data.pollingMethod}}</div>
                                        <div class="card-text">{{data.communicationProtocol}}</div>
                                        <div class="card-text">{{this.messageList.length}}</div>
                                        <div class="card-text">{{this.variableList.length}}</div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                   </el-card>
                </el-tab-pane>
                <!--第二个tag页-->
                <el-tab-pane label="相关报文" name="second">
                    <div class="table-area">
                        <!-- 报文表格 -->
                        <el-table :data="messageList" style="width: 100%" v-if="this.messageList.length > 0">
                            <el-table-column
                                type="index"
                                width="50">
                            </el-table-column>
                            <!-- 动态渲染 -->
                            <el-table-column 
                                v-for="column in messageColumns" 
                                :key="column.prop"
                                :prop="column.prop"
                                :label="column.label"
                            />
                        </el-table>
                        <el-empty description="该模板下暂无相关报文数据" v-else></el-empty>
                    </div>
                </el-tab-pane>
                <!--第三个tag页-->
                <el-tab-pane label="相关变量" name="third">
                    <div class="table-area">
                        <!-- 报文表格 -->
                        <el-table :data="variableList" style="width: 100%" v-if="this.variableList.length > 0">
                            <el-table-column
                                type="index"
                                width="50">
                            </el-table-column>
                            <!-- 动态渲染 -->
                            <el-table-column 
                                v-for="column in variableColumns" 
                                :key="column.prop"
                                :prop="column.prop"
                                :label="column.label"
                            />
                        </el-table>
                        <el-empty description="该模板下暂无相关变量数据" v-else></el-empty>
                    </div>    
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
    `,
    data() {
        return {
            activeName: 'first',
            messageColumns: [
                { prop: 'messageName', label: '报文名称' },
                { prop: 'requestMessage', label: '报文内容' },
                { prop: 'requestLength', label: '报文长度' },
                { prop: 'createdTime', label: '创建时间' },
            ],
            variableColumns: [
                { prop: 'variableName', label: '变量名称' },
                { prop: 'variableCode', label: '变量编码' },
                { prop: 'registerAddress', label: '寄存器地址' },
                { prop: 'registerLength', label: '寄存器长度' },
                { prop: 'variableUnit', label: '变量单位' },
                { prop: 'variableType', label: '变量类型' },
                { prop: 'coefficient', label: '计算系数' },
                { prop: 'createdTime', label: '创建时间' },
            ],
            messageList: [],
            variableList: [],
        }
    },
    created() {
        // 查询报文
        this.queryMessagePageList()
        // 查询变量
        this.queryVariablePageList()
    },
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
        // 查询报文
        async queryMessagePageList() {
            try {
                const response = await axios.get("/api/message/getList", {
                    params: {templateId: this.data.templateId}
                })
                this.messageList = response.data.data.map(item => ({
                    ...item,
                }))
            } catch (error) {
                console.error("获取列表异常:", error)
                this.$message.error(`获取列表失败: ${error.message}`)
            }
        },
        // 查询变量
        async queryVariablePageList() {
            try {
                const response = await axios.get("/api/variable/getList", {
                    params: {templateId: this.data.templateId}
                })
                this.variableList = response.data.data.map(item => ({
                    ...item,
                }))
            } catch (error) {
                console.error("获取列表异常:", error)
                this.$message.error(`获取列表失败: ${error.message}`)
            }
        },
    }
})