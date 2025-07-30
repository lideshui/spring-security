Vue.component('gateway-show', {
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
            <span style="color: #a1a0a0; cursor: pointer;" @click="linkPage('gateway-list')">网关列表<i style="margin: 0 10px" class="el-icon-arrow-right"></i></span>
            网关详情
        </div>
        <template class="tabs-container">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: 20px">
                <!--第一个tag页-->
                <el-tab-pane label="网关详情" name="first">
                   <div class="nav-title">网关信息</div>
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
                                        <div class="card-attr">网关状态:</div>
                                        <div class="card-attr">网关编码:</div>
                                        <div class="card-attr">网关SN:</div>
                                        <div class="card-attr">网关心跳包:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">
                                            <span v-if="data.gatewayStatus === 0" style="color: #13ce66"><i class="el-icon-upload"></i> 在线</span>
                                            <span v-else-if="data.gatewayStatus === 1" style="color: #cd6767"><i class="el-icon-upload"></i> 离线</span>
                                            <span v-else-if="data.gatewayStatus === 2" style="color: #f1a633"><i class="el-icon-upload"></i> 停用</span>
                                            <span v-else style="color: #b3b5b4"><i class="el-icon-upload"></i> 无效状态</span>
                                        </div>
                                        <div class="card-text">{{data.gatewayCode}}</div>
                                        <div class="card-text">{{data.gatewaySn}}</div>
                                        <div class="card-text">{{data.heartbeat}}</div>
                                    </div>
                                </el-col>
                                <el-col :span="10" style="display: flex">
                                    <div>
                                        <div class="card-attr">网关IMEI:</div>
                                        <div class="card-attr">网关MAC地址:</div>
                                        <div class="card-attr">网关坐标:</div>
                                        <div class="card-attr">安装位置:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">{{data.gatewayImei}}</div>
                                        <div class="card-text">{{data.gatewayMac}}</div>
                                        <div class="card-text">{{data.gatewayCoordinates}}</div>
                                        <div class="card-text">{{data.installationLocation}}</div>
                                    </div>
                                </el-col>
                                <el-col :span="4" style="display: flex">
                                    <div>
                                        <div class="card-attr">网关类型:</div>
                                        <div class="card-attr">网关标签:</div>
                                    </div>
                                    <div style="margin-left: 30px">
                                        <div class="card-text">{{data.gatewayType}}</div>
                                        <div class="card-text">{{data.gatewayTag}}</div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                   </el-card>
                </el-tab-pane>
                <!--第二个tag页-->
                <el-tab-pane label="网络调试" name="second">
                    <el-row :gutter="20">
                        <el-col :span="12" class="send-message">
                            <div class="card-attr">
                                数据日志：
                                <el-checkbox label="时间戳" v-model="timeChecked"></el-checkbox>
                                <el-checkbox label="CRC16" :checked=true disabled></el-checkbox>
                                <el-checkbox label="HEX" :checked=true disabled></el-checkbox>
                            </div>
                            <div class="scrollable-area">
                               <div v-for="(msg, index) in debugMessages" :key="index">
                                  <div v-if="msg.type === 'receive'" style="display: flex">
                                     <div class="gateway-icon" style="color: #f1a633;"><i class="el-icon-upload"></i></div>
                                     <div class="gateway-message" style="background: #f1a633;">
                                        {{ msg.content }}
                                        <span v-if="timeChecked">（{{ msg.time }}）</span>
                                     </div>
                                 </div>
                                 <div v-else style="display: flex; justify-content: right;">
                                     <div class="gateway-message" style="background: #409eff; margin-right: 10px">
                                        {{ msg.content }}
                                        <span v-if="timeChecked">（{{ msg.time }}）</span>
                                     </div>
                                     <div class="gateway-icon" style="color: #409eff; margin: 0;"><i class="el-icon-s-platform"></i></div>
                                 </div>
                               </div>
                            </div>
                            <div class="card-attr" style="margin-top: 20px">
                                请求报文：
                                <el-checkbox label="CRC16" :checked=true disabled></el-checkbox>
                                <el-checkbox label="HEX" :checked=true disabled></el-checkbox>
                            </div>
                            <el-input
                              type="textarea"
                              placeholder="请输入请求报文"
                              v-model="sendMessage"
                              clearable
                              :autosize="{ minRows: 5, maxRows: 5}"
                            ></el-input>
                            <el-button size="mini" type="" class="clean-btn" @click="cleanMessageClick">清空</el-button>
                            <el-button size="mini" type="primary" class="send-btn" @click="sendMessageClick">发送</el-button>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <!--第三个tag页-->
                <el-tab-pane label="请求报文" name="third">
                    <div class="table-area" style="padding-bottom: 60px">
                        <div class="card-attr">请求报文列表</div>
                        <div style="margin: 0 0 10px 0; display: flex; justify-content: space-between;">
                            <el-tag style="margin-top: 10px">
                               <i style="font-size: 16px; line-height: 16px; padding-right: 5px" class="el-icon-warning"></i>
                               录入变量时需要先选择模板报文，变量的寄存器地址以十六进制字符串的表现形式录入，如"016A"。
                           </el-tag>
                           <div>
                              <div class="el-form-item__label">
                                 选择设备
                                 <el-select v-model="deviceId" class="search-item" filterable clearable size="small" style="padding-left: 5px" placeholder="请选择设备">
                                     <el-option
                                         v-for="item in deviceOptions"
                                         :key="item.deviceId"
                                         :label="item.deviceName"
                                         :value="item.deviceId">
                                     </el-option>
                                 </el-select>
                              </div>
                              <el-button size="mini" type="primary" style="height: 32px; margin-top: 4px" @click="searchRequestMessage()">搜索</el-button>
                           </div>
                        </div>
                        <!-- 表格部分 -->
                        <el-table ref="multipleTable" :data="requestMessageList" style="width: 100%" :span-method="arraySpanMethod" border>
                            <el-table-column
                                type="index"
                                width="50">
                            </el-table-column>
                            <!-- 动态渲染 -->
                            <el-table-column 
                                v-for="column in requestMessageColumns" 
                                :key="column.prop"
                                :prop="column.prop"
                                :label="column.label"
                            />
                        </el-table>
                        <!-- 添加分页组件 -->
                        <el-pagination
                            class="pagination-container"
                            @current-change="deviceCurrentChange"
                            @size-change="deviceSizeChange"
                            :current-page="requestMessagePage.pageNum"
                            :page-sizes="[10, 20, 50]"
                            :page-size="requestMessagePage.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="requestMessagePage.total">
                        </el-pagination>
                    </div>

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
            debugMessages: [],
            sendMessage: "",
            webSocket: null,
            WS_URL: `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}/ws`,
            //WS_URL: 'ws://localhost:25552/ws',
            requestMessagePage: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            requestMessageList: [],
            deviceOptions: [],
            deviceId: "",
            requestMessageColumns: [
                { prop: 'deviceName', label: '设备名称' },
                { prop: 'deviceCode', label: '设备编码' },
                { prop: 'deviceAddressBit', label: '十进制地址位' },
                { prop: 'messageName', label: '报文名称' },
                { prop: 'requestMessage', label: '报文内容' },
                { prop: 'variableName', label: '变量名称' },
                { prop: 'variableCode', label: '变量编码' },
                { prop: 'registerLength', label: '变量长度' },
            ],
        }
    },
    beforeDestroy() {
        // 销毁时清理全部socket
        if(this.webSocket){
            this.webSocket.close();
            this.webSocket = null;
            console.log('WebSocket连接已关闭，绑定的网关IP为：', this.data.gatewayIp);
        }
    },
    created() {
        // 查询网关下级设备
        this.getDeviceOptions()
        // 查询请求报文列表
        this.queryRequestMessageList()
    },
    methods: {
        // 标签切换
        handleClick(tab) {
            // 切换到网络调试创建socket
            if(tab.label === "网络调试" && this.webSocket == null){
                // WebSocket 连接配置
                const socket = new WebSocket(this.WS_URL);
                this.webSocket = socket;
                // 当 WebSocket 连接建立时触发
                socket.onopen = () => {
                    socket.send(JSON.stringify({ type: 'bind', content: this.data.gatewayIp }));
                    console.log('WebSocket连接已建立，绑定的网关IP为：', this.data.gatewayIp);
                };
                // 当收到 WebSocket 服务端的消息时触发
                socket.onmessage = (event) => {
                    this.debugMessages.push({type: 'receive', content: event.data, time: this.getCurrentTime()});
                    console.log('成功接收到网关消息：',this.data.gatewayIp ,"内容为：", event.data);
                };
            }
        },
        // 合并表格
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            // 指定需要合并的列（比如 "设备名称" 和 "设备编码" 列）
            const columnsToMerge = ['deviceName', 'deviceCode', 'deviceAddressBit', 'messageName', 'requestMessage']; // 定义需要合并的列的 prop
            if (columnsToMerge.includes(column.property)) {
                let currentValue = row[column.property];
                let previousRow = this.requestMessageList[rowIndex - 1];

                // 如果是第一行，或者当前值与上一行不同，则不合并
                if (rowIndex === 0 || currentValue !== previousRow[column.property]) {
                    let rowspan = 1;
                    // 向下检查有多少行与当前行相同
                    for (let i = rowIndex + 1; i < this.requestMessageList.length; i++) {
                        if (this.requestMessageList[i][column.property] === currentValue) {
                            rowspan++;
                        } else {
                            break;
                        }
                    }
                    return [rowspan, 1]; // 合并行数，列数为 1
                } else {
                    return [0, 0]; // 被合并的单元格隐藏
                }
            }
            return [1, 1]; // 默认不合并
        },
        // 发送调试指令
        sendMessageClick() {
            if(this.sendMessage === ""){
                return;
            }
            // 构造要发送的消息
            const send = { type: 'info', content: this.sendMessage, time: this.getCurrentTime() }
            const data = JSON.stringify(send);
            // 发送消息
            this.debugMessages.push(send);
            this.webSocket.send(data);
            console.log('已发送消息:', this.sendMessage );
            // 清空消息输入框
            this.sendMessage = "";
        },
        // 清空调试指令
        cleanMessageClick() {
            this.debugMessages = []
        },
        // 获取当前时间
        getCurrentTime() {
            const now = new Date();
            // 使用模板字符串直接拼接（更直观）
            return `${now.getFullYear()}-${
                (now.getMonth() + 1).toString().padStart(2, '0')
            }-${
                now.getDate().toString().padStart(2, '0')
            } ${
                now.getHours().toString().padStart(2, '0')
            }:${
                now.getMinutes().toString().padStart(2, '0')
            }:${
                now.getSeconds().toString().padStart(2, '0')
            }`;
        },
        // 跳转页面
        linkPage(component) {
            let paramObj = {
                component: component,
                data: {}
            }
            this.$emit('change-component', paramObj);
        },
        // 获取设备列表
        async getDeviceOptions() {
            try {
                const response = await axios.get("/api/device/getAllList", {
                    params: {
                        gatewayId: this.data.gatewayId,
                    }
                })
                this.deviceOptions = response.data.data;
            } catch (error) {
                console.error("获取列表异常:", error);
            }
        },
        // 分页查询下级报文
        async queryRequestMessageList() {
            try {
                const response = await axios.get("/api/gateway/getRequestMessage", {
                    params: {
                        gatewayId: this.data.gatewayId,
                        deviceId: this.deviceId,
                        pageNum: this.requestMessagePage.pageNum,
                        pageSize: this.requestMessagePage.pageSize
                    }
                })
                this.requestMessageList = response.data.data.list.map(item => ({
                    ...item,
                }))
                this.requestMessagePage.total = response.data.data.total
            } catch (error) {
                console.error("获取列表异常:", error)
                this.$message.error(`获取列表失败: ${error.message}`)
            }
        },
        // 根据设备搜索请求报文
        searchRequestMessage(){
            this.requestMessagePage = {
                pageNum: 1,
                pageSize: 10,
                total: 0,
            }
            this.queryRequestMessageList()
        },
        // 分页插件事件
        deviceCurrentChange(val) {
            this.requestMessagePage.pageNum = val
            this.queryRequestMessageList()
        },
        // 分页插件事件
        deviceSizeChange(val) {
            this.requestMessagePage.pageSize = val
            this.requestMessagePage.pageNum = 1
            this.queryRequestMessageList()
        },
    }
})